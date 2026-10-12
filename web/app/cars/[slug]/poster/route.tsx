import { carImage } from "@/lib/og";
import { cars } from "@/lib/cars";

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) return new Response("Not found", { status: 404 });
  return carImage(car, "poster");
}
