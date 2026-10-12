import { Car, quickAsks, whatsappLink } from "@/lib/cars";

export function QuickAsk({ car }: { car: Car }) {
  return (
    <div className="mt-6">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Quick question</p>
      <div className="flex flex-wrap gap-2">
        {quickAsks.map(([label, text]) => (
          <a
            key={label}
            href={whatsappLink(car, text)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-3.5 py-2 text-sm transition hover:border-accent hover:text-accent"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
