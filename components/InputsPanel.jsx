"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";

const AUDIENCE_TILTS = [
  { value: "locals", label: "Locals first" },
  { value: "balanced", label: "Balanced" },
  { value: "tourists", label: "Tourist-friendly" },
  { value: "members", label: "Members-first" },
];

export default function InputsPanel({ onRun, isRunning, disabled }) {
  const [ambition, setAmbition] = useState(70);
  const [audienceTilt, setAudienceTilt] = useState("locals");
  const [weddingWeight, setWeddingWeight] = useState(7);
  const [membersWeight, setMembersWeight] = useState(5);
  const [additionalBrief, setAdditionalBrief] = useState("");
  const [explicitAvoid, setExplicitAvoid] = useState("");

  const handleRun = () => {
    onRun({
      ambition,
      audienceTilt,
      weddingWeight,
      membersWeight,
      additionalBrief,
      explicitAvoid,
    });
  };

  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pb-16">
      <div className="border border-midnight-600 hairline-strong bg-midnight-900/60 backdrop-blur-sm">
        <div className="border-b border-midnight-600 hairline-strong px-8 py-5 flex items-baseline justify-between">
          <h2 className="display text-2xl text-platinum-100">The Brief</h2>
          <span className="eyebrow">Calibrate before running</span>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
          {/* Ambition slider */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="eyebrow">Ambition</label>
              <span className="font-mono text-sm text-champagne-400">{ambition}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ambition}
              onChange={(e) => setAmbition(Number(e.target.value))}
              className="w-full accent-champagne-400 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-platinum-500 font-mono">
              <span>incremental</span>
              <span>category-defining</span>
            </div>
          </div>

          {/* Audience tilt */}
          <div className="space-y-3">
            <label className="eyebrow block">Audience tilt</label>
            <div className="grid grid-cols-2 gap-2">
              {AUDIENCE_TILTS.map((tilt) => (
                <button
                  key={tilt.value}
                  onClick={() => setAudienceTilt(tilt.value)}
                  className={`px-4 py-3 text-sm font-light tracking-wide border transition-all ${
                    audienceTilt === tilt.value
                      ? "border-champagne-400 bg-champagne-400/10 text-champagne-100"
                      : "border-midnight-600 text-platinum-400 hover:border-platinum-500 hover:text-platinum-200"
                  }`}
                >
                  {tilt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wedding weight */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="eyebrow">Wedding emphasis</label>
              <span className="font-mono text-sm text-champagne-400">{weddingWeight}/10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={weddingWeight}
              onChange={(e) => setWeddingWeight(Number(e.target.value))}
              className="w-full accent-champagne-400 cursor-pointer"
            />
          </div>

          {/* Members weight */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="eyebrow">Members&apos; layer weight</label>
              <span className="font-mono text-sm text-champagne-400">{membersWeight}/10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={membersWeight}
              onChange={(e) => setMembersWeight(Number(e.target.value))}
              className="w-full accent-champagne-400 cursor-pointer"
            />
          </div>

          {/* Additional brief */}
          <div className="space-y-3 lg:col-span-2">
            <label className="eyebrow block">Additional brief</label>
            <textarea
              value={additionalBrief}
              onChange={(e) => setAdditionalBrief(e.target.value)}
              placeholder="Optional. Add context the agents should know — a posture you want, a constraint you've discussed with Joseph, a date that matters…"
              rows={3}
              className="w-full bg-midnight-950/60 border border-midnight-600 hairline-strong px-4 py-3 text-platinum-200 font-light placeholder-platinum-500 focus:border-champagne-400 focus:outline-none resize-none"
            />
          </div>

          {/* Explicit avoid */}
          <div className="space-y-3 lg:col-span-2">
            <label className="eyebrow block">What to explicitly avoid</label>
            <textarea
              value={explicitAvoid}
              onChange={(e) => setExplicitAvoid(e.target.value)}
              placeholder="Optional. e.g. 'no Pacific Coast / Pan-Asian', 'no speakeasy theatre', 'no Soho House thinking'…"
              rows={2}
              className="w-full bg-midnight-950/60 border border-midnight-600 hairline-strong px-4 py-3 text-platinum-200 font-light placeholder-platinum-500 focus:border-champagne-400 focus:outline-none resize-none"
            />
            <p className="text-xs text-platinum-500 font-mono mt-2">
              Hard rules already enforced: Stellar / Altimate excluded · brief&apos;s three concepts treated as foils only
            </p>
          </div>
        </div>

        <div className="border-t border-midnight-600 hairline-strong px-8 py-6 flex items-center justify-between">
          <p className="text-sm text-platinum-400 font-light hidden md:block">
            Running takes ~3–5 minutes. The agents reason aloud as they work.
          </p>
          <button
            onClick={handleRun}
            disabled={disabled || isRunning}
            className="ml-auto inline-flex items-center gap-3 px-8 py-3 bg-champagne-400 text-midnight-950 font-medium tracking-wide hover:bg-champagne-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                <span>Agents working</span>
              </>
            ) : (
              <>
                <Play size={16} strokeWidth={2} fill="currentColor" />
                <span>Run the agents</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
