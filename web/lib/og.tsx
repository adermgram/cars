import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { Car, WHATSAPP, cars, cheapest, formatPrice } from "./cars";

const fontDir = path.join(process.cwd(), "node_modules/@fontsource/bricolage-grotesque/files");
const interDir = path.join(process.cwd(), "node_modules/@fontsource/inter/files");
const font = (file: string, name = "Bricolage") => ({
  name,
  data: fs.readFileSync(file),
  weight: 800 as const,
  style: "normal" as const,
});
// Bricolage for the letters; Inter, under its own family name, supplies the naira sign (Bricolage lacks it)
const fonts = [
  font(path.join(fontDir, "bricolage-grotesque-latin-800-normal.woff")),
  font(path.join(fontDir, "bricolage-grotesque-latin-ext-800-normal.woff")),
  font(path.join(interDir, "inter-latin-ext-800-normal.woff"), "Naira"),
];

// Satori can't read webp, so hand it a JPEG data URI
async function jpegUri(file: string, width: number) {
  const buf = await sharp(path.join(process.cwd(), "public", file)).resize({ width }).jpeg({ quality: 82 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

function Plate({ text, size }: { text: string; size: number }) {
  return (
    <div
      style={{
        display: "flex",
        height: size * 1.5,
        border: `${Math.max(2, size / 12)}px solid #111`,
        borderRadius: size / 4,
        overflow: "hidden",
        background: "#f7c600",
        color: "#111",
        fontFamily: "Bricolage",
        fontSize: size,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: size * 1.1,
          background: "#0a3fa3",
          color: "#fff",
          fontSize: size * 0.4,
        }}
      >
        <div style={{ display: "flex" }}>NL</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: `0 ${size * 0.5}px` }}>
        {text.split("₦").map((part, i) => (
          <div key={i} style={{ display: "flex", whiteSpace: "pre" }}>
            {i > 0 && <div style={{ display: "flex", fontFamily: "Naira" }}>₦</div>}
            {part}
          </div>
        ))}
      </div>
    </div>
  );
}

// link previews as JPEG: the PNGs are 1-2 MB and WhatsApp drops large preview images
export async function asJpeg(res: Response) {
  const buf = await sharp(Buffer.from(await res.arrayBuffer())).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(buf), { headers: { "Content-Type": "image/jpeg" } });
}

// the yellow plate with the blue NL strip, used by the favicon and the apple icon
export function plateIcon(px: number) {
  const s = px / 64;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a09" }}>
        <div
          style={{
            display: "flex",
            width: 60 * s,
            height: 36 * s,
            borderRadius: 6 * s,
            overflow: "hidden",
            border: `${3 * s}px solid #fff`,
            background: "#f7c600",
          }}
        >
          <div style={{ display: "flex", width: 14 * s, background: "#0a3fa3" }} />
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", color: "#111", fontSize: 22 * s, fontWeight: 800 }}>
            AM
          </div>
        </div>
      </div>
    ),
    { width: px, height: px },
  );
}

// link preview for the home page: headline, real starting price and count, four real covers
export async function homeImage() {
  const picks = ["Mercedes", "BMW", "Toyota", "Peugeot"].map((b) => cars.find((c) => c.brand === b && !c.sold) ?? cars[0]);
  const photos = await Promise.all(picks.map((c) => jpegUri(c.images[0].src, 600)));

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#0a0a09", fontFamily: "Bricolage" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 520, height: 630, display: "flex", flexWrap: "wrap" }}>
          {photos.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={p} alt="" width={260} height={315} style={{ width: 260, height: 315, objectFit: "cover" }} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: "linear-gradient(to right, #0a0a09 54%, rgba(10,10,9,0.6) 62%, rgba(10,10,9,0) 78%)",
          }}
        />

        <div style={{ position: "absolute", top: 48, left: 56, bottom: 52, width: 610, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", color: "#f4f1e8", fontSize: 32 }}>
            Abdool Moh<span style={{ color: "#ff6a1a" }}>.</span>
            <span style={{ marginLeft: 12, color: "#c9c5b8", fontSize: 26 }}>Marketplace</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#f4f1e8", fontSize: 76, lineHeight: 0.98, letterSpacing: -2.5 }}>Clean used cars.</div>
            <div style={{ display: "flex", color: "#ff6a1a", fontSize: 76, lineHeight: 0.98, letterSpacing: -2.5 }}>Straight from Europe.</div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Plate text={`From ${formatPrice({ priceMin: cheapest, priceMax: cheapest })}`} size={42} />
            <div style={{ display: "flex", flexDirection: "column", marginLeft: 28, color: "#f4f1e8", fontSize: 28 }}>
              <div style={{ display: "flex" }}>{cars.length} cars listed</div>
              <div style={{ display: "flex", color: "#8d897c", fontSize: 24 }}>Netherlands to Nigeria</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}

export async function carImage(car: Car, kind: "og" | "poster") {
  const poster = kind === "poster";
  const [w, h] = poster ? [1080, 1350] : [1200, 630];
  const photo = await jpegUri(car.images[0].src, poster ? 1080 : 1200);
  const avatar = poster ? await jpegUri("abdool.jpg", 160) : null;
  const title = car.label ? `${car.name} · ${car.label}` : car.name;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#0a0a09", fontFamily: "Bricolage" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" width={w} height={poster ? 960 : h} style={{ objectFit: "cover", position: "absolute", top: 0, left: 0, width: w, height: poster ? 960 : h }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: poster
              ? "linear-gradient(to bottom, rgba(10,10,9,0) 45%, #0a0a09 72%)"
              : "linear-gradient(to top, rgba(10,10,9,0.95) 5%, rgba(10,10,9,0) 65%)",
          }}
        />
        {/* top shade so the brand line reads on bright photos */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: poster ? 220 : 170,
            display: "flex",
            background: "linear-gradient(to bottom, rgba(10,10,9,0.75), rgba(10,10,9,0))",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: poster ? 48 : 36,
            left: poster ? 56 : 48,
            display: "flex",
            alignItems: "center",
            color: "#f4f1e8",
            fontSize: poster ? 38 : 30,
          }}
        >
          Abdool Moh<span style={{ color: "#ff6a1a" }}>.</span>
          <span style={{ marginLeft: 12, color: "#c9c5b8", fontSize: poster ? 30 : 24 }}>Marketplace</span>
        </div>

        <div
          style={{
            position: "absolute",
            left: poster ? 56 : 48,
            right: poster ? 56 : 48,
            bottom: poster ? 64 : 44,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", color: "#ff6a1a", fontSize: poster ? 34 : 26 }}>
            {car.transmission ? `${car.brand} · ${car.transmission}` : car.brand}
          </div>
          <div style={{ display: "flex", color: "#f4f1e8", fontSize: poster ? 96 : 68, lineHeight: 1.02, marginTop: 8, marginBottom: poster ? 36 : 24 }}>
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Plate text={formatPrice(car)} size={poster ? 64 : 44} />
            {poster && avatar && (
              <div style={{ display: "flex", alignItems: "center", color: "#f4f1e8", fontSize: 30 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: 20 }}>
                  <div style={{ display: "flex" }}>Chat with Abdool</div>
                  <div style={{ display: "flex", color: "#8d897c", fontSize: 26 }}>wa.me/{WHATSAPP}</div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="" width={96} height={96} style={{ width: 96, height: 96, borderRadius: 96, objectFit: "cover", border: "4px solid #ff6a1a" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { width: w, height: h, fonts },
  );
}
