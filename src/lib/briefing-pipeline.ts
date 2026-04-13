// BoardIQ — Briefing Narrative Pipeline
// Generates personalised meeting briefing narratives for board members

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

// ── Types ──

export interface MeetingContext {
  date: string;
  title: string;
  itemCount: number;
}

export interface UserContext {
  name: string;
  role: string;
  title?: string;
  committeeRoles: string[];
  presenterItems: string[];
  voterItems: string[];
}

export interface ItemSummary {
  title: string;
  actionType: string;
  iqHeadline?: string;
  iqSeverity?: string;
}

// ── System Prompt Loading ──

let cachedSystemPrompt: string | null = null;

function loadSystemPrompt(): string {
  if (cachedSystemPrompt) return cachedSystemPrompt;

  try {
    cachedSystemPrompt = readFileSync(
      join(process.cwd(), 'prompts', 'briefing-generation-system.md'),
      'utf-8'
    );
    return cachedSystemPrompt;
  } catch {
    // Fallback: inline minimal prompt if file cannot be read
    cachedSystemPrompt = 'You are a chief of staff preparing a board member for their meeting. Write a personalised 2-3 paragraph briefing in second person. Use Australian English.';
    return cachedSystemPrompt;
  }
}

// ── User Message Construction ──

function buildUserMessage(
  meetingContext: MeetingContext,
  userContext: UserContext,
  itemSummaries: ItemSummary[],
  mode: 'prep' | 'day'
): string {
  let message = `## Meeting\n\n`;
  message += `**Title:** ${meetingContext.title}\n`;
  message += `**Date:** ${meetingContext.date}\n`;
  message += `**Items:** ${meetingContext.itemCount}\n`;
  message += `**Mode:** ${mode === 'prep' ? 'Preparation (5 days before meeting)' : 'Meeting Day'}\n`;

  message += `\n## Board Member\n\n`;
  message += `**Name:** ${userContext.name}\n`;
  message += `**Role:** ${userContext.role}\n`;
  if (userContext.title) {
    message += `**Title:** ${userContext.title}\n`;
  }
  if (userContext.committeeRoles.length > 0) {
    message += `**Committee roles:** ${userContext.committeeRoles.join(', ')}\n`;
  }
  if (userContext.presenterItems.length > 0) {
    message += `**Presenting on:** ${userContext.presenterItems.join(', ')}\n`;
  }
  if (userContext.voterItems.length > 0) {
    message += `**Voting on:** ${userContext.voterItems.join(', ')}\n`;
  }

  message += `\n## Agenda Items\n\n`;
  for (let i = 0; i < itemSummaries.length; i++) {
    const item = itemSummaries[i];
    message += `${i + 1}. **${item.title}** (${item.actionType})`;
    if (item.iqHeadline) {
      message += ` — IQ: ${item.iqHeadline}`;
      if (item.iqSeverity) {
        message += ` [${item.iqSeverity}]`;
      }
    }
    message += `\n`;
  }

  message += `\n## Instructions\n\n`;
  message += `Write a personalised ${mode === 'prep' ? 'preparation' : 'meeting day'} briefing for ${userContext.name}. `;
  message += `Keep it to 2-3 paragraphs of flowing prose. Be specific — reference item numbers and names. `;
  message += `Respond with the briefing text only, no headers or formatting.`;

  return message;
}

// ── Main Export ──

export async function generateBriefingNarrative(
  meetingContext: MeetingContext,
  userContext: UserContext,
  itemSummaries: ItemSummary[],
  mode: 'prep' | 'day'
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const client = new Anthropic();
  const systemPrompt = loadSystemPrompt();
  const userMessage = buildUserMessage(meetingContext, userContext, itemSummaries, mode);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  // Extract text content from the response
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in Anthropic response');
  }

  return textBlock.text.trim();
}
