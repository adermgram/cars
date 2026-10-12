import { Car, whatsappLink } from "@/lib/cars";

export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.9 13.6c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.600-.1a12.800 12.800 0 0 1-4.500-2.800 8 8 0 0 1-1.800-2.800c-.2-.6 0-1.300.4-1.800.2-.2.400-.3.600-.3h.4c.2 0 .3 0 .4.400l.6 1.500c.1.200.1.300 0 .400l-.3.400-.3.300c-.1.100-.2.300-.1.400.4.700 1.100 1.500 2.200 2.100.4.200.6.200.700 0l.6-.7c.1-.2.300-.2.500-.1l1.500.7c.2.100.3.200.4.300.1.100.1.500-.1 1.100Z" />
    </svg>
  );
}

export function WhatsAppButton({ car, className = "", label }: { car?: Car; className?: string; label?: string }) {
  return (
    <a
      href={whatsappLink(car)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-lg shadow-accent/20 transition hover:scale-[1.03] hover:shadow-xl active:scale-95 ${className}`}
    >
      <WhatsAppIcon />
      {label ?? "Chat on WhatsApp"}
    </a>
  );
}
