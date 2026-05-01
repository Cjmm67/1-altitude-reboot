"use client";

import { useState } from "react";
import { Download, Copy, Check, Mail } from "lucide-react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-1.5 text-xs eyebrow text-platinum-500 hover:text-champagne-400 transition-colors"
      title="Copy section"
    >
      {copied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.5} />}
      {copied ? "copied" : "copy"}
    </button>
  );
}

function Section({ title, children, copyText }) {
  return (
    <section className="border-b border-midnight-700 hairline pb-12">
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="eyebrow">{title}</h3>
        {copyText && <CopyButton text={copyText} />}
      </div>
      {children}
    </section>
  );
}

function buildMarkdown(synthesis) {
  if (!synthesis) return "";
  const o = synthesis;
  const parts = [];
  parts.push("# 1-Altitude Reboot — Strategic Synthesis\n");
  if (o.headline) parts.push(`**${o.headline}**\n`);
  if (o.vision) {
    parts.push("\n## Vision");
    parts.push(`\n**Public:** ${o.vision.public}`);
    parts.push(`\n**Commercial:** ${o.vision.commercial}`);
  }
  if (o.mission) {
    parts.push("\n\n## Mission");
    parts.push(`\n${o.mission.statement}`);
    if (o.mission.operational_anchor) {
      parts.push(`\n\n*${o.mission.operational_anchor}*`);
    }
  }
  if (o.recommended_concept) {
    parts.push("\n\n## Recommended Concept");
    parts.push(`\n### ${o.recommended_concept.name}`);
    if (o.recommended_concept.thesis) parts.push(`\n*${o.recommended_concept.thesis}*\n`);
    if (o.recommended_concept.what_it_is) parts.push(`\n${o.recommended_concept.what_it_is}\n`);
    if (o.recommended_concept.programming_logic_summary) {
      parts.push(`\n**Programming logic:** ${o.recommended_concept.programming_logic_summary}`);
    }
    if (o.recommended_concept.the_one_thing_it_kills) {
      parts.push(`\n\n**What it kills:** ${o.recommended_concept.the_one_thing_it_kills}`);
    }
    if (o.recommended_concept.why_it_survives_the_kill_test) {
      parts.push(`\n\n**Why it survives the kill test:** ${o.recommended_concept.why_it_survives_the_kill_test}`);
    }
  }
  if (o.differentiation_wedge) {
    parts.push("\n\n## Differentiation Wedge");
    parts.push(`\n${o.differentiation_wedge}`);
  }
  if (o.wedding_layer_summary) {
    parts.push("\n\n## Wedding Layer");
    parts.push(`\n${o.wedding_layer_summary}`);
  }
  if (o.members_layer_summary) {
    parts.push("\n\n## Members' Layer");
    parts.push(`\n${o.members_layer_summary}`);
  }
  if (o.discovery_plan_summary) {
    parts.push("\n\n## Discovery Plan");
    parts.push(`\n${o.discovery_plan_summary}`);
  }
  if (o.five_year_ambition) {
    parts.push("\n\n## 5-Year Ambition");
    parts.push(`\n${o.five_year_ambition}`);
  }
  if (o.brian_riady_one_pager) {
    const b = o.brian_riady_one_pager;
    parts.push("\n\n---\n\n## Brian Riady One-Pager Tease");
    if (b.subject_line) parts.push(`\n**Subject:** ${b.subject_line}\n`);
    if (b.opening_paragraph) parts.push(`\n${b.opening_paragraph}\n`);
    if (b.the_thinking) parts.push(`\n${b.the_thinking}\n`);
    if (b.the_quiet_ask) parts.push(`\n${b.the_quiet_ask}\n`);
    if (b.sign_off) parts.push(`\n${b.sign_off}`);
    if (b.total_word_count) parts.push(`\n\n*(${b.total_word_count} words)*`);
  }
  if (o.what_chris_should_validate_next?.length) {
    parts.push("\n\n## What to validate next");
    o.what_chris_should_validate_next.forEach((item) => {
      parts.push(`\n- ${item}`);
    });
  }
  return parts.join("");
}

