"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car, formatPrice } from "@/lib/cars";

export function CarCard({ car, index }: { car: Car; index: number }) {
  const noPrice = car.priceMin == null;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index % 3, 2) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/cars/${car.slug}`}
        className="group block overflow-hidden rounded-3xl border border-line bg-card transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-line">
          <Image
            src={car.images[0].thumb}
            alt={car.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {car.images.length} photo{car.images.length > 1 ? "s" : ""}
          </span>
          {car.transmission && (
            <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-black backdrop-blur">
              {car.transmission}
            </span>
          )}
        </div>
        <div className="flex items-end justify-between gap-3 p-5">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{car.name}</h3>
            <p className="mt-0.5 text-sm text-muted">{car.year ?? car.brand}</p>
          </div>
          <p className={`shrink-0 text-right text-sm font-semibold ${noPrice ? "text-muted" : "text-accent"}`}>
            {formatPrice(car)}
          </p>
        </div>
      </Link>
    </motion.li>
  );
}
