"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Car, formatPrice } from "@/lib/cars";
import { PlateTag } from "./PlateTag";
import { SoldStamp } from "./SoldStamp";

export function CarCard({ car, index }: { car: Car; index: number }) {
  const noPrice = car.priceMin == null;

  // 3D tilt that follows the cursor (mouse only, touch devices never fire mousemove)
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(useTransform(ry, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(rx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: Math.min(index % 3, 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          rx.set(x - 0.5);
          ry.set(y - 0.5);
          e.currentTarget.style.setProperty("--mx", `${x * 100}%`);
          e.currentTarget.style.setProperty("--my", `${y * 100}%`);
        }}
        onMouseLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        className="spot relative rounded-3xl"
      >
        <Link
          href={`/cars/${car.slug}`}
          className="group block overflow-hidden rounded-3xl border border-line bg-card transition-colors duration-300 hover:border-accent/50"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-line">
            <Image
              src={car.images[0].thumb}
              alt={car.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute left-3 top-3 hidden rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium backdrop-blur sm:block">
              {car.images.length} photo{car.images.length > 1 ? "s" : ""}
            </span>
            {car.transmission && (
              <span className="absolute right-2 top-2 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
                {car.transmission}
              </span>
            )}
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3" style={{ transform: "translateZ(40px)" }}>
              <PlateTag size="sm" className={noPrice ? "opacity-80" : ""}>
                {formatPrice(car)}
              </PlateTag>
            </div>
            {car.sold && <SoldStamp />}
          </div>
          <div className="flex items-center justify-between gap-3 p-3 sm:p-5">
            <div className="min-w-0">
              <h3 className="truncate font-display text-sm font-bold tracking-tight sm:text-lg">{car.name}</h3>
              <p className="mt-0.5 truncate text-xs text-muted sm:text-sm">{[car.label, car.year].filter(Boolean).join(" · ") || car.brand}</p>
            </div>
            <span className="hidden size-10 shrink-0 place-items-center rounded-full border sm:grid border-line text-lg transition group-hover:border-transparent group-hover:bg-accent group-hover:text-accent-ink">
              <span className="transition group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.li>
  );
}
