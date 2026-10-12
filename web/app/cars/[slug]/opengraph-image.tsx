import { asJpeg, carImage } from "@/lib/og";
import { cars } from "@/lib/cars";

export const alt = "Car listing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug)!;
  return asJpeg(await carImage(car, "og"));
}
