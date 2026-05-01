"use client";

import { WAVE_1, WAVE_2, WAVE_3 } from "@/lib/agents";
import AgentCard from "./AgentCard";

const WAVES = [
  { number: 1, agents: WAVE_1, label: "Wave 1 · Context", description: "Parallel — building the contextual base" },
  { number: 2, agents: WAVE_2, label: "Wave 2 · Divergent ideation", description: "Parallel — agents read Wave 1, ideate independently" },
  { number: 3, agents: WAVE_3, label: "Wave 3 · Audit & synthesis", description: "Sequential — Differentiation Auditor → Synthesiser" },
];

function isWaveActive(wave, agentStates) {
  return wave.agents.some((a) => agentStates[a.id]?.state === "running");
}

function isWaveComplete(wave, agentStates) {
  return wave.agents.every((a) =>
    ["done", "error"].includes(agentStates[a.id]?.state)
  );
}

export default function AgentGrid({ agentStates, onRerunAgent, isWorkflowRunning }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pb-24">
      <div className="space-y-16">
        {WAVES.map((wave) => {
          const active = isWaveActive(wave, agentStates);
          const complete = isWaveComplete(wave, agentStates);
          return (
            <div key={wave.number} className="space-y-6">
              {/* Wave header */}
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <div className="eyebrow mb-2">
                    {wave.label}
                  </div>
                  <p className="text-sm text-platinum-400 font-light italic">
                    {wave.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {active && (
                    <span className="text-[10px] eyebrow text-champagne-400 animate-pulse-soft">
                      in progress
                    </span>
                  )}
                  {complete && !active && (
                    <span className="text-[10px] eyebrow text-emerald-400">
                      complete
                    </span>
                  )}
                </div>
              </div>

              {/* Agent cards grid */}
              <div className={`grid gap-4 ${
                wave.number === 1
                  ? "grid-cols-1 md:grid-cols-2"
                  : wave.number === 2
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2"
              }`}>
                {wave.agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    agentState={agentStates[agent.id]}
                    onRerun={onRerunAgent}
                    isWorkflowRunning={isWorkflowRunning}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
