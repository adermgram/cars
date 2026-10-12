# Abdool Moh Marketplace: project handoff

Read this first. It is the full state of the project, written so a new Claude session (or a person) can continue without the earlier chat.

## What this is
A storefront website for **Abdool Moh** (X: @abdool_moh, WhatsApp +31 634120379), a Nigerian based in the Netherlands who sells imported used cars through a WhatsApp Business catalog. We turned his catalog into a site, to **pitch it to him and get paid**. He is well known on Twitter/X, so a launch post from him brings new clients to us. His brand is **lifestyle / success story**.

- Built by **Baseline Systems Africa** (https://www.baselinesystemsafrica.com). The footer credit "Website by Baseline Systems Africa" is intentional and drives inbound clients. Keep it.
- Strategy decisions already made: **no Paystack, no chatbot, no backend** in v1 (buyers negotiate on WhatsApp). Every car has a "Chat on WhatsApp" button with a prefilled message instead. Admin panel and a Paystack deposit are paid upgrades for later. `project/apps` (NestJS API + Next dashboard, in a separate folder on the author's PC) is the possible v1.5 admin.

## Repo layout
- `cars/`: **source of truth**: Abdool's raw photos. `cars/<Brand>/<Listing folder>/*.JPG`. Folder names carry the data, e.g. `BMW 3 series Automatic N7m - N8m`. `N` = naira, `m` = million. Prices are ranges.
- `web/`: the Next.js app (Next 16.4, React 19, Tailwind 4, Framer Motion). **Next 16 differs from older versions: read `web/node_modules/next/dist/docs/` before using framework APIs** (see `web/AGENTS.md`).
- Dev: `cd web && npm install && npm run dev`. Production check: `npx next build && npx next start -p 3100`.

## How the data pipeline works
`web/scripts/build-catalog.ts` (run with `cd web && npx tsx scripts/build-catalog.ts`):
1. walks `cars/`, parses each folder name (brand, model, transmission, year, price min/max in millions),
2. resizes photos to WebP into `web/public/cars/<slug>/NN.webp` (1600px) and `NN-t.webp` (640px),
3. writes `web/data/cars.json` (59 listings, 336 photos),
4. applies `web/data/overrides.json`.

`overrides.json` is keyed by slug and supports `cover` (1-based photo number to use as the cover), `label` (distinguishes cars with identical names, e.g. "Graphite"), `sold` (shows the SOLD stamp), `landedAt`. **Edit overrides, never `cars.json`** (it is regenerated). Covers and colour labels were chosen by eye from contact sheets. The script needs the sibling `../cars` folder, so it only runs where the raw photos exist. `web/public/cars` and `cars.json` are committed, so the site builds without re-running it.

Parsing notes: the Kia folder was filed under `Toyota Yaris/` by mistake. The script moves Kia listings to their own brand without touching the source folders. 7 listings have no price in the folder name and show "Ask for price" (Mercedes C300 x3, C350, Kia Rio x2, Yaris Automatic).

## What is built (all in `web/`)
- **Look:** dark showroom, Dutch-orange accent (`--accent` in `app/globals.css`), Bricolage Grotesque display font, film grain, reduced-motion respected.
- **Signature motif: number plates.** Every price is a yellow Dutch plate (`components/PlateTag.tsx`); the route ends with a white Nigerian plate; favicon (`app/icon.tsx`), 404 (`app/not-found.tsx`) and share images reuse it.
- **Home (`app/page.tsx`):** `Hero` (word-reveal headline, count-up stats) → `Marquee` photo wall → `Catalog` (budget finder, brand and transmission filters, tilt cards) → `Journey` (scroll-pinned Netherlands → Nigeria route) → `MeetAbdool` → WhatsApp call-to-action → footer with credit.
- **Car page (`app/cars/[slug]/`):** gallery (swipe, thumbnails, full-screen viewer), plate price, WhatsApp button (sticky on phones), quick-question chips (`QuickAsk`), share button, related cars.
- **Share engine:** `app/cars/[slug]/opengraph-image.tsx` (link preview) and `app/cars/[slug]/poster/route.tsx` (1080x1350 download), both via `lib/og.tsx` (Satori: flexbox only, ₦ needs the Inter fallback font, already handled).
- **Mobile:** verified at 390px and 360px; 2-column card grid on phones; no horizontal overflow. Most visitors arrive from Twitter on a phone, so **always re-check phone width after UI changes**.

## Deployment (done)
- Live at **https://abdoolmoh.baselinesystemsafrica.com** (Vercel project `web`, Root Directory `web`). Every push to `main` on GitHub (`adermgram/cars`) redeploys automatically; don't deploy with the CLI from `web/`.
- DNS: CNAME `abdoolmoh` at Hostinger (domain registrar) → Vercel. `NEXT_PUBLIC_SITE_URL` is set for production. If a dedicated domain (e.g. abdoolmoh.com) is bought later, update that env var and redeploy.
- Tested on a real phone (iPhone Safari, Android Chrome): OK.

## Not done yet / next steps (in order)
1. Home page has no share image (only car pages do); consider an `app/opengraph-image.tsx`.
3. **Pitch kit:** 20-second vertical phone screen recording (budget slider, Journey, a share poster) and the DM to Abdool. Ask him for: a higher-resolution photo, his story in 3 lines, 1 or 2 real numbers (cars delivered, years). Offer: setup fee plus monthly hosting/updates; propose a domain like abdoolmoh.com.
4. **WhatsApp click counting** (Vercel Analytics custom event in `WhatsAppButton`) so we can show him real lead numbers. Not built.
5. "Just landed" strip and SOLD stamps: the components exist (`SoldStamp`), no car is marked sold yet (do not invent sales).
6. Optional later: Paystack deposit, admin panel, € price toggle.

## Content that is draft and must be confirmed with Abdool before going public
- The Journey steps (`components/Journey.tsx` `beats`) and the "Hi, I'm Abdool" text (`components/MeetAbdool.tsx`) are placeholder copy we wrote. No stats or testimonials are invented; keep it that way.
- His photo `web/public/abdool.jpg` is a 400x400 profile picture taken from X: used only as a small circle (nav, Meet section, poster). Get his permission and a better photo.
- Hero claim "Imported from the Netherlands / Real prices" matches what he does but he should approve the wording.

## Gotchas
- This was developed on Windows. Writing long multi-line heredocs in Git Bash can fail; prefer writing files directly.
- `next start` on Windows can leave an old server holding port 3100 after a rebuild; kill it before restarting or you will see a stale, unstyled site.
- Headless-browser screenshots stall Framer Motion animations if you use a virtual-time budget; wait in real time instead.
