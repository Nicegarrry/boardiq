// BoardIQ — IQ Chat Context Builder
// Constructs scoped system prompts for AI chat conversations

import { agendaItems, organisation } from './mock-data';

const BASE_SYSTEM_PROMPT = `You are IQ, the AI intelligence assistant built into BoardIQ — a board governance platform. You have access to the documents, analysis, and context for the current agenda item.

## Role
- For directors: Help them prepare insightful questions, understand key risks, and identify evidence gaps in board papers
- For executives: Help them anticipate board questions, strengthen their presentations, and identify areas needing additional evidence

## Guidelines
- Be precise and evidence-based — cite specific figures, page numbers, and claims from the documents
- Flag contradictions between documents or with prior board papers
- Identify unstated assumptions that the paper relies on
- Suggest questions categorised as: Strategic, Financial, Risk, Governance, Operational, People
- When uncertain, say so — do not fabricate information
- Maintain appropriate tone for board governance context — professional, measured, analytical
- Never provide legal, financial, or medical advice
- Focus on governance effectiveness, not operational management

## Constraints
- Only reference information from the provided document context
- Do not access or reference information from other agenda items unless explicitly provided in cross-references
- Keep responses concise — directors are time-poor
- Use Australian English spelling conventions`;

const DISCLAIMER = `\n\nDisclaimer: IQ analysis is AI-generated to support your preparation. It does not constitute professional advice. Always apply your own judgement and expertise.`;

function buildRoleContext(userRole: 'director' | 'executive'): string {
  if (userRole === 'director') {
    return `\n\nYou are speaking with a board director. Help them prepare insightful questions for the board meeting. Focus on governance oversight, risk identification, and holding management accountable with evidence-based inquiry.`;
  }
  return `\n\nYou are speaking with an executive presenter. Help them anticipate the questions the board will ask, identify weak points in their paper, and prepare strong evidence-based responses.`;
}

function buildItemContext(itemId: string): string {
  const item = agendaItems.find((i) => i.id === itemId);
  if (!item) return '';

  let context = `\n\n--- AGENDA ITEM CONTEXT ---\n`;
  context += `Item: \u00a7${item.itemNumber} \u2014 ${item.title}\n`;
  context += `Action required: ${item.actionType}\n`;
  context += `Duration: ${item.durationMinutes} minutes\n`;
  context += `Presenters: ${item.presenters.map((p) => `${p.name} (${p.title})`).join(', ')}\n`;
  context += `Description: ${item.description}\n`;

  // Document summaries
  if (item.documents.length > 0) {
    context += `\n--- DOCUMENT SUMMARIES ---\n`;
    item.documents.forEach((doc) => {
      context += `\n[${doc.filename}] (${doc.pageCount} pages, ${doc.fileSize})\n`;
      context += `${doc.summary}\n`;
    });
  }

  // IQ analysis
  if (item.iqAnalysis) {
    context += `\n--- IQ ANALYSIS ---\n`;
    context += `Severity: ${item.iqAnalysis.severity}\n`;
    context += `Headline: ${item.iqAnalysis.headline}\n`;
    context += `${item.iqAnalysis.detail}\n`;

    if (item.iqAnalysis.claims.length > 0) {
      context += `\nKey claims identified:\n`;
      item.iqAnalysis.claims.forEach((c) => {
        context += `- "${c.claim}" \u2014 confidence: ${c.confidence}`;
        if (c.flags.length > 0) {
          context += ` \u2014 flags: ${c.flags.join('; ')}`;
        }
        context += `\n`;
      });
    }

    if (item.iqAnalysis.assumptions.length > 0) {
      context += `\nUnstated assumptions:\n`;
      item.iqAnalysis.assumptions.forEach((a) => {
        context += `- [${a.severity}] ${a.assumption}: ${a.detail}\n`;
      });
    }

    if (item.iqAnalysis.riskFlags.length > 0) {
      context += `\nRisk flags:\n`;
      item.iqAnalysis.riskFlags.forEach((r) => {
        context += `- [${r.severity}] ${r.flag}: ${r.detail}\n`;
      });
    }

    if (item.iqAnalysis.dataQuality.length > 0) {
      context += `\nData quality issues:\n`;
      item.iqAnalysis.dataQuality.forEach((d) => {
        context += `- ${d.issue}: ${d.detail}\n`;
      });
    }

    // Cross-references to related items
    if (item.iqAnalysis.relatedItems.length > 0) {
      context += `\nCross-references to other agenda items:\n`;
      item.iqAnalysis.relatedItems.forEach((r) => {
        const related = agendaItems.find((i) => i.id === r.agendaItemId);
        if (related) {
          context += `- \u00a7${related.itemNumber} ${related.title} [${r.relationshipType}]: ${r.detail}\n`;
        }
      });
    }
  }

  return context;
}

function buildOrgContext(): string {
  return `\n\nOrganisation: ${organisation.name}\n${organisation.description}\n\nMeeting: Board of Directors, Thursday 16 April 2026, 1:00 PM \u2013 4:30 PM`;
}

export function buildSystemPrompt(
  itemId: string,
  userRole: 'director' | 'executive'
): string {
  return (
    BASE_SYSTEM_PROMPT +
    buildRoleContext(userRole) +
    buildOrgContext() +
    buildItemContext(itemId) +
    DISCLAIMER
  );
}
