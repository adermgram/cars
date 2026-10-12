"use client";

import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { WhatsAppButton } from "./WhatsAppButton";
import { SITE_NAME } from "@/lib/cars";

const ease = [0.22, 1, 0.36, 1] as const;

function Words({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.08, ease }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function CountUp({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const c = animate(0, to, {
      duration: 1.6,
      ease,
      onUpdate: (v) => (el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => c.stop();
  }, [inView, to, prefix, suffix, decimals]);
  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

export function Hero({ count, brands, cheapest }: { count: number; brands: number; cheapest: number }) {
  // pointer-driven glow + subtle parallax on the headline
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.3);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const glow = useTransform([sx, sy], ([x, y]) => `radial-gradient(700px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgb(255 106 26 / 0.22), transparent 60%)`);

  return (
    <div
      className="relative overflow-hidden"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
        <nav className="flex items-center justify-between">
          <span className="flex items-center gap-2.5 font-display text-base font-bold tracking-tight">
            <Image src="/abdool.jpg" alt="" width={36} height={36} className="size-9 rounded-full object-cover ring-2 ring-accent" />
            <span>
              Abdool Moh<span className="text-accent">.</span>
              <span className="ml-1.5 hidden font-medium text-muted sm:inline">Marketplace</span>
            </span>
          </span>
          <WhatsAppButton label="Chat" className="!px-4 !py-2.5" />
        </nav>

        <div className="mt-16 sm:mt-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Netherlands <span className="text-accent">→</span> Nigeria
          </motion.p>

          <h1 className="font-display text-[clamp(2.75rem,8.2vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
            <Words text="Clean used cars." />
            <br />
            <Words text="Straight from Europe." className="text-accent" delay={0.25} />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease }}
            className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="max-w-md text-lg text-muted">
                Real photos. Real prices. No middlemen, you talk straight to Abdool.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#cars"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:scale-[1.03] active:scale-95"
                >
                  Browse the cars <span aria-hidden>↓</span>
                </a>
                <WhatsAppButton />
              </div>
            </div>

            <dl className="flex gap-8 sm:gap-10">
              {[
                [<CountUp key="a" to={count} />, "cars in stock"],
                [<CountUp key="b" to={brands} />, "brands"],
                [<CountUp key="c" to={cheapest} prefix="₦" suffix="m" decimals={1} />, "starting from"],
              ].map(([n, l], i) => (
                <div key={i}>
                  <dd className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{n}</dd>
                  <dt className="mt-1 text-xs text-muted">{l}</dt>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
      <span className="sr-only">{SITE_NAME}</span>
    </div>
  );
}
