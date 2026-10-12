"use client";

import { useState } from "react";
import { Car, SITE_NAME, formatPrice } from "@/lib/cars";

// filled tiles with icons, so they don't read as more quick-question chips
const tile =
  "flex min-w-0 flex-col items-start gap-2.5 rounded-2xl sm:flex-row sm:items-center sm:gap-3 border border-line bg-card p-3 text-left transition hover:border-accent/60 active:scale-[0.98]";
const iconBox = "grid size-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent";

export function ShareButton({ car }: { car: Car }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    const data = { title: `${car.name} · ${SITE_NAME}`, text: `${car.name}, ${formatPrice(car)}`, url };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* user dismissed the share sheet */
    }
  }

  return (
    <div className="mt-8 border-t border-line pt-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">Share this car</p>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={share} className={tile}>
          <span className={iconBox}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">{copied ? "Link copied ✓" : "Share link"}</span>
            <span className="block text-xs text-muted">Send to a friend</span>
          </span>
        </button>
        <a href={`/cars/${car.slug}/poster`} download={`${car.slug}.png`} className={tile}>
          <span className={iconBox}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M12 8v7M9 12l3 3 3-3" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Save poster</span>
            <span className="block text-xs text-muted">For WhatsApp status</span>
          </span>
        </a>
      </div>
    </div>
  );
}
