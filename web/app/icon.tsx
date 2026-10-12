import { plateIcon } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// a tiny yellow plate with the blue NL strip
export default function Icon() {
  return plateIcon(64);
}