export default function OutputsView({ synthesis, brianMode, onToggleBrianMode }) {
  if (!synthesis) {
    return (
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pb-24">
        <div className="border border-midnight-700 hairline p-12 text-center">
          <p className="text-platinum-500 italic font-light">
            The Synthesiser will produce the final document once all upstream agents complete.
          </p>
        </div>
      </section>
    );
  }

  const handleDownload = () => {
    const md = buildMarkdown(synthesis);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "1-altitude-reboot-synthesis.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Brian Riady mode — render only the one-pager in editorial format
  if (brianMode && synthesis.brian_riady_one_pager) {
    const b = synthesis.brian_riady_one_pager;
    return (
      <section className="px-6 md:px-12 lg:px-24 max-w-3xl mx-auto pb-24">
        <div className="flex items-baseline justify-between mb-12">
          <div className="eyebrow">Brian Riady · One-page tease</div>
          <button
            onClick={onToggleBrianMode}
            className="text-xs eyebrow text-platinum-500 hover:text-champagne-400 transition-colors"
          >
            ← Back to full synthesis
          </button>
        </div>

        <article className="space-y-8 text-platinum-100 font-light leading-relaxed">
          {b.subject_line && (
            <div className="pb-6 border-b border-midnight-700 hairline">
              <div className="eyebrow mb-2">Subject</div>
              <div className="display text-2xl text-platinum-100">{b.subject_line}</div>
            </div>
          )}
          {b.opening_paragraph && (
            <p className="text-lg italic text-platinum-200">{b.opening_paragraph}</p>
          )}
          {b.the_thinking && (
            <div className="text-base whitespace-pre-line">{b.the_thinking}</div>
          )}
          {b.the_quiet_ask && (
            <p className="text-base text-platinum-200">{b.the_quiet_ask}</p>
          )}
          {b.sign_off && (
            <p className="text-base text-platinum-300 mt-12 font-mono">{b.sign_off}</p>
          )}
          {b.total_word_count && (
            <div className="pt-6 border-t border-midnight-700 hairline">
              <span className="eyebrow text-platinum-500">{b.total_word_count} words · ≤350 limit</span>
            </div>
          )}
        </article>

        <div className="mt-12 flex items-center gap-4">
          <CopyButton text={[b.subject_line, b.opening_paragraph, b.the_thinking, b.the_quiet_ask, b.sign_off].filter(Boolean).join("\n\n")} />
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-4 mb-12 flex-wrap">
        <div>
          <div className="eyebrow mb-3">The Synthesis</div>
          <h2 className="display text-4xl md:text-5xl text-platinum-100">
            {synthesis.headline || "Final synthesis"}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleBrianMode}
            className="inline-flex items-center gap-2 px-4 py-2 border border-champagne-400/40 text-champagne-300 text-sm font-light hover:bg-champagne-400/10 transition-colors"
          >
            <Mail size={14} strokeWidth={1.5} />
            Brian Riady mode
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 border border-midnight-600 hairline-strong text-platinum-300 text-sm font-light hover:border-platinum-400 hover:text-platinum-100 transition-colors"
          >
            <Download size={14} strokeWidth={1.5} />
            Download .md
          </button>
        </div>
      </div>

      {/* Vision + Mission */}
      {(synthesis.vision || synthesis.mission) && (
        <Section title="Vision · Mission" copyText={`${synthesis.vision?.public || ""}\n${synthesis.vision?.commercial || ""}\n${synthesis.mission?.statement || ""}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {synthesis.vision?.public && (
              <div>
                <div className="eyebrow mb-3 text-platinum-500">Public Vision</div>
                <p className="display text-2xl text-platinum-100 leading-snug">
                  {synthesis.vision.public}
                </p>
              </div>
            )}
            {synthesis.vision?.commercial && (
              <div>
                <div className="eyebrow mb-3 text-platinum-500">Commercial Vision</div>
                <p className="display text-2xl text-platinum-100 leading-snug">
                  {synthesis.vision.commercial}
                </p>
              </div>
            )}
          </div>
          {synthesis.mission?.statement && (
            <div className="mt-10 pt-8 border-t border-midnight-700 hairline">
              <div className="eyebrow mb-3 text-platinum-500">Mission</div>
              <p className="text-xl text-platinum-100 font-light leading-relaxed">
                {synthesis.mission.statement}
              </p>
              {synthesis.mission.operational_anchor && (
                <p className="text-sm text-platinum-400 italic mt-3">
                  {synthesis.mission.operational_anchor}
                </p>
              )}
            </div>
          )}
        </Section>
      )}

      {/* Recommended Concept */}
      {synthesis.recommended_concept && (
        <Section title="Recommended Concept" copyText={JSON.stringify(synthesis.recommended_concept, null, 2)}>
          <h4 className="display text-3xl text-champagne-300 mb-2">
            {synthesis.recommended_concept.name}
          </h4>
          {synthesis.recommended_concept.thesis && (
            <p className="text-lg italic text-platinum-200 mb-6">
              {synthesis.recommended_concept.thesis}
            </p>
          )}
          {synthesis.recommended_concept.what_it_is && (
            <p className="text-base text-platinum-200 leading-relaxed mb-6 font-light whitespace-pre-line">
              {synthesis.recommended_concept.what_it_is}
            </p>
          )}
          {synthesis.recommended_concept.programming_logic_summary && (
            <div className="mb-6">
              <div className="eyebrow mb-2 text-platinum-500">Programming logic</div>
              <p className="text-base text-platinum-300 font-light leading-relaxed">
                {synthesis.recommended_concept.programming_logic_summary}
              </p>
            </div>
          )}
          {synthesis.recommended_concept.the_one_thing_it_kills && (
            <div className="mb-6 p-4 border-l-2 border-rose-400/40 bg-rose-400/5">
              <div className="eyebrow mb-2 text-rose-300">What it kills</div>
              <p className="text-platinum-200 font-light">
                {synthesis.recommended_concept.the_one_thing_it_kills}
              </p>
            </div>
          )}
          {synthesis.recommended_concept.why_it_survives_the_kill_test && (
            <div className="p-4 border-l-2 border-emerald-400/40 bg-emerald-400/5">
              <div className="eyebrow mb-2 text-emerald-300">Why it survives the kill test</div>
              <p className="text-platinum-200 font-light">
                {synthesis.recommended_concept.why_it_survives_the_kill_test}
              </p>
            </div>
          )}
        </Section>
      )}

      {/* Differentiation Wedge */}
      {synthesis.differentiation_wedge && (
        <Section title="Differentiation Wedge" copyText={synthesis.differentiation_wedge}>
          <p className="text-lg text-platinum-100 font-light leading-relaxed">
            {synthesis.differentiation_wedge}
          </p>
        </Section>
      )}

      {/* Wedding Layer */}
      {synthesis.wedding_layer_summary && (
        <Section title="Wedding Layer" copyText={synthesis.wedding_layer_summary}>
          <p className="text-base text-platinum-200 font-light leading-relaxed whitespace-pre-line">
            {synthesis.wedding_layer_summary}
          </p>
        </Section>
      )}

      {/* Members Layer */}
      {synthesis.members_layer_summary && (
        <Section title="Members' Layer" copyText={synthesis.members_layer_summary}>
          <p className="text-base text-platinum-200 font-light leading-relaxed">
            {synthesis.members_layer_summary}
          </p>
        </Section>
      )}

      {/* Discovery Plan */}
      {synthesis.discovery_plan_summary && (
        <Section title="Discovery Plan" copyText={synthesis.discovery_plan_summary}>
          <p className="text-base text-platinum-200 font-light leading-relaxed">
            {synthesis.discovery_plan_summary}
          </p>
        </Section>
      )}

      {/* 5-Year Ambition */}
      {synthesis.five_year_ambition && (
        <Section title="5-Year Ambition" copyText={synthesis.five_year_ambition}>
          <p className="text-lg text-platinum-100 font-light italic leading-relaxed">
            {synthesis.five_year_ambition}
          </p>
        </Section>
      )}

      {/* What to validate next */}
      {synthesis.what_chris_should_validate_next?.length > 0 && (
        <Section title="What to validate next">
          <ul className="space-y-3">
            {synthesis.what_chris_should_validate_next.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-champagne-400 font-mono text-sm flex-shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-platinum-200 font-light">{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Agent dissent log */}
      {synthesis.agent_dissent_log?.length > 0 && (
        <Section title="How this synthesis was made">
          <p className="text-sm text-platinum-500 mb-6 italic">
            Where Wave 2 agents disagreed and how the Synthesiser resolved it.
          </p>
          <div className="space-y-5">
            {synthesis.agent_dissent_log.map((d, i) => (
              <div key={i} className="border-l border-midnight-600 hairline pl-4">
                <div className="text-xs font-mono text-platinum-500 mb-1">
                  {(d.agents_in_conflict || []).join(" ⇄ ")}
                </div>
                <p className="text-sm text-platinum-300 italic mb-2">{d.the_disagreement}</p>
                <p className="text-sm text-platinum-200">→ {d.synthesiser_call}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </section>
  );
}
