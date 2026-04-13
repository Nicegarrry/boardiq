// BoardIQ — IQ Analysis Pipeline
// Generates structured intelligence analysis from board paper documents

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

// ── Types ──

export interface AnalysisClaim {
  text: string;
  evidence: string;
  confidence: 'high' | 'partial' | 'low';
}

export interface AnalysisAssumption {
  text: string;
  riskIfFalse: string;
}

export interface AnalysisRiskFlag {
  text: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AnalysisDataQuality {
  issue: string;
  detail: string;
}

export interface AnalysisRelatedItem {
  itemId: string;
  connectionType: string;
  detail: string;
}

export interface AnalysisResult {
  headline: string;
  severity: 'alert' | 'watch' | 'ready' | 'good';
  detail: string;
  executiveSummary: string;
  claims: AnalysisClaim[];
  assumptions: AnalysisAssumption[];
  riskFlags: AnalysisRiskFlag[];
  dataQuality: AnalysisDataQuality[];
  relatedItems: AnalysisRelatedItem[];
}

export interface GeneratedQuestion {
  questionText: string;
  rationale: string;
  category: 'strategic' | 'financial' | 'risk' | 'governance' | 'operational' | 'people';
  priority: number;
  directorFraming: string;
  executiveFraming: string;
}

export interface ProcessingResult {
  analysis: AnalysisResult;
  questions: GeneratedQuestion[];
}

// ── Validation ──

const VALID_SEVERITIES = new Set(['alert', 'watch', 'ready', 'good']);
const VALID_CONFIDENCES = new Set(['high', 'partial', 'low']);
const VALID_RISK_SEVERITIES = new Set(['high', 'medium', 'low']);
const VALID_CATEGORIES = new Set([
  'strategic', 'financial', 'risk', 'governance', 'operational', 'people',
]);

function validateProcessingResult(data: unknown): ProcessingResult {
  if (!data || typeof data !== 'object') {
    throw new Error('Response is not a valid object');
  }

  const obj = data as Record<string, unknown>;

  if (!obj.analysis || typeof obj.analysis !== 'object') {
    throw new Error('Missing or invalid "analysis" field');
  }

  if (!Array.isArray(obj.questions)) {
    throw new Error('Missing or invalid "questions" field');
  }

  const analysis = obj.analysis as Record<string, unknown>;

  // Validate required string fields
  for (const field of ['headline', 'detail', 'executiveSummary']) {
    if (typeof analysis[field] !== 'string' || (analysis[field] as string).length === 0) {
      throw new Error(`Missing or empty analysis.${field}`);
    }
  }

  if (!VALID_SEVERITIES.has(analysis.severity as string)) {
    throw new Error(`Invalid analysis.severity: ${analysis.severity}`);
  }

  // Validate claims
  const claims = Array.isArray(analysis.claims) ? analysis.claims : [];
  for (const claim of claims) {
    if (typeof claim.text !== 'string' || typeof claim.evidence !== 'string') {
      throw new Error('Invalid claim: must have text and evidence strings');
    }
    if (!VALID_CONFIDENCES.has(claim.confidence)) {
      throw new Error(`Invalid claim confidence: ${claim.confidence}`);
    }
  }

  // Validate assumptions
  const assumptions = Array.isArray(analysis.assumptions) ? analysis.assumptions : [];
  for (const assumption of assumptions) {
    if (typeof assumption.text !== 'string' || typeof assumption.riskIfFalse !== 'string') {
      throw new Error('Invalid assumption: must have text and riskIfFalse strings');
    }
  }

  // Validate risk flags
  const riskFlags = Array.isArray(analysis.riskFlags) ? analysis.riskFlags : [];
  for (const flag of riskFlags) {
    if (typeof flag.text !== 'string') {
      throw new Error('Invalid risk flag: must have text string');
    }
    if (!VALID_RISK_SEVERITIES.has(flag.severity)) {
      throw new Error(`Invalid risk flag severity: ${flag.severity}`);
    }
  }

  // Validate data quality
  const dataQuality = Array.isArray(analysis.dataQuality) ? analysis.dataQuality : [];
  for (const dq of dataQuality) {
    if (typeof dq.issue !== 'string' || typeof dq.detail !== 'string') {
      throw new Error('Invalid data quality entry: must have issue and detail strings');
    }
  }

  // Validate related items
  const relatedItems = Array.isArray(analysis.relatedItems) ? analysis.relatedItems : [];
  for (const ri of relatedItems) {
    if (typeof ri.itemId !== 'string' || typeof ri.connectionType !== 'string' || typeof ri.detail !== 'string') {
      throw new Error('Invalid related item: must have itemId, connectionType, and detail strings');
    }
  }

  // Validate questions
  const questions = obj.questions as Record<string, unknown>[];
  for (const q of questions) {
    if (typeof q.questionText !== 'string' || (q.questionText as string).length === 0) {
      throw new Error('Invalid question: must have non-empty questionText');
    }
    if (typeof q.rationale !== 'string') {
      throw new Error('Invalid question: must have rationale string');
    }
    if (!VALID_CATEGORIES.has(q.category as string)) {
      throw new Error(`Invalid question category: ${q.category}`);
    }
    if (typeof q.priority !== 'number' || q.priority < 1) {
      throw new Error(`Invalid question priority: ${q.priority}`);
    }
    if (typeof q.directorFraming !== 'string' || typeof q.executiveFraming !== 'string') {
      throw new Error('Invalid question: must have directorFraming and executiveFraming strings');
    }
  }

  return {
    analysis: {
      headline: analysis.headline as string,
      severity: analysis.severity as AnalysisResult['severity'],
      detail: analysis.detail as string,
      executiveSummary: analysis.executiveSummary as string,
      claims: claims as AnalysisClaim[],
      assumptions: assumptions as AnalysisAssumption[],
      riskFlags: riskFlags as AnalysisRiskFlag[],
      dataQuality: dataQuality as AnalysisDataQuality[],
      relatedItems: relatedItems as AnalysisRelatedItem[],
    },
    questions: questions as unknown as GeneratedQuestion[],
  };
}

// ── System Prompt Loading ──

let cachedSystemPrompt: string | null = null;

function loadSystemPrompt(): string {
  if (cachedSystemPrompt) return cachedSystemPrompt;

  try {
    cachedSystemPrompt = readFileSync(
      join(process.cwd(), 'prompts', 'iq-analysis-system.md'),
      'utf-8'
    );
    return cachedSystemPrompt;
  } catch {
    // Fallback: inline minimal prompt if file cannot be read (e.g. edge runtime)
    cachedSystemPrompt = 'You are a board governance analyst. Analyse the provided board papers and produce structured JSON output with analysis and questions.';
    return cachedSystemPrompt;
  }
}

// ── User Message Construction ──

function buildUserMessage(
  itemTitle: string,
  itemDescription: string,
  actionType: string,
  documentTexts: Array<{ filename: string; content: string }>,
  relatedItemContext?: string
): string {
  let message = `## Agenda Item\n\n`;
  message += `**Title:** ${itemTitle}\n`;
  message += `**Action required:** ${actionType}\n`;
  message += `**Description:** ${itemDescription}\n`;

  if (documentTexts.length > 0) {
    message += `\n## Documents\n\n`;
    for (const doc of documentTexts) {
      message += `### ${doc.filename}\n\n`;
      message += `${doc.content}\n\n`;
    }
  }

  if (relatedItemContext) {
    message += `\n## Related Agenda Items (for cross-reference)\n\n`;
    message += relatedItemContext;
  }

  message += `\n## Instructions\n\n`;
  message += `Analyse the documents above and respond with valid JSON matching the schema specified in your system prompt. Do not include any text before or after the JSON.`;

  return message;
}

// ── Main Export ──

export async function generateIQAnalysis(
  itemTitle: string,
  itemDescription: string,
  actionType: string,
  documentTexts: Array<{ filename: string; content: string }>,
  relatedItemContext?: string
): Promise<ProcessingResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const client = new Anthropic();
  const systemPrompt = loadSystemPrompt();
  const userMessage = buildUserMessage(
    itemTitle,
    itemDescription,
    actionType,
    documentTexts,
    relatedItemContext
  );

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  // Extract text content from the response
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in Anthropic response');
  }

  const rawText = textBlock.text.trim();

  // Parse JSON — handle potential markdown code fences
  let jsonText = rawText;
  if (jsonText.startsWith('```')) {
    // Strip markdown code fences
    jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (parseError) {
    throw new Error(
      `Failed to parse JSON from Anthropic response: ${parseError instanceof Error ? parseError.message : 'unknown error'}`
    );
  }

  // Validate and return typed result
  return validateProcessingResult(parsed);
}
