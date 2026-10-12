import Image from "next/image";
import { Reveal } from "./Reveal";
import { WhatsAppButton } from "./WhatsAppButton";
import { TWITTER, TWITTER_HANDLE } from "@/lib/cars";

// Draft first-person copy: replace with Abdool's own words before publishing.
export function MeetAbdool() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-line bg-card p-8 sm:p-14">
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-accent/15 blur-[100px]" />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <span className="absolute -inset-2 rounded-full bg-gradient-to-tr from-accent to-[#f7c600] opacity-80 blur-sm" />
              <Image
                src="/abdool.jpg"
                alt="Abdool Moh"
                width={144}
                height={144}
                className="relative size-32 rounded-full border-4 border-card object-cover sm:size-36"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-accent">Meet the seller</p>
              <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">Hi, I&apos;m Abdool.</h2>
              <p className="mt-4 max-w-xl text-lg text-muted">
                I find clean used cars in the Netherlands and get them to Nigeria. You see every photo and every price
                up front, and you deal with me directly.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <WhatsAppButton label="Chat with me" />
                <a
                  href={TWITTER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-5 py-3.5 text-sm font-medium transition hover:border-foreground"
                >
                  {TWITTER_HANDLE} on X ↗
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
