"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Car, brands } from "@/lib/cars";
import { CarCard } from "./CarCard";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
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

  const shown = useMemo(
    () => cars.filter((c) => (brand === "All" || c.brand === brand) && (trans === "Any" || c.transmission === trans)),
    [cars, brand, trans],
  );

  return (
    <section id="cars" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="sticky top-0 z-20 -mx-4 bg-background/85 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
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

      <motion.ul layout className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
