import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a09",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  // set NEXT_PUBLIC_SITE_URL to the real domain so link previews resolve on WhatsApp/X
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Abdool Moh Marketplace",
  description: "Quality used cars imported from the Netherlands. Browse, pick, and chat with Abdool on WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
