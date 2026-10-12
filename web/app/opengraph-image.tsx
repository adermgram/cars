import { asJpeg, homeImage } from "@/lib/og";

export const alt = "Abdool Moh Marketplace: clean used cars, straight from Europe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default async function Image() {
  return asJpeg(await homeImage());
}
