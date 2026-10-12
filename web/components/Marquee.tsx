import Image from "next/image";
import Link from "next/link";
import { Car, formatPrice } from "@/lib/cars";
import { PlateTag } from "./PlateTag";

function Row({ items, reverse }: { items: Car[]; reverse?: boolean }) {
  // list is rendered twice so the -50% translate loops seamlessly
  const doubled = [...items, ...items];
  return (
    <div className="marquee overflow-hidden py-2">
      <div className={`marquee-track ${reverse ? "rev" : ""}`}>
        {doubled.map((c, i) => (
          <Link
            key={i}
            href={`/cars/${c.slug}`}
            tabIndex={i >= items.length ? -1 : 0}
            aria-hidden={i >= items.length}
            className="group relative mr-4 block aspect-[4/3] w-64 shrink-0 overflow-hidden rounded-2xl bg-card sm:w-80"
          >
            <Image
              src={c.images[0].thumb}
              alt={i >= items.length ? "" : c.name}
              fill
              sizes="320px"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 opacity-0 transition group-hover:opacity-100">
              <p className="mb-1.5 text-sm font-semibold">{c.name}</p>
              <PlateTag size="sm">{formatPrice(c)}</PlateTag>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Marquee({ cars }: { cars: Car[] }) {
  // prefer listings with several photos, spread across brands
  const picks = cars.filter((c) => c.images.length >= 4);
  const a = picks.filter((_, i) => i % 2 === 0).slice(0, 12);
  const b = picks.filter((_, i) => i % 2 === 1).slice(0, 12);
  return (
    <div className="relative -mt-2 pb-6" aria-label="Featured cars">
      <Row items={a} />
      <Row items={b} reverse />
    </div>
  );
}
