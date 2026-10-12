import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images are pre-optimised to WebP by scripts/build-catalog.ts
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
