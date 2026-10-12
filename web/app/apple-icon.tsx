import { plateIcon } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iPhone bookmark / home-screen icon, same plate as the favicon
export default function AppleIcon() {
  return plateIcon(180);
}
