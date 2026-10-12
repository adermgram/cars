import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve(__dirname, "../../cars");
const OUT_IMG = path.resolve(__dirname, "../public/cars");
const OUT_JSON = path.resolve(__dirname, "../data/cars.json");
const MAX_W = 1600;
const THUMB_W = 640;

type Car = {
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
  images: { src: string; thumb: string; w: number; h: number }[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// "7m", "7.5m", "5.5", "7..4m" -> millions
function toMillions(raw: string): number | null {
  const cleaned = raw.replace(/\.{2,}/g, ".").replace(/[^\d.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseName(folder: string) {
  const warnings: string[] = [];
  let rest = folder.replace(/\s+/g, " ").trim();

  let priceMin: number | null = null;
  let priceMax: number | null = null;
  rest = rest.replace(/\s(\d+(?:\.\d+)?m)$/i, " N$1"); // "29m" with no N
  const idx = rest.search(/\bN\s?\d/i);
  if (idx !== -1) {
    const priceStr = rest.slice(idx).replace(/^N\s?/i, "");
    rest = rest.slice(0, idx).trim();
    const parts = priceStr.split(/\s*-\s*/).map((p) => p.replace(/^N/i, "").replace(/\s+/g, ""));
    priceMin = toMillions(parts[0]);
    priceMax = parts[1] ? toMillions(parts[1]) : priceMin;
    if (priceMin !== null && priceMax !== null && priceMin > priceMax) {
      [priceMin, priceMax] = [priceMax, priceMin];
    }
  } else {
    warnings.push("no price");
  }

  let transmission: Car["transmission"] = null;
  if (/auto/i.test(rest)) transmission = "Automatic";
  else if (/man[ua]+l/i.test(rest)) transmission = "Manual";
  rest = rest.replace(/\bauto(matic)?\b/gi, "").replace(/\bman[ua]+l\b/gi, "");

  const yearMatch = rest.match(/\b(20\d\d(?:-\d\d)?)\b/);
  const year = yearMatch ? yearMatch[1] : null;

  const name = rest
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

  return { name, transmission, year, priceMin, priceMax, warnings };
}

function* walk(dir: string): Generator<string> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && /\.jpe?g$/i.test(e.name));
  if (files.length) yield dir;
  for (const e of entries) if (e.isDirectory()) yield* walk(path.join(dir, e.name));
}

type Override = { cover?: number; label?: string; sold?: boolean; landedAt?: string };
const OVERRIDES = path.resolve(__dirname, "../data/overrides.json");
const overrides: Record<string, Override> = fs.existsSync(OVERRIDES)
  ? JSON.parse(fs.readFileSync(OVERRIDES, "utf8"))
  : {};

async function main() {
  fs.rmSync(OUT_IMG, { recursive: true, force: true });
  fs.mkdirSync(OUT_IMG, { recursive: true });
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });

  const cars: Car[] = [];
  const report: string[] = [];
  const seen = new Set<string>();

  for (const brandDir of fs.readdirSync(SRC)) {
    const brandPath = path.join(SRC, brandDir);
    if (!fs.statSync(brandPath).isDirectory()) continue;
    const folderBrand =
      brandDir === "Golf Volkswagon" ? "Volkswagen" : brandDir === "Toyota Yaris" ? "Toyota" : brandDir === "Trucks" ? "DAF" : brandDir;

    for (const listingPath of walk(brandPath)) {
      const folder = path.basename(listingPath);
      // KIA listings were filed under the Toyota folder by mistake
      const brand = /^kia\b/i.test(folder) || path.basename(path.dirname(listingPath)) === "KIA" ? "Kia" : folderBrand;
      const parsed = parseName(folder);
      parsed.name = parsed.name.replace(/^kia/i, "Kia").replace(/^Kia Morning - Picanto/, "Kia Picanto (Morning)");
      if (!parsed.name.toLowerCase().startsWith(brand.toLowerCase()) && !/^(i-robot)/i.test(parsed.name)) {
        parsed.name = `${brand} ${parsed.name}`;
      }
      if (/^i-robot/i.test(parsed.name)) parsed.name = "Honda I-Robot";
      const base = slugify(`${parsed.name} ${parsed.transmission ?? ""} ${parsed.priceMin ?? ""} ${parsed.priceMax ?? ""}`);
      let slug = base;
      for (let i = 2; seen.has(slug); i++) slug = `${base}-${i}`;
      seen.add(slug);
      const ov = overrides[slug] ?? {};

      const files = fs
        .readdirSync(listingPath)
        .filter((f) => /\.jpe?g$/i.test(f))
        .sort();
      const outDir = path.join(OUT_IMG, slug);
      fs.mkdirSync(outDir, { recursive: true });

      const images: Car["images"] = [];
      let n = 1;
      for (const f of files) {
        const input = sharp(path.join(listingPath, f)).rotate();
        const meta = await input.clone().metadata();
        const base = String(n++).padStart(2, "0");
        const big = await input
          .clone()
          .resize({ width: MAX_W, withoutEnlargement: true })
          .webp({ quality: 78 })
          .toFile(path.join(outDir, `${base}.webp`));
        await input
          .clone()
          .resize({ width: THUMB_W, withoutEnlargement: true })
          .webp({ quality: 70 })
          .toFile(path.join(outDir, `${base}-t.webp`));
        images.push({
          src: `/cars/${slug}/${base}.webp`,
          thumb: `/cars/${slug}/${base}-t.webp`,
          w: big.width,
          h: big.height,
        });
        void meta;
      }

      // overrides.cover = 1-based photo number to use as the cover; it is moved to the front
      if (ov.cover && ov.cover > 1 && ov.cover <= images.length) {
        const [c] = images.splice(ov.cover - 1, 1);
        images.unshift(c);
      }

      cars.push({
        slug,
        label: ov.label ?? null,
        sold: ov.sold ?? false,
        landedAt: ov.landedAt ?? null,
        brand,
        name: parsed.name,
        transmission: parsed.transmission,
        year: parsed.year,
        priceMin: parsed.priceMin,
        priceMax: parsed.priceMax,
        images,
      });
      report.push(
        `${parsed.warnings.length ? "!" : " "} ${folder}  =>  ${parsed.name} | ${parsed.transmission ?? "?"} | ${
          parsed.priceMin ?? "-"
        }-${parsed.priceMax ?? "-"} | ${images.length} imgs ${parsed.warnings.join(",")}`,
      );
    }
  }

  cars.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
  fs.writeFileSync(OUT_JSON, JSON.stringify(cars, null, 2));
  console.log(report.join("\n"));
  console.log(`\n${cars.length} listings, ${cars.reduce((s, c) => s + c.images.length, 0)} images`);
}

main();
