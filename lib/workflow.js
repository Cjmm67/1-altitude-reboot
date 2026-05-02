// Workflow orchestrator — runs the 3 waves with proper dependency ordering.
// Wave 1: parallel context (Historian, Site Sensor, Cartographer, Cultural Scout)
// Wave 2: parallel ideation, reads Wave 1 (Vision, Mission, Concept Inventor, Wedding, Members, Discovery)
// Wave 3: sequential audit + synthesis (Differentiation Auditor, then Synthesiser)

import { AGENTS, WAVE_1, WAVE_2, WAVE_3, WORKFLOW_AGENT_IDS } from "./agents";

async function runAgent({ agentId, inputs, priorOutputs, nudge, signal }) {
  const response = await fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentId, inputs, priorOutputs, nudge }),
    signal,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errData.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Build the priorOutputs dictionary for an agent based on its upstream list
function gatherPriorOutputs(agent, allOutputs) {
  const result = {};
  for (const upstreamId of agent.upstream) {
    if (allOutputs[upstreamId]) {
      result[upstreamId] = allOutputs[upstreamId];
    }
  }
  return result;
}

// Run a single wave in parallel.
async function runWave({ wave, inputs, allOutputs, onAgentUpdate, signal }) {
  const promises = wave.map(async (agent) => {
    onAgentUpdate(agent.id, { state: "running", error: null });

    try {
      const priorOutputs = gatherPriorOutputs(agent, allOutputs);
      const result = await runAgent({
        agentId: agent.id,
        inputs,
        priorOutputs,
        nudge: "",
        signal,
      });
      onAgentUpdate(agent.id, {
        state: "done",
        output: result.output,
        toolActivity: result.toolActivity,
        usage: result.usage,
      });
      return { agentId: agent.id, output: result.output };
    } catch (err) {
      onAgentUpdate(agent.id, {
        state: "error",
        error: err.message,
      });
      return { agentId: agent.id, output: null, error: err.message };
    }
  });

  const results = await Promise.all(promises);
  return results;
}

// Run a wave sequentially (used for Wave 3: Auditor must finish before Synthesiser).
async function runWaveSequential({
  wave,
  inputs,
  allOutputs,
  onAgentUpdate,
  signal,
}) {
  const results = [];
  for (const agent of wave) {
    onAgentUpdate(agent.id, { state: "running", error: null });
    try {
      const priorOutputs = gatherPriorOutputs(agent, allOutputs);
      const result = await runAgent({
        agentId: agent.id,
        inputs,
        priorOutputs,
        nudge: "",
        signal,
      });
      onAgentUpdate(agent.id, {
        state: "done",
        output: result.output,
        toolActivity: result.toolActivity,
        usage: result.usage,
      });
      // Make this agent's output available to subsequent agents in the same wave
      allOutputs[agent.id] = result.output;
      results.push({ agentId: agent.id, output: result.output });
    } catch (err) {
      onAgentUpdate(agent.id, {
        state: "error",
        error: err.message,
      });
      results.push({ agentId: agent.id, output: null, error: err.message });
      // Don't break — let the user retry
    }
  }
  return results;
}

// Main workflow runner.
export async function runWorkflow({ inputs, onAgentUpdate, signal }) {
  const allOutputs = {};

  // Initialize all workflow agents to queued state (skips on-demand agents like stressTester)
  WORKFLOW_AGENT_IDS.forEach((id) => {
    onAgentUpdate(id, { state: "queued", error: null, output: null });
  });

  // Wave 1 — parallel
  const wave1Results = await runWave({
    wave: WAVE_1,
    inputs,
    allOutputs,
    onAgentUpdate,
    signal,
  });
  for (const r of wave1Results) {
    if (r.output) allOutputs[r.agentId] = r.output;
  }

  // Wave 2 — parallel, reads Wave 1
  const wave2Results = await runWave({
    wave: WAVE_2,
    inputs,
    allOutputs,
    onAgentUpdate,
    signal,
  });
  for (const r of wave2Results) {
    if (r.output) allOutputs[r.agentId] = r.output;
  }

  // Wave 3 — sequential (Auditor → Synthesiser)
  await runWaveSequential({
    wave: WAVE_3,
    inputs,
    allOutputs,
    onAgentUpdate,
    signal,
  });

  return allOutputs;
}

// Re-run a single agent with a nudge.
// Returns the new output for the caller to update state.
export async function rerunAgent({ agentId, inputs, allOutputs, nudge, signal }) {
  const agent = AGENTS[agentId];
  if (!agent) throw new Error(`Unknown agent: ${agentId}`);

  const priorOutputs = gatherPriorOutputs(agent, allOutputs);
  const result = await runAgent({
    agentId,
    inputs,
    priorOutputs,
    nudge,
    signal,
  });
  return result;
}
