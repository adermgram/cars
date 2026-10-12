import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { Reveal } from "@/components/Reveal";
import { QuickAsk } from "@/components/QuickAsk";
import { ShareButton } from "@/components/ShareButton";
import { PlateTag } from "@/components/PlateTag";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SITE_NAME, cars, formatPrice } from "@/lib/cars";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) return {};
  const title = `${car.name} · ${formatPrice(car)} | ${SITE_NAME}`;
  return {
    title,
    description: `${car.name}${car.transmission ? `, ${car.transmission}` : ""}. ${car.images.length} photos. Chat with Abdool on WhatsApp.`,
    // image comes from ./opengraph-image.tsx (branded PNG; WhatsApp skips WebP)
    openGraph: { title },
  };
}

export default async function CarPage({ params }: Props) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) notFound();

  const more = cars.filter((c) => c.brand === car.brand && c.slug !== car.slug).slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-32 pt-6 sm:px-6">
      <Link href="/#cars" className="text-sm text-muted transition hover:text-foreground">
        ← All cars
      </Link>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Reveal>
          <Gallery images={car.images} alt={car.name} />
        </Reveal>

        <Reveal delay={0.1} className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-sm font-medium text-accent">{car.brand}</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{car.name}</h1>
          {car.label && <p className="mt-1 text-muted">{car.label}</p>}
          <div className="mt-5"><PlateTag size="lg">{formatPrice(car)}</PlateTag></div>
          {car.priceMin != null && car.priceMin !== car.priceMax && (
            <p className="mt-3 text-sm text-muted">Final price depends on the exact unit. Chat to confirm.</p>
          )}

          <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card text-sm">
            {[
              ["Transmission", car.transmission],
              ["Year", car.year],
              ["Origin", "Netherlands"],
              ["Photos", String(car.images.length)],
            ]
              .filter((row): row is [string, string] => row[1] != null)
              .map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 hidden lg:block">
            <WhatsAppButton car={car} className="w-full" />
          </div>
          <QuickAsk car={car} />
          <ShareButton car={car} />
        </Reveal>
      </div>

      {more.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold">More {car.brand}</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {more.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/cars/${c.slug}`}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-card p-3 transition hover:-translate-y-0.5 hover:border-accent/50"
                >
                  <Image src={c.images[0].thumb} alt="" width={96} height={72} className="h-[72px] w-24 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{c.name}</span>
                    <span className="block truncate text-xs text-muted">{c.label ?? c.transmission ?? ""}</span>
                    <span className="mt-1 block text-sm font-semibold text-accent">{formatPrice(c)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-background/90 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <WhatsAppButton car={car} className="w-full" />
      </div>
    </main>
  );
}
