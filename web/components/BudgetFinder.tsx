"use client";

import { animate, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

export const BUDGET_MIN = 4;
export const BUDGET_MAX = 35;

const presets = [5, 7, 10, 20, BUDGET_MAX];

const fmt = (n: number) => (n >= BUDGET_MAX - 0.01 ? "Any budget" : `₦${n % 1 ? n.toFixed(1) : n.toFixed(0)}m`);

export function BudgetFinder({
  value,
  onChange,
  count,
  total,
}: {
  value: number;
  onChange: (v: number) => void;
  count: number;
  total: number;
}) {
  // the headline number glides to its target instead of jumping
  const shown = useMotionValue(value);
  const out = useRef<HTMLSpanElement>(null);
  const cnt = useRef<HTMLSpanElement>(null);
  const cntVal = useMotionValue(count);

  useEffect(() => {
    const a = animate(shown, value, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
    return () => a.stop();
  }, [value, shown]);
  useEffect(() => shown.on("change", (v) => out.current && (out.current.textContent = fmt(Math.round(v * 2) / 2))), [shown]);

  useEffect(() => {
    const a = animate(cntVal, count, { duration: 0.4 });
    return () => a.stop();
  }, [count, cntVal]);
  useEffect(() => cntVal.on("change", (v) => cnt.current && (cnt.current.textContent = String(Math.round(v)))), [cntVal]);

  const pct = ((value - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-card p-5 sm:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/20 blur-[90px]" />
      <p className="text-sm font-medium text-accent">Start here</p>
      <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">What&apos;s your budget?</h2>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 sm:mt-8">
        <span ref={out} className="font-display text-5xl font-extrabold leading-none tracking-tighter sm:text-8xl">
          {fmt(value)}
        </span>
        <p className="pb-1 text-right text-muted">
          <span ref={cnt} className="font-display text-3xl font-bold text-foreground">
            {count}
          </span>{" "}
          of {total} cars fit
        </p>
      </div>

      <input
        type="range"
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Maximum budget in millions of naira"
        className="budget mt-6 w-full sm:mt-8"
        style={{ background: `linear-gradient(to right, var(--accent) ${pct}%, var(--line) ${pct}%)` }}
      />
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>₦{BUDGET_MIN}m</span>
        <span>₦{BUDGET_MAX}m+</span>
      </div>

      <div className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:mt-6 sm:flex-wrap sm:px-0">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
              value === p ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {p === BUDGET_MAX ? "Show all" : `Under ₦${p}m`}
          </button>
        ))}
      </div>
    </div>
  );
}
