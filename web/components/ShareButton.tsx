"use client";

import { useState } from "react";
import { Car, SITE_NAME, formatPrice } from "@/lib/cars";

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
    <div className="mt-3 flex gap-2">
      <button
        onClick={share}
        className="flex-1 rounded-full border border-line px-4 py-3 text-sm font-medium transition hover:border-foreground active:scale-95"
      >
        {copied ? "Link copied ✓" : "Share this car"}
      </button>
      <a
        href={`/cars/${car.slug}/poster`}
        download={`${car.slug}.png`}
        className="rounded-full border border-line px-4 py-3 text-sm font-medium transition hover:border-foreground active:scale-95"
      >
        Poster ↓
      </a>
    </div>
  );
}
