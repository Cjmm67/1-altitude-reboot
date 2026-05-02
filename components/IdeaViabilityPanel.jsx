"use client";

import { useState, useCallback } from "react";
import {
  Microscope,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  ShieldOff,
  ShieldAlert,
  Skull,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const SCORE_LABELS = {
  strategic_fit: "Strategic fit",
  defensibility: "Defensibility",
  brand_fit: "Brand fit",
  operational_feasibility: "Operational feasibility",
  commercial_logic: "Commercial logic",
};

const VERDICT_STYLES = {
  advance: {
    border: "border-emerald-400/40",
    bg: "bg-emerald-400/5",
    text: "text-emerald-300",
    icon: ShieldCheck,
    label: "Advance",
  },
  refine: {
    border: "border-champagne-400/40",
    bg: "bg-champagne-400/5",
    text: "text-champagne-400",
    icon: ShieldAlert,
    label: "Refine",
  },
  kill: {
    border: "border-rose-400/40",
    bg: "bg-rose-400/5",
    text: "text-rose-300",
    icon: Skull,
    label: "Kill",
  },
};

const SURVIVAL_STYLES = {
  survives: { icon: ShieldCheck, color: "text-emerald-300", label: "Survives" },
  "partially survives": { icon: ShieldAlert, color: "text-champagne-400", label: "Partially survives" },
  dies: { icon: ShieldOff, color: "text-rose-300", label: "Dies" },
};

function ScoreBar({ score }) {
  const pct = Math.max(0, Math.min(5, score)) * 20;
  const color =
    score >= 4 ? "bg-emerald-400" : score >= 3 ? "bg-champagne-400" : "bg-rose-400";
  return (
    <div className="h-1.5 bg-midnight-700 hairline overflow-hidden">
      <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Result({ output }) {
  if (!output) return null;

  const verdictKey = (output.verdict?.call || "").toLowerCase();
  const VStyle = VERDICT_STYLES[verdictKey] || VERDICT_STYLES.refine;
  const VIcon = VStyle.icon;

  const survivalKey = (output.kill_test?.survival_verdict || "").toLowerCase();
  const SStyle = SURVIVAL_STYLES[survivalKey] || SURVIVAL_STYLES["partially survives"];
  const SIcon = SStyle.icon;

  const scoreEntries = Object.entries(output.scores || {});

  return (
    <div className="mt-8 space-y-8">
      {/* The idea as understood */}
      {output.the_idea_as_understood && (
        <div>
          <div className="eyebrow mb-2 text-platinum-500">The idea, as understood</div>
          <p className="text-platinum-200 font-light italic leading-relaxed">
            &ldquo;{output.the_idea_as_understood}&rdquo;
          </p>
          {output.context_completeness && (
            <p className="text-xs text-platinum-500 font-mono mt-3">
              {output.context_completeness}
            </p>
          )}
        </div>
      )}

      {/* Verdict — top of fold */}
      <div className={`border ${VStyle.border} ${VStyle.bg} hairline-strong p-6`}>
        <div className="flex items-start gap-5 flex-wrap">
          <div className={`flex items-center gap-3 ${VStyle.text}`}>
            <VIcon size={28} strokeWidth={1.5} />
            <div>
              <div className="eyebrow opacity-80">Verdict</div>
              <div className="display text-2xl">{VStyle.label}</div>
            </div>
          </div>
          {output.verdict?.grade && (
            <div className="ml-auto text-right">
              <div className="eyebrow text-platinum-500">Grade</div>
              <div className={`display text-4xl ${VStyle.text}`}>
                {output.verdict.grade}
              </div>
            </div>
          )}
        </div>
        {output.verdict?.headline && (
          <p className="mt-5 text-platinum-100 font-light leading-relaxed text-base">
            {output.verdict.headline}
          </p>
        )}
        {(output.verdict?.if_advance || output.verdict?.if_refine || output.verdict?.if_kill) && (
          <div className="mt-4 pt-4 border-t border-midnight-700 hairline">
            <div className="eyebrow mb-2 text-platinum-500">Next move</div>
            <p className="text-sm text-platinum-300 font-light leading-relaxed">
              {output.verdict.if_advance || output.verdict.if_refine || output.verdict.if_kill}
            </p>
          </div>
        )}
      </div>

      {/* Scores grid */}
      {scoreEntries.length > 0 && (
        <div>
          <div className="eyebrow mb-4 text-platinum-500">Scoring (1–5)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoreEntries.map(([key, val]) => (
              <div
                key={key}
                className="border border-midnight-600 hairline p-4 bg-midnight-900/40"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-sm text-platinum-200 font-light">
                    {SCORE_LABELS[key] || key}
                  </div>
                  <div className="font-mono text-lg text-champagne-400">
                    {val.score}
                  </div>
                </div>
                <ScoreBar score={val.score} />
                {val.reasoning && (
                  <p className="mt-3 text-xs text-platinum-400 font-light leading-relaxed">
                    {val.reasoning}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kill test */}
      {output.kill_test && (
        <div className="border border-midnight-600 hairline-strong p-6 bg-midnight-900/40">
          <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
            <div className="eyebrow text-platinum-500">Kill test</div>
            <div className={`flex items-center gap-2 ${SStyle.color}`}>
              <SIcon size={16} strokeWidth={1.5} />
              <span className="text-sm font-light">{SStyle.label}</span>
            </div>
          </div>
          {output.kill_test.why && (
            <p className="text-sm text-platinum-300 font-light leading-relaxed mb-5">
              {output.kill_test.why}
            </p>
          )}
          {Array.isArray(output.kill_test.competitor_responses) &&
            output.kill_test.competitor_responses.length > 0 && (
              <div className="space-y-3">
                {output.kill_test.competitor_responses.map((r, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-midnight-600 pl-4 py-1"
                  >
                    <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
                      <div className="text-sm text-champagne-400 font-light">
                        {r.competitor}
                      </div>
                      <div
                        className={`text-xs font-mono ${
                          r.moat_survives ? "text-emerald-400" : "text-rose-300"
                        }`}
                      >
                        {r.moat_survives ? "moat holds" : "moat breaks"}
                      </div>
                    </div>
                    <p className="text-xs text-platinum-300 font-light italic leading-relaxed">
                      {r.likely_response}
                    </p>
                    {r.moat_reasoning && (
                      <p className="text-xs text-platinum-500 font-light leading-relaxed mt-1">
                        {r.moat_reasoning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Strengths / Weaknesses */}
      {(output.strengths?.length || output.weaknesses?.length) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {output.strengths?.length > 0 && (
            <div className="border border-emerald-400/20 bg-emerald-400/5 hairline p-5">
              <div className="flex items-center gap-2 mb-3 text-emerald-300">
                <TrendingUp size={14} strokeWidth={1.5} />
                <span className="eyebrow">Strengths</span>
              </div>
              <ul className="space-y-2">
                {output.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="text-sm text-platinum-200 font-light leading-relaxed flex gap-2"
                  >
                    <span className="text-emerald-400/60 font-mono text-xs mt-0.5">
                      +
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {output.weaknesses?.length > 0 && (
            <div className="border border-rose-400/20 bg-rose-400/5 hairline p-5">
              <div className="flex items-center gap-2 mb-3 text-rose-300">
                <TrendingDown size={14} strokeWidth={1.5} />
                <span className="eyebrow">Weaknesses</span>
              </div>
              <ul className="space-y-2">
                {output.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="text-sm text-platinum-200 font-light leading-relaxed flex gap-2"
                  >
                    <span className="text-rose-400/60 font-mono text-xs mt-0.5">
                      &minus;
                    </span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Hidden risk */}
      {output.biggest_hidden_risk?.risk && (
        <div className="border border-rose-400/30 bg-rose-400/5 hairline-strong p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              strokeWidth={1.5}
              className="text-rose-300 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="eyebrow text-rose-300 mb-2">Biggest hidden risk</div>
              <p className="text-sm text-platinum-100 font-light leading-relaxed">
                {output.biggest_hidden_risk.risk}
              </p>
              {output.biggest_hidden_risk.why_it_is_hidden && (
                <p className="text-xs text-platinum-400 font-light italic leading-relaxed mt-3">
                  Why it&rsquo;s hidden: {output.biggest_hidden_risk.why_it_is_hidden}
                </p>
              )}
              {output.biggest_hidden_risk.how_to_test_it_cheaply && (
                <p className="text-xs text-emerald-300/80 font-light leading-relaxed mt-2">
                  Cheap test: {output.biggest_hidden_risk.how_to_test_it_cheaply}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Strengthening moves */}
      {Array.isArray(output.strengthening_moves) && output.strengthening_moves.length > 0 && (
        <div>
          <div className="eyebrow mb-3 text-platinum-500">Strengthening moves</div>
          <div className="space-y-3">
            {output.strengthening_moves.map((m, i) => (
              <div
                key={i}
                className="border border-midnight-600 hairline p-4 bg-midnight-900/40"
              >
                <div className="flex items-start gap-3">
                  <Sparkles
                    size={14}
                    strokeWidth={1.5}
                    className="text-champagne-400 flex-shrink-0 mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-platinum-100 font-light mb-1">
                      {m.move}
                    </div>
                    {m.what_it_does && (
                      <p className="text-xs text-platinum-300 font-light leading-relaxed">
                        {m.what_it_does}
                      </p>
                    )}
                    {m.what_it_costs && (
                      <p className="text-xs text-platinum-500 font-light italic leading-relaxed mt-1">
                        Cost: {m.what_it_costs}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison to inventor concepts */}
      {output.comparison_to_inventor_concepts?.comparison_possible && (
        <div className="border border-midnight-600 hairline p-5 bg-midnight-900/40">
          <div className="eyebrow mb-3 text-platinum-500">
            vs. the Concept Inventor&rsquo;s six
          </div>
          {output.comparison_to_inventor_concepts.honest_summary && (
            <p className="text-sm text-platinum-200 font-light leading-relaxed mb-3">
              {output.comparison_to_inventor_concepts.honest_summary}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {output.comparison_to_inventor_concepts.best_concept_user_idea_beats && (
              <div>
                <div className="text-emerald-300 font-mono mb-1">Beats</div>
                <div className="text-platinum-300 font-light">
                  {output.comparison_to_inventor_concepts.best_concept_user_idea_beats}
                </div>
              </div>
            )}
            {output.comparison_to_inventor_concepts.concept_user_idea_loses_to && (
              <div>
                <div className="text-rose-300 font-mono mb-1">Loses to</div>
                <div className="text-platinum-300 font-light">
                  {output.comparison_to_inventor_concepts.concept_user_idea_loses_to}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function IdeaViabilityPanel({
  agentState,
  inputs,
  agentStates,
  onRunStressTest,
}) {
  const [idea, setIdea] = useState("");

  const isRunning = agentState?.state === "running";
  const isDone = agentState?.state === "done";
  const isError = agentState?.state === "error";
  const output = agentState?.output;
  const errorMessage = agentState?.error;

  const handleRun = useCallback(() => {
    if (!idea.trim() || isRunning) return;
    onRunStressTest(idea.trim());
  }, [idea, isRunning, onRunStressTest]);

  // Count of upstream agents that have outputs available
  const upstreamIds = [
    "historian",
    "siteSensor",
    "competitiveCartographer",
    "culturalScout",
    "conceptInventor",
    "differentiationAuditor",
    "synthesiser",
  ];
  const availableUpstream = upstreamIds.filter(
    (id) => agentStates?.[id]?.output
  ).length;

  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pb-20">
      <div className="border border-midnight-600 hairline-strong bg-midnight-900/60 backdrop-blur-sm">
        <div className="border-b border-midnight-600 hairline-strong px-8 py-5 flex items-baseline justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Microscope
              size={20}
              strokeWidth={1.5}
              className="text-champagne-400"
            />
            <div>
              <h2 className="display text-2xl text-platinum-100">
                The Stress-Tester
              </h2>
              <p className="text-xs text-platinum-500 font-light italic mt-0.5">
                Test your own idea against the strategic context. Honest grading,
                no sycophancy.
              </p>
            </div>
          </div>
          <span className="eyebrow text-platinum-500">
            {availableUpstream === 0
              ? "no agents run yet — will reason from brief alone"
              : `${availableUpstream}/7 upstream agents available`}
          </span>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="eyebrow mb-3 block">Your idea</label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. A vertical-stack proposition where L63 is a mid-week locals-only sky garden, L62 a chef-led izakaya, L61 a wedding-and-events floor with bridal suite. Brand promise: 'the floor that knows you'..."
              rows={6}
              disabled={isRunning}
              className="w-full bg-midnight-950 border border-midnight-600 hairline p-4 text-sm text-platinum-100 font-light leading-relaxed placeholder:text-platinum-500/60 focus:outline-none focus:border-champagne-400/50 transition-colors resize-y disabled:opacity-50"
            />
            <div className="flex items-baseline justify-between mt-2 flex-wrap gap-2">
              <p className="text-xs text-platinum-500 font-light italic">
                A concept, positioning, programming move, sub-brand, or strategic
                direction. Prose, not bullet points.
              </p>
              <span className="text-xs text-platinum-600 font-mono">
                {idea.length} chars
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleRun}
              disabled={!idea.trim() || isRunning}
              className="px-6 py-3 bg-champagne-400 text-midnight-950 font-light text-sm tracking-wider uppercase hover:bg-champagne-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
                  Stress-testing…
                </>
              ) : isDone ? (
                <>
                  <Microscope size={14} strokeWidth={1.5} />
                  Re-run with revised idea
                </>
              ) : (
                <>
                  <Microscope size={14} strokeWidth={1.5} />
                  Run the Stress-Test
                </>
              )}
            </button>
            {isRunning && (
              <span className="text-xs text-platinum-500 font-light italic">
                Reading {availableUpstream} upstream agent
                {availableUpstream === 1 ? "" : "s"} and the strategic context…
              </span>
            )}
          </div>

          {isError && (
            <div className="border border-rose-400/40 bg-rose-400/5 p-4">
              <div className="eyebrow text-rose-300 mb-1">Stress-Tester error</div>
              <p className="text-xs text-rose-200 font-mono break-words">
                {errorMessage}
              </p>
            </div>
          )}

          {isDone && output && <Result output={output} />}
        </div>
      </div>
    </section>
  );
}
