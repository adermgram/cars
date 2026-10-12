"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { PlateTag } from "./PlateTag";

// Draft copy: confirm every line with Abdool before publishing.
const beats = [
  ["Found", "Cars picked out in the Netherlands."],
  ["Shown", "Every photo and price shared before you decide."],
  ["Shipped", "Arranged with Abdool, Netherlands to Nigeria."],
  ["Delivered", "Collect it in Nigeria and drive away."],
] as const;

const ROUTE = "M 150 80 C 40 170, 60 330, 230 380 C 380 425, 520 400, 640 330";

export function Journey() {
  const section = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const car = useRef<SVGGElement>(null);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const draw = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  useMotionValueEvent(draw, "change", (p) => {
    const el = path.current;
    if (!el || !car.current) return;
    const len = el.getTotalLength();
    const at = Math.min(Math.max(p, 0), 1) * len;
    const pt = el.getPointAtLength(at);
    const ahead = el.getPointAtLength(Math.min(at + 2, len));
    const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
    car.current.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle})`);
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(Math.min(3, Math.floor(p * 4))));

  return (
    <section ref={section} className="relative h-[300vh] border-t border-line" aria-label="How it works">
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-2 px-4 sm:gap-6 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-medium text-accent">The journey</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
              From a Dutch driveway
              <br />
              to <span className="text-accent">your hands.</span>
            </h2>

            <ol className="mt-5 space-y-2 sm:mt-8 sm:space-y-3">
              {beats.map(([t, d], i) => (
                <li key={t} className={`flex gap-4 transition duration-500 ${i === step ? "opacity-100" : "opacity-30"}`}>
                  <span
                    className={`font-display text-2xl font-extrabold transition-colors duration-500 sm:text-3xl ${
                      i <= step ? "text-accent" : "text-line"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-bold">{t}</span>
                    <span className={`block text-sm text-muted transition-all duration-500 ${i === step ? "max-h-10" : "max-h-0 overflow-hidden"}`}>
                      {d}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative mx-auto aspect-[800/460] w-full max-w-2xl">
            <svg viewBox="0 0 800 460" className="size-full overflow-visible" aria-hidden>
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="var(--line)" />
                </pattern>
                <radialGradient id="fade">
                  <stop offset="30%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#000" />
                </radialGradient>
                <mask id="m">
                  <rect width="800" height="460" fill="url(#fade)" />
                </mask>
              </defs>
              <rect width="800" height="460" fill="url(#dots)" mask="url(#m)" />

              <path d={ROUTE} fill="none" stroke="var(--line)" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
              <motion.path
                ref={path}
                d={ROUTE}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength: draw }}
              />

              <circle cx="150" cy="80" r="9" fill="#f7c600" />
              <circle cx="640" cy="330" r="9" fill="#fff" />

              <g ref={car} transform="translate(150 80)">
                <circle r="22" fill="var(--accent)" opacity="0.25" />
                <circle r="13" fill="var(--accent)" />
                <path d="M -6 3 L -5 -2 L -2 -5 L 3 -5 L 6 -1 L 7 3 Z" fill="var(--accent-ink)" />
              </g>
            </svg>

            <div className="absolute left-[24%] top-[8%] sm:left-[22%]">
              <PlateTag size="sm">Netherlands</PlateTag>
            </div>
            <div className="absolute right-[4%] top-[82%] sm:right-[2%]">
              <PlateTag size="sm" country="NG">
                Nigeria
              </PlateTag>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
