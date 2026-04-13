import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/iq-context';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  itemId: string;
  userRole: string;
}

function validateRequest(body: ChatRequest): string | null {
  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return 'messages must be a non-empty array';
  }

  for (const msg of body.messages) {
    if (!msg.role || !msg.content) {
      return 'each message must have a role and content';
    }
    if (msg.role !== 'user' && msg.role !== 'assistant') {
      return 'message role must be "user" or "assistant"';
    }
    if (typeof msg.content !== 'string' || msg.content.length === 0) {
      return 'message content must be a non-empty string';
    }
    if (msg.content.length > 10000) {
      return 'message content exceeds maximum length';
    }
  }

  if (!body.itemId || typeof body.itemId !== 'string') {
    return 'itemId must be a non-empty string';
  }

  if (!body.userRole || (body.userRole !== 'director' && body.userRole !== 'executive')) {
    return 'userRole must be "director" or "executive"';
  }

  return null;
}

export async function POST(request: Request) {
  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'IQ Chat is not configured. Set the ANTHROPIC_API_KEY environment variable.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validate inputs
  const validationError = validateRequest(body);
  if (validationError) {
    return new Response(
      JSON.stringify({ error: validationError }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { messages, itemId, userRole } = body;

  // Build the system prompt with item context
  const systemPrompt = buildSystemPrompt(itemId, userRole as 'director' | 'executive');

  try {
    const client = new Anthropic();

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (streamError) {
          controller.error(streamError);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    // Handle rate limiting
    if (
      error instanceof Anthropic.RateLimitError
    ) {
      return new Response(
        JSON.stringify({ error: 'IQ is temporarily busy. Please try again in a moment.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('IQ Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
