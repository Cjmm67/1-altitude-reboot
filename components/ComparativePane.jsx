"use client";

import { useState } from "react";
import { GitCompare, X } from "lucide-react";

function ConceptDetail({ concept, onClear, side }) {
  if (!concept) {
    return (
      <div className="border border-dashed border-midnight-600 hairline p-6 min-h-[400px] flex items-center justify-center">
        <p className="text-platinum-500 font-light italic text-sm">
          Pin a concept to {side} (use the buttons above each card)
        </p>
      </div>
    );
  }
  return (
    <div className="border border-midnight-600 hairline-strong bg-midnight-900/60 backdrop-blur-sm">
      <div className="border-b border-midnight-600 hairline-strong p-5 flex items-baseline justify-between">
        <div className="min-w-0 flex-1">
          <div className="eyebrow mb-1.5">{concept.id}</div>
          <h4 className="display text-xl text-platinum-100 truncate">{concept.name}</h4>
        </div>
        <button
          onClick={onClear}
          className="text-platinum-500 hover:text-platinum-200 ml-3 flex-shrink-0"
          aria-label="Unpin"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
      <div className="p-5 space-y-5 text-sm">
        <div>
          <div className="eyebrow mb-1.5 text-platinum-500">Thesis</div>
          <p className="text-platinum-200 font-light italic">{concept.one_line_thesis}</p>
        </div>
        <div>
          <div className="eyebrow mb-1.5 text-platinum-500">What it is</div>
          <p className="text-platinum-200 font-light leading-relaxed">{concept.what_it_is}</p>
        </div>
        {concept.programming_logic && (
          <div className="space-y-2">
            <div className="eyebrow text-platinum-500">Programming logic</div>
            <div className="space-y-1.5 font-mono text-xs">
              <div><span className="text-champagne-400">L63 →</span> <span className="text-platinum-300">{concept.programming_logic.L63}</span></div>
              <div><span className="text-champagne-400">L62 →</span> <span className="text-platinum-300">{concept.programming_logic.L62}</span></div>
              <div><span className="text-champagne-400">L61 →</span> <span className="text-platinum-300">{concept.programming_logic.L61}</span></div>
            </div>
          </div>
        )}
        <div>
          <div className="eyebrow mb-1.5 text-platinum-500">Target tribe</div>
          <p className="text-platinum-300 font-light">{concept.target_tribe}</p>
        </div>
        <div className="pt-4 border-t border-midnight-700 hairline">
          <div className="eyebrow mb-1.5 text-rose-300">What it kills</div>
          <p className="text-platinum-200 font-light">{concept.the_one_thing_it_kills}</p>
        </div>
        <div>
          <div className="eyebrow mb-1.5 text-emerald-300">Why Singapore 2026</div>
          <p className="text-platinum-300 font-light">{concept.why_singapore_2026}</p>
        </div>
      </div>
    </div>
  );
}

export default function ComparativePane({ concepts, killTests }) {
  const [pinnedLeft, setPinnedLeft] = useState(null);
  const [pinnedRight, setPinnedRight] = useState(null);

  if (!concepts || concepts.length === 0) {
    return null;
  }

  const getKillTest = (conceptId) =>
    (killTests || []).find((kt) => kt.concept_id === conceptId);

  const handlePin = (concept) => {
    if (!pinnedLeft) {
      setPinnedLeft(concept);
    } else if (!pinnedRight && pinnedLeft.id !== concept.id) {
      setPinnedRight(concept);
    } else {
      // Replace right if both filled
      setPinnedRight(concept);
    }
  };

  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pb-24">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2">
            <GitCompare size={11} strokeWidth={1.5} />
            Concept Comparator
          </div>
          <h2 className="display text-3xl text-platinum-100">Six concepts. Pin two. Compare.</h2>
        </div>
      </div>

      {/* Concept cards row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {concepts.map((concept) => {
          const kt = getKillTest(concept.id);
          const isPinned = pinnedLeft?.id === concept.id || pinnedRight?.id === concept.id;
          const verdict = kt?.survival_verdict;
          return (
            <button
              key={concept.id}
              onClick={() => handlePin(concept)}
              className={`p-4 text-left border transition-all ${
                isPinned
                  ? "border-champagne-400 bg-champagne-400/10"
                  : "border-midnight-600 hairline-strong hover:border-platinum-500 bg-midnight-900/40"
              }`}
            >
              <div className="font-mono text-[10px] text-champagne-400 mb-2 tracking-widest">{concept.id}</div>
              <div className="display text-base text-platinum-100 leading-tight mb-3 line-clamp-2">{concept.name}</div>
              {verdict && (
                <div className={`text-[10px] eyebrow ${
                  verdict === "survives" ? "text-emerald-300" :
                  verdict === "partially survives" ? "text-amber-300" :
                  "text-rose-300"
                }`}>
                  {verdict}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Pinned comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConceptDetail concept={pinnedLeft} onClear={() => setPinnedLeft(null)} side="left" />
        <ConceptDetail concept={pinnedRight} onClear={() => setPinnedRight(null)} side="right" />
      </div>
    </section>
  );
}
