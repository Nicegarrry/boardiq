// BoardIQ — IQ Document Processing Endpoint
// POST /api/iq-process
// Triggers AI analysis of board papers for an agenda item

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { generateIQAnalysis } from '@/lib/iq-pipeline';

interface ProcessRequest {
  agendaItemId: string;
}

// ── Supabase Server Client (service role for writes) ──

async function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service role configuration is missing');
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

// ── Helper: Build related item context for cross-referencing ──

async function buildRelatedItemContext(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  meetingId: string,
  currentItemId: string
): Promise<string> {
  const { data: siblingItems } = await supabase
    .from('agenda_items')
    .select('id, item_number, title, description, action_type')
    .eq('meeting_id', meetingId)
    .neq('id', currentItemId)
    .is('deleted_at', null)
    .order('sort_order');

  if (!siblingItems || siblingItems.length === 0) return '';

  let context = '';
  for (const item of siblingItems) {
    context += `- Item ${item.item_number}: ${item.title} (${item.action_type})`;
    if (item.description) {
      // Truncate long descriptions for context
      const desc = item.description.length > 200
        ? item.description.substring(0, 200) + '...'
        : item.description;
      context += ` — ${desc}`;
    }
    context += '\n';
  }

  return context;
}

// ── POST Handler ──

export async function POST(request: Request) {
  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'IQ processing is not configured. Set the ANTHROPIC_API_KEY environment variable.' },
      { status: 500 }
    );
  }

  // Parse request
  let body: ProcessRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Invalid JSON in request body.' },
      { status: 400 }
    );
  }

  const { agendaItemId } = body;
  if (!agendaItemId || typeof agendaItemId !== 'string') {
    return Response.json(
      { error: 'agendaItemId must be a non-empty string.' },
      { status: 400 }
    );
  }

  let supabase: Awaited<ReturnType<typeof createServiceClient>>;
  try {
    supabase = await createServiceClient();
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return Response.json(
      { error: 'Database connection failed. Check Supabase configuration.' },
      { status: 500 }
    );
  }

  // ── Step 1: Fetch agenda item ──

  const { data: agendaItem, error: itemError } = await supabase
    .from('agenda_items')
    .select('id, meeting_id, org_id, item_number, title, description, action_type, iq_status')
    .eq('id', agendaItemId)
    .is('deleted_at', null)
    .single();

  if (itemError || !agendaItem) {
    return Response.json(
      { error: `Agenda item not found: ${agendaItemId}` },
      { status: 404 }
    );
  }

  // ── Step 2: Mark as processing ──

  await supabase
    .from('agenda_items')
    .update({ iq_status: 'processing' })
    .eq('id', agendaItemId);

  // ── Step 3: Fetch documents ──

  const { data: documents, error: docError } = await supabase
    .from('documents')
    .select('id, filename, extracted_text, processing_status')
    .eq('agenda_item_id', agendaItemId)
    .is('deleted_at', null)
    .eq('is_current', true)
    .order('sort_order');

  if (docError) {
    console.error('Failed to fetch documents:', docError);
    await supabase
      .from('agenda_items')
      .update({ iq_status: 'error' })
      .eq('id', agendaItemId);
    return Response.json(
      { error: 'Failed to fetch documents for this agenda item.' },
      { status: 500 }
    );
  }

  // Filter to documents with extracted text
  const documentTexts = (documents ?? [])
    .filter((doc) => doc.extracted_text && doc.extracted_text.length > 0)
    .map((doc) => ({
      filename: doc.filename,
      content: doc.extracted_text as string,
    }));

  if (documentTexts.length === 0) {
    await supabase
      .from('agenda_items')
      .update({ iq_status: 'error' })
      .eq('id', agendaItemId);
    return Response.json(
      { error: 'No documents with extracted text found. Upload and process documents before running IQ analysis.' },
      { status: 422 }
    );
  }

  // ── Step 4: Build related item context ──

  const relatedItemContext = await buildRelatedItemContext(
    supabase,
    agendaItem.meeting_id,
    agendaItemId
  );

  // ── Step 5: Generate IQ analysis ──

  let result;
  try {
    result = await generateIQAnalysis(
      agendaItem.title,
      agendaItem.description ?? '',
      agendaItem.action_type,
      documentTexts,
      relatedItemContext || undefined
    );
  } catch (err) {
    console.error('IQ analysis generation failed:', err);
    await supabase
      .from('agenda_items')
      .update({ iq_status: 'error' })
      .eq('id', agendaItemId);
    return Response.json(
      { error: `Analysis generation failed: ${err instanceof Error ? err.message : 'unknown error'}` },
      { status: 500 }
    );
  }

  // ── Step 6: Store analysis in iq_analyses ──

  const sourceDocIds = (documents ?? [])
    .filter((doc) => doc.extracted_text && doc.extracted_text.length > 0)
    .map((doc) => doc.id);

  // Upsert — if an analysis already exists for this item, replace it
  const { data: analysisRow, error: analysisError } = await supabase
    .from('iq_analyses')
    .upsert(
      {
        agenda_item_id: agendaItemId,
        org_id: agendaItem.org_id,
        headline: result.analysis.headline,
        severity: result.analysis.severity,
        detail: result.analysis.detail,
        executive_summary: result.analysis.executiveSummary,
        claims: result.analysis.claims,
        assumptions: result.analysis.assumptions,
        risk_flags: result.analysis.riskFlags,
        data_quality: result.analysis.dataQuality,
        related_items: result.analysis.relatedItems,
        model_used: 'claude-sonnet-4-20250514',
        prompt_version: 'v1.0',
        source_doc_ids: sourceDocIds,
        generated_at: new Date().toISOString(),
      },
      { onConflict: 'agenda_item_id' }
    )
    .select('id')
    .single();

  if (analysisError || !analysisRow) {
    console.error('Failed to store IQ analysis:', analysisError);
    await supabase
      .from('agenda_items')
      .update({ iq_status: 'error' })
      .eq('id', agendaItemId);
    return Response.json(
      { error: 'Failed to store analysis results.' },
      { status: 500 }
    );
  }

  // ── Step 7: Store questions in iq_questions ──

  // Delete existing questions for this analysis (regeneration case)
  await supabase
    .from('iq_questions')
    .delete()
    .eq('iq_analysis_id', analysisRow.id);

  const questionRows = result.questions.map((q, index) => ({
    iq_analysis_id: analysisRow.id,
    agenda_item_id: agendaItemId,
    org_id: agendaItem.org_id,
    question_text: q.questionText,
    rationale: q.rationale,
    category: q.category,
    priority: q.priority,
    director_framing: q.directorFraming,
    executive_framing: q.executiveFraming,
    sort_order: index,
  }));

  if (questionRows.length > 0) {
    const { error: questionsError } = await supabase
      .from('iq_questions')
      .insert(questionRows);

    if (questionsError) {
      console.error('Failed to store IQ questions:', questionsError);
      // Non-fatal: analysis is saved, questions failed
    }
  }

  // ── Step 8: Update agenda item status ──

  await supabase
    .from('agenda_items')
    .update({
      iq_status: 'ready',
      iq_processed_at: new Date().toISOString(),
    })
    .eq('id', agendaItemId);

  // ── Response ──

  return Response.json({
    success: true,
    agendaItemId,
    analysisId: analysisRow.id,
    severity: result.analysis.severity,
    headline: result.analysis.headline,
    questionsGenerated: result.questions.length,
    documentsAnalysed: documentTexts.length,
  });
}
