import data from "@/data/cars.json";

export type CarImage = { src: string; thumb: string; w: number; h: number };
export type Car = {
  slug: string;
  label: string | null;
  sold: boolean;
  landedAt: string | null;
  brand: string;
  name: string;
  transmission: "Automatic" | "Manual" | null;
  year: string | null;
  priceMin: number | null;
  priceMax: number | null;
  images: CarImage[];
};

export const cars = data as Car[];
export const brands = [...new Set(cars.map((c) => c.brand))];

export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "31634120379";
export const TWITTER = "https://x.com/abdool_moh";
export const TWITTER_HANDLE = "@abdool_moh";
export const cheapest = Math.min(...(data as Car[]).flatMap((c) => (c.priceMin != null ? [c.priceMin] : [])));
export const CREDIT_NAME = "Baseline Systems Africa";
export const CREDIT_HREF = "https://www.baselinesystemsafrica.com";
export const SITE_NAME = "Abdool Moh Marketplace";

const m = (n: number) => `₦${Number.isInteger(n) ? n : n.toFixed(1).replace(/\.0$/, "")}m`;

export function formatPrice(c: Pick<Car, "priceMin" | "priceMax">) {
  if (c.priceMin == null || c.priceMax == null) return "Ask for price";
  return c.priceMin === c.priceMax ? m(c.priceMin) : `${m(c.priceMin)} – ${m(c.priceMax)}`;
}

export const quickAsks = [
  ["Is it available?", "Is it still available?"],
  ["Can I inspect it?", "Can I get more photos or a video, and inspect it?"],
  ["Shipping to my city?", "How much would shipping to my city in Nigeria cost?"],
] as const;

export function whatsappLink(c?: Car, ask?: string) {
  const text = c
    ? `Hi Abdool, I'm interested in the ${c.name}${c.label ? ` (${c.label})` : ""}${c.transmission ? ` ${c.transmission}` : ""} listed at ${formatPrice(c)}. ${ask ?? "Is it still available?"}`
    : "Hi Abdool, I saw your marketplace and I'd like to know more about your cars.";
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}
