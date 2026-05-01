"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, RefreshCw, AlertTriangle, Loader2, Check, Globe } from "lucide-react";

const STATE_CONFIG = {
  queued: {
    label: "queued",
    badgeClass: "bg-midnight-700 text-platinum-500 border-midnight-600",
    iconColor: "text-platinum-500",
  },
  running: {
    label: "running",
    badgeClass: "bg-champagne-400/10 text-champagne-300 border-champagne-400/40",
    iconColor: "text-champagne-400",
  },
  done: {
    label: "done",
    badgeClass: "bg-emerald-400/10 text-emerald-300 border-emerald-400/40",
    iconColor: "text-emerald-400",
  },
  error: {
    label: "error",
    badgeClass: "bg-rose-400/10 text-rose-300 border-rose-400/40",
    iconColor: "text-rose-400",
  },
};

function StateBadge({ state }) {
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.queued;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-widest uppercase font-mono border no-select ${cfg.badgeClass}`}
    >
      {state === "running" && <Loader2 size={10} className="animate-spin" />}
      {state === "done" && <Check size={10} strokeWidth={3} />}
      {state === "error" && <AlertTriangle size={10} />}
      {cfg.label}
    </span>
  );
}

// Recursive renderer for arbitrary JSON output — keeps it readable, editorial.
function JsonView({ data, depth = 0 }) {
  if (data === null || data === undefined) {
    return <span className="text-platinum-500 italic">—</span>;
  }
  if (typeof data === "string") {
    return <span className="text-platinum-200 font-light">{data}</span>;
  }
  if (typeof data === "number" || typeof data === "boolean") {
    return <span className="text-champagne-300 font-mono text-sm">{String(data)}</span>;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-platinum-500">none</span>;
    return (
      <ul className="space-y-2 list-none">
        {data.map((item, i) => (
          <li key={i} className="pl-4 border-l border-midnight-600 hairline">
            <JsonView data={item} depth={depth + 1} />
          </li>
        ))}
      </ul>
    );
  }
  if (typeof data === "object") {
    const entries = Object.entries(data);
    return (
      <div className={`space-y-3 ${depth > 0 ? "mt-1" : ""}`}>
        {entries.map(([key, value]) => (
          <div key={key}>
            <div className="eyebrow mb-1.5">{key.replace(/_/g, " ")}</div>
            <div className="text-sm leading-relaxed">
              <JsonView data={value} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(data)}</span>;
}

export default function AgentCard({
  agent,
  agentState,
  onRerun,
  isWorkflowRunning,
}) {
  const [expanded, setExpanded] = useState(false);
  const [nudge, setNudge] = useState("");
  const [showNudge, setShowNudge] = useState(false);

  const state = agentState?.state || "queued";
  const output = agentState?.output;
  const error = agentState?.error;
  const toolActivity = agentState?.toolActivity || [];

  const canExpand = state === "done" || state === "error";
  const canRerun = !isWorkflowRunning && (state === "done" || state === "error");

  const handleRerun = () => {
    onRerun(agent.id, nudge);
    setShowNudge(false);
    setNudge("");
  };

  return (
    <div
      className={`border bg-midnight-900/50 backdrop-blur-sm transition-all ${
        state === "running"
          ? "border-champagne-400/40"
          : state === "done"
          ? "border-midnight-600 hairline-strong"
          : state === "error"
          ? "border-rose-400/30"
          : "border-midnight-700 hairline"
      }`}
    >
      {/* Header */}
      <button
        onClick={() => canExpand && setExpanded(!expanded)}
        className={`w-full text-left p-5 flex items-start justify-between gap-4 ${
          canExpand ? "cursor-pointer hover:bg-midnight-800/40" : "cursor-default"
        } transition-colors`}
        disabled={!canExpand}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono text-xs text-platinum-500">
              {String(Object.keys(STATE_CONFIG).indexOf(state) >= 0 ? agent.id : "").slice(0, 0)}
            </span>
            <h3 className="display text-xl text-platinum-100">{agent.name}</h3>
            <StateBadge state={state} />
            {agent.useWebSearch && (
              <span className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase font-mono text-platinum-500">
                <Globe size={10} strokeWidth={1.5} />
                web
              </span>
            )}
          </div>
          <p className="text-sm text-platinum-400 font-light leading-relaxed">{agent.role}</p>
          {state === "running" && (
            <div className="mt-3 h-px shimmer-line" />
          )}
        </div>

        {canExpand && (
          <div className="flex-shrink-0 text-platinum-500 mt-1">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        )}
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-midnight-700 hairline animate-fade-in">
          <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-rose-400/5 border border-rose-400/30">
                <AlertTriangle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-medium text-rose-200">Agent failed</div>
                  <div className="text-xs text-rose-300/80 font-mono break-words">{error}</div>
                </div>
              </div>
            )}

            {toolActivity.length > 0 && (
              <div className="space-y-2">
                <div className="eyebrow flex items-center gap-2">
                  <Globe size={11} strokeWidth={1.5} />
                  Web search activity
                </div>
                <ul className="space-y-1 text-xs font-mono text-platinum-400">
                  {toolActivity.map((act, i) => (
                    <li key={i} className="pl-3 border-l border-champagne-400/30">
                      {act.input?.query || JSON.stringify(act.input)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {output && <JsonView data={output} />}
          </div>

          {/* Re-run with nudge */}
          {canRerun && (
            <div className="border-t border-midnight-700 hairline p-5 bg-midnight-950/40">
              {!showNudge ? (
                <button
                  onClick={() => setShowNudge(true)}
                  className="inline-flex items-center gap-2 text-xs eyebrow text-champagne-400 hover:text-champagne-300 transition-colors"
                >
                  <RefreshCw size={11} strokeWidth={1.5} />
                  Re-run with nudge
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={nudge}
                    onChange={(e) => setNudge(e.target.value)}
                    placeholder="e.g. 'go bolder', 'less London more Singapore', 'kill the cliché'"
                    className="w-full bg-midnight-900 border border-midnight-600 hairline-strong px-3 py-2 text-sm text-platinum-200 placeholder-platinum-500 focus:border-champagne-400 focus:outline-none"
                    autoFocus
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRerun}
                      disabled={!nudge.trim()}
                      className="px-4 py-1.5 bg-champagne-400 text-midnight-950 text-xs font-medium tracking-wide hover:bg-champagne-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Re-run
                    </button>
                    <button
                      onClick={() => {
                        setShowNudge(false);
                        setNudge("");
                      }}
                      className="text-xs text-platinum-500 hover:text-platinum-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
