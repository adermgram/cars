import { Catalog } from "@/components/Catalog";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { SITE_NAME, cars } from "@/lib/cars";

const steps = [
  ["Pick a car", "Browse real photos and honest price ranges."],
  ["Chat Abdool", "One tap opens WhatsApp with the car already named."],
  ["Inspect & ship", "Agree the details, then it's yours."],
];

export default function Home() {
  return (
    <main>
      <header className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
        <nav className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight">{SITE_NAME}</span>
          <WhatsAppButton label="Chat" className="!px-4 !py-2" />
        </nav>

        <Reveal className="mt-16 max-w-3xl sm:mt-24">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-muted">
            <span className="size-1.5 rounded-full bg-accent" /> Imported from the Netherlands
          </p>
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
            Clean used cars.
            <br />
            <span className="text-muted">Straight from Europe.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            {cars.length} cars ready now. See every photo, see the price, and talk directly to Abdool.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#cars"
              className="inline-flex items-center rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:scale-[1.03] active:scale-95"
            >
              Browse cars
            </a>
            <WhatsAppButton />
          </div>
        </Reveal>
      </header>

      <Catalog cars={cars} />

      <section className="border-t border-line bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6">
          {steps.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08}>
              <p className="text-sm font-semibold text-accent">0{i + 1}</p>
              <h3 className="mt-2 text-xl font-semibold">{t}</h3>
              <p className="mt-1 text-muted">{d}</p>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-16 text-center sm:px-6">
          <p className="mb-4 text-muted">Can&apos;t see what you want? Tell Abdool.</p>
          <WhatsAppButton />
        </div>
      </section>

      <footer className="px-4 py-8 text-center text-xs text-muted">© {new Date().getFullYear()} {SITE_NAME}</footer>
    </main>
  );
}
