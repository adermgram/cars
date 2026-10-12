"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CarImage } from "@/lib/cars";

export function Gallery({ images, alt }: { images: CarImage[]; alt: string }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [dir, setDir] = useState(1);
  const n = images.length;

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setI((x) => (x + d + n) % n);
    },
    [n],
  );

  // lock page scroll behind the full-screen viewer
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const stage = (priority = false) => (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={i}
        initial={{ opacity: 0, x: dir * 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: dir * -40 }}
        transition={{ duration: 0.3 }}
        drag={n > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) go(1);
          else if (info.offset.x > 60) go(-1);
        }}
        className="absolute inset-0"
      >
        {/* blurred backdrop fills the frame so any photo shape looks intentional */}
        <Image src={images[i].thumb} alt="" fill sizes="100vw" className="scale-125 object-cover opacity-60 blur-2xl" aria-hidden />
        <Image
          src={images[i].src}
          alt={`${alt} photo ${i + 1}`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority={priority}
          className="object-contain"
          draggable={false}
        />
      </motion.div>
    </AnimatePresence>
  );

  const arrows = (
    <>
      {n > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-xl text-white backdrop-blur transition hover:bg-black/70"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-xl text-white backdrop-blur transition hover:bg-black/70"
          >
            ›
          </button>
        </>
      )}
      <span className="absolute bottom-3 right-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-xs text-white backdrop-blur">
        {i + 1} / {n}
      </span>
    </>
  );

  return (
    <div>
      <div className="relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-3xl bg-line" onClick={() => setOpen(true)}>
        {stage(true)}
        {arrows}
      </div>

      {n > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto p-1">
          {images.map((im, k) => (
            <button
              key={im.src}
              onClick={() => {
                setDir(k > i ? 1 : -1);
                setI(k);
              }}
              className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl transition ${
                k === i ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`Show photo ${k + 1}`}
            >
              <Image src={im.thumb} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-4 sm:inset-10" onClick={(e) => e.stopPropagation()}>
              <div className="relative size-full overflow-hidden rounded-2xl">
                {stage()}
                {arrows}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/15 text-xl text-white backdrop-blur hover:bg-white/25"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
