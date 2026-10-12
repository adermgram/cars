"use client";

import { motion } from "framer-motion";

export function SoldStamp() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-black/55">
      <motion.span
        initial={{ scale: 2.4, opacity: 0, rotate: -4 }}
        whileInView={{ scale: 1, opacity: 1, rotate: -12 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
        className="rounded-lg border-4 border-accent px-6 py-1.5 font-display text-4xl font-extrabold uppercase tracking-[0.2em] text-accent shadow-[0_0_40px_rgb(255_106_26/0.4)]"
      >
        Sold
      </motion.span>
    </div>
  );
}
