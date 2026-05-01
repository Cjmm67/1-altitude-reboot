"use client";

import { useState, useCallback, useRef } from "react";
import { AGENTS } from "@/lib/agents";
import { runWorkflow, rerunAgent } from "@/lib/workflow";
import Hero from "@/components/Hero";
import InputsPanel from "@/components/InputsPanel";
import AgentGrid from "@/components/AgentGrid";
import OutputsView from "@/components/OutputsView";
import ComparativePane from "@/components/ComparativePane";

const initialAgentStates = () => {
  const obj = {};
  Object.keys(AGENTS).forEach((id) => {
    obj[id] = { state: "idle", output: null, error: null, toolActivity: [] };
  });
  return obj;
};

export default function Page() {
  const [agentStates, setAgentStates] = useState(initialAgentStates);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [inputs, setInputs] = useState(null);
  const [brianMode, setBrianMode] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const abortRef = useRef(null);

  const updateAgent = useCallback((agentId, patch) => {
    setAgentStates((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], ...patch },
    }));
  }, []);

  const handleRun = useCallback(async (briefingInputs) => {
    setInputs(briefingInputs);
    setIsWorkflowRunning(true);
    setHasRun(true);
    setGlobalError(null);
    abortRef.current = new AbortController();

    try {
      await runWorkflow({
        inputs: briefingInputs,
        onAgentUpdate: updateAgent,
        signal: abortRef.current.signal,
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        setGlobalError(err.message || String(err));
      }
    } finally {
      setIsWorkflowRunning(false);
    }
  }, [updateAgent]);

  const handleRerunAgent = useCallback(async (agentId, nudge) => {
    if (!inputs) return;
    updateAgent(agentId, { state: "running", error: null });

    // Build allOutputs from current state
    const allOutputs = {};
    Object.entries(agentStates).forEach(([id, st]) => {
      if (st.output) allOutputs[id] = st.output;
    });

    try {
      const result = await rerunAgent({
        agentId,
        inputs,
        allOutputs,
        nudge,
        signal: abortRef.current?.signal,
      });
      updateAgent(agentId, {
        state: "done",
        output: result.output,
        toolActivity: result.toolActivity,
        usage: result.usage,
        error: null,
      });
    } catch (err) {
      updateAgent(agentId, {
        state: "error",
        error: err.message || String(err),
      });
    }
  }, [agentStates, inputs, updateAgent]);

  const synthesis = agentStates.synthesiser?.output;
  const conceptInventorOutput = agentStates.conceptInventor?.output;
  const auditorOutput = agentStates.differentiationAuditor?.output;
  const concepts = conceptInventorOutput?.concepts || [];
  const killTests = auditorOutput?.kill_tests || [];

  return (
    <main className="min-h-screen pb-24">
      <Hero />

      <InputsPanel
        onRun={handleRun}
        isRunning={isWorkflowRunning}
        disabled={false}
      />

      {globalError && (
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-12">
          <div className="border border-rose-400/40 bg-rose-400/5 p-5">
            <div className="eyebrow text-rose-300 mb-2">Workflow error</div>
            <div className="text-sm text-rose-200 font-mono break-words">{globalError}</div>
            <p className="text-xs text-rose-300/70 mt-3 font-light">
              Individual agents may still be retried via the &quot;Re-run with nudge&quot; controls below.
            </p>
          </div>
        </div>
      )}

      {hasRun && (
        <AgentGrid
          agentStates={agentStates}
          onRerunAgent={handleRerunAgent}
          isWorkflowRunning={isWorkflowRunning}
        />
      )}

      {concepts.length > 0 && (
        <ComparativePane concepts={concepts} killTests={killTests} />
      )}

      {synthesis && (
        <OutputsView
          synthesis={synthesis}
          brianMode={brianMode}
          onToggleBrianMode={() => setBrianMode(!brianMode)}
        />
      )}

      {/* Footer */}
      <footer className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pt-16 border-t border-midnight-700 hairline">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-platinum-500 font-mono tracking-wider">
            1-Group · Internal · Session-only state · No data persisted
          </p>
          <p className="text-xs text-platinum-600 font-mono">
            claude-sonnet-4 · Multi-agent ideation
          </p>
        </div>
      </footer>
    </main>
  );
}
