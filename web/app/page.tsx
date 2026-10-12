import Image from "next/image";
import { Catalog } from "@/components/Catalog";
import { Hero } from "@/components/Hero";
import { Journey } from "@/components/Journey";
import { Marquee } from "@/components/Marquee";
import { MeetAbdool } from "@/components/MeetAbdool";
import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  CREDIT_HREF,
  CREDIT_NAME,
  SITE_NAME,
  TWITTER,
  TWITTER_HANDLE,
  brands,
  cars,
  cheapest,
} from "@/lib/cars";

export default function Home() {
  return (
    <main>
      <Hero count={cars.length} brands={brands.length} cheapest={cheapest} />
      <Marquee cars={cars} />

      <div className="h-12" />
      <Catalog cars={cars} />

      <Journey />
      <MeetAbdool />

      <section className="relative overflow-hidden border-t border-line">
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 max-w-2xl rounded-full bg-accent/20 blur-[110px]" />
          <Reveal className="relative">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
              Don&apos;t see your car?
              <br />
              <span className="text-accent">Tell Abdool.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">Send him what you want and your budget.</p>
            <div className="mt-8">
              <WhatsAppButton label="Message Abdool on WhatsApp" className="!px-8 !py-4 !text-base" />
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-line px-4 py-8 text-sm text-muted">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-col gap-1">
            <span>
              © {new Date().getFullYear()} {SITE_NAME}
            </span>
            <a href={TWITTER} target="_blank" rel="noopener noreferrer" className="transition hover:text-accent">
              {TWITTER_HANDLE} on X ↗
            </a>
          </div>
          <a
            href={CREDIT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 self-start rounded-full border border-line py-1.5 pl-1.5 pr-4 transition hover:border-accent sm:self-auto"
          >
            <span className="grid size-9 place-items-center rounded-full bg-[#f4f1e8]">
              <Image src="/baseline-logo.webp" alt="" width={20} height={24} className="h-6 w-auto" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs">Website by</span>
              <span className="block font-medium text-foreground transition group-hover:text-accent">{CREDIT_NAME}</span>
            </span>
          </a>
        </div>
      </footer>
    </main>
  );
}
