import Link from "next/link";
import { PlateTag } from "@/components/PlateTag";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <PlateTag size="lg">404</PlateTag>
        <h1 className="mt-8 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
          This one already
          <br />
          <span className="text-accent">left the lot.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-muted">The page you wanted isn&apos;t here, but plenty of cars are.</p>
        <Link
          href="/#cars"
          className="mt-8 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition hover:scale-[1.03] active:scale-95"
        >
          See the cars
        </Link>
      </div>
    </main>
  );
}
