import { AGENTS } from "@/lib/agents";
import {
  parseAgentJSON,
  extractTextFromAnthropicResponse,
  extractToolActivity,
} from "@/lib/parseJSON";

export const runtime = "nodejs";
export const maxDuration = 60;

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1500;

async function callAnthropic({ systemPrompt, userMessage, useWebSearch }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable not set");
  }

  const body = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  };

  if (useWebSearch) {
    body.tools = [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 4,
      },
    ];
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  return data;
}

function buildUserMessage({ agent, inputs, priorOutputs, nudge }) {
  const lines = [];

  // Inputs from Chris (briefing parameters)
  if (inputs && Object.keys(inputs).length > 0) {
    lines.push("=== BRIEFING PARAMETERS FROM CHRIS ===");
    if (inputs.ambition) lines.push(`Ambition tilt: ${inputs.ambition} (0=incremental, 100=category-defining)`);
    if (inputs.audienceTilt) lines.push(`Audience tilt: ${inputs.audienceTilt}`);
    if (typeof inputs.weddingWeight === "number") lines.push(`Wedding emphasis weight: ${inputs.weddingWeight}/10`);
    if (typeof inputs.membersWeight === "number") lines.push(`Members' layer weight: ${inputs.membersWeight}/10`);
    if (inputs.additionalBrief?.trim()) {
      lines.push(`Additional brief: ${inputs.additionalBrief.trim()}`);
    }
    if (inputs.explicitAvoid?.trim()) {
      lines.push(`Explicitly avoid: ${inputs.explicitAvoid.trim()}`);
    }
    lines.push("");
  }

  // Upstream agent outputs
  if (priorOutputs && Object.keys(priorOutputs).length > 0) {
    lines.push("=== UPSTREAM AGENT OUTPUTS YOU MUST READ AND REASON FROM ===");
    for (const [upstreamId, output] of Object.entries(priorOutputs)) {
      const upstreamAgent = AGENTS[upstreamId];
      if (!upstreamAgent || !output) continue;
      lines.push(`\n--- ${upstreamAgent.name} ---`);
      lines.push(JSON.stringify(output, null, 2));
    }
    lines.push("");
  }

  // Nudge
  if (nudge?.trim()) {
    lines.push("=== DIRECTIONAL NUDGE FROM CHRIS ===");
    lines.push(nudge.trim());
    lines.push("");
  }

  lines.push("=== TASK ===");
  lines.push(
    `Execute your role as ${agent.name}. Run your three-pass reasoning (divergent → critique → refine) internally and return ONLY the final JSON object matching the schema in your system prompt. No preamble. No markdown fences. Just JSON.`
  );

  return lines.join("\n");
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { agentId, inputs = {}, priorOutputs = {}, nudge = "" } = payload;

    if (!agentId || !AGENTS[agentId]) {
      return Response.json(
        { error: `Unknown agent: ${agentId}` },
        { status: 400 }
      );
    }

    const agent = AGENTS[agentId];
    const userMessage = buildUserMessage({ agent, inputs, priorOutputs, nudge });

    const data = await callAnthropic({
      systemPrompt: agent.systemPrompt,
      userMessage,
      useWebSearch: agent.useWebSearch,
    });

    const rawText = extractTextFromAnthropicResponse(data);
    const toolActivity = extractToolActivity(data);

    let parsed;
    try {
      parsed = parseAgentJSON(rawText);
    } catch (parseErr) {
      return Response.json(
        {
          error: `Agent returned invalid JSON: ${parseErr.message}`,
          rawText: rawText.slice(0, 500),
        },
        { status: 502 }
      );
    }

    return Response.json({
      agentId,
      agentName: agent.name,
      output: parsed,
      toolActivity,
      stopReason: data.stop_reason,
      usage: data.usage,
    });
  } catch (err) {
    console.error("[/api/agent] error:", err);
    return Response.json(
      { error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
