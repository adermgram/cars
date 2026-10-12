"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Car, brands } from "@/lib/cars";
import { BUDGET_MAX, BudgetFinder } from "./BudgetFinder";
import { CarCard } from "./CarCard";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
        active ? "border-transparent" : "border-line text-muted hover:text-foreground"
      }`}
    >
      {active && (
        <motion.span
          layoutId="chip"
          className="absolute inset-0 rounded-full bg-foreground"
          transition={{ type: "spring", stiffness: 500, damping: 36 }}
        />
      )}
      <span className={`relative ${active ? "text-background" : ""}`}>{children}</span>
    </button>
  );
}

export function Catalog({ cars }: { cars: Car[] }) {
  const [brand, setBrand] = useState<string>("All");
  const [trans, setTrans] = useState<string>("Any");
  const [budget, setBudget] = useState<number>(BUDGET_MAX);

  // cars whose starting price fits the budget (unpriced cars only appear when budget is "any")
  const inBudget = useMemo(
    () => cars.filter((c) => budget >= BUDGET_MAX || (c.priceMin != null && c.priceMin <= budget)),
    [cars, budget],
  );

  const shown = useMemo(
    () => inBudget.filter((c) => (brand === "All" || c.brand === brand) && (trans === "Any" || c.transmission === trans)),
    [inBudget, brand, trans],
  );

  return (
    <section id="cars" className="mx-auto max-w-6xl scroll-mt-4 px-4 pb-24 sm:px-6">
      <BudgetFinder value={budget} onChange={setBudget} count={inBudget.length} total={cars.length} />
      <div className="z-20 -mx-4 bg-background/85 px-4 py-4 backdrop-blur sm:sticky sm:top-0 sm:-mx-6 sm:px-6">
        <LayoutGroup id="brand">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {["All", ...brands].map((b) => (
              <Chip key={b} active={brand === b} onClick={() => setBrand(b)}>
                {b}
              </Chip>
            ))}
          </div>
        </LayoutGroup>
        <LayoutGroup id="trans">
          <div className="mt-2 flex gap-2">
            {["Any", "Automatic", "Manual"].map((t) => (
              <Chip key={t} active={trans === t} onClick={() => setTrans(t)}>
                {t}
              </Chip>
            ))}
            <span className="ml-auto self-center text-xs text-muted">{shown.length} cars</span>
          </div>
        </LayoutGroup>
      </div>

      <motion.ul layout className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((c, i) => (
            <CarCard key={c.slug} car={c} index={i} />
          ))}
        </AnimatePresence>
      </motion.ul>

      {shown.length === 0 && (
        <p className="py-24 text-center text-muted">No cars match that filter right now. Chat Abdool, he may have one coming.</p>
      )}
    </section>
  );
}
