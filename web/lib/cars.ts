import data from "@/data/cars.json";

export type CarImage = { src: string; thumb: string; w: number; h: number };
export type Car = {
  slug: string;
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

export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "31600000000";
export const SITE_NAME = "Abdool Moh Marketplace";

const m = (n: number) => `₦${Number.isInteger(n) ? n : n.toFixed(1).replace(/\.0$/, "")}m`;

export function formatPrice(c: Pick<Car, "priceMin" | "priceMax">) {
  if (c.priceMin == null || c.priceMax == null) return "Ask for price";
  return c.priceMin === c.priceMax ? m(c.priceMin) : `${m(c.priceMin)} – ${m(c.priceMax)}`;
}

export function whatsappLink(c?: Car) {
  const text = c
    ? `Hi Abdool, I'm interested in the ${c.name}${c.transmission ? ` (${c.transmission})` : ""} listed at ${formatPrice(c)}. Is it still available?`
    : "Hi Abdool, I saw your marketplace and I'd like to know more about your cars.";
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}
