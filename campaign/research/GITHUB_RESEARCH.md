# GitHub and source research

Done 20 Oct 2026 from this cloud session. Credentials were used only through the
session's git proxy; no tokens appear in any file.

## Repositories

`list_repos` returned 37 repositories for the account. The ones with any
Dietary Guide relevance were cloned (shallow, read-only) and inspected:

| Repository | Access | What it holds | Product relevance |
|---|---|---|---|
| `amishardev/EDITSS` | attached (this repo) | This Remotion campaign, `flrecording.mp4` | Brand/app ads only |
| `amishardev/dg-ads` (private) | attached, cloned | 723 files, 449 MB: product packshots, logos, brochure, pitch decks, `DG-Content/` (articles, product ads, app ads), **`DG-Content/ad-assets/ad_catalogue.json`**, product-ad specs and captions | **Primary**: catalogue, packshots, approved copy |
| `NavdhiIITK/dietaryguide-web` | public, cloned | Website source (React). `src/data/store-products.ts`, `src/data/products.ts`, `public/llms.txt`. Last commit 2026-08-20 | Product names, descriptions, prices, box contents (partly contradicts packs) |
| `amishardev/DGWEBSITEIMG` | public, cloned | 51 images, 104 MB: the website's image host. Packshots, **real phone photos of the products and the opened box**, brand scene images | **Primary** for imagery |
| `Amishardev-navdhi/dgwebimages` | public, cloned | 13 blog header images | none |
| `amishardev/dg` (private) | attached, cloned | 2 Navdhi logo PNGs | none |
| `amishardev/dgblog` | public, cloned | Blog site; one 10 s clip of IRA with the Almond bar | minor |

Not inspected (no Dietary Guide signal in name or description): SKILLIN,
healers.co.in, orbi, voltasuntech*, kollector.ai, navdhiweb (only referenced for
two bar image URLs that are byte-identical to the dg-ads copies), FRESHERSS2026,
nahace, NAFA*, haldimodel, Amishardev-navdhi/navdhi, vawakening*,
ANVEAI/nutriverse-3d-guide-78, viral-hook-ai-, amishsharma.com, campusshere,
iimsambalpurgpt, eigenclub, nitk, orbie-videodb, amishardev/navdhi, trinityweb,
Healer-s-Homoeopathy-images, Deuterium*, lipikar-*.

## Official website
`https://dietaryguide.in/products` could not be reached from this environment
(DNS ENOTFOUND via both WebFetch and curl). Its content was read instead from
its source repository `dietaryguide-web`, which is what the site renders.

## Key files and what they establish

| File | Finding |
|---|---|
| `dg-ads/DG-Content/ad-assets/ad_catalogue.json` | The 7-item catalogue (granola, chana, almond, tea, seeds, rajma, treat), exact names, image file per product, net weights, pack chips, uses/moments, brand copy |
| `dg-ads/DG-recovered-scheduled-task-prompts.md` | Product rotation, brand copy rules ("Never claim cure/diagnosis/detox"), handle `@dietaryguide.in`, CTA "Shop at dietaryguide.in" |
| `dg-ads/DG-Content/Product Ads/*/spec.json, caption.md` | 47 published product ads. Recurring approved lines: "Roasted, never fried", "10g plant protein in every 40g bar", "21g protein, no added sugar", "No detox drama" |
| `dietaryguide-web/src/data/store-products.ts` | Box contents: granola, Chana Jor, plant-protein bars, Digestion Tea, branded pouch/tee. Prices ₹999/₹149/₹55, ratings, reviews (all **unverified**, not used) |
| `dietaryguide-web/src/data/products.ts` | Older/alternate copy: granola millets = jowar, bajra, ragi (matches brochure) |
| `DGWEBSITEIMG/234t34t.jpeg`, `ewrt34t32tafafdq3.jpeg` | **Real photos of the opened Wellness Treat box**, the strongest evidence of contents |
| `DGWEBSITEIMG/WhatsApp Image 2026-02-24 …` | Real photos of the Chana and Rajma jars |
| `dg-ads/Product Design Portfolio … .pdf` (Oct 2025) | Earlier concept: "five portion-sized packs in one premium gift box". Superseded by the photos |
| `dg-ads/White and Brown … Brochure.pdf` | Byte-identical to the supplied brochure |

## Facts that remain uncertain
- Ingredients and nutrition of every product (no legible panel; sources conflict).
- Digestion Tea ingredients (brochure vs website vs pack art all differ) and whether it is caffeine-free.
- Whether the bars contain honey (website) or are vegan (pack). The pack wins.
- Bar weight: 40g (pack, catalogue) vs 35g (website). The pack wins.
- Second jar in the box: probably Rajma Jor (contents), label not visible.
- Current prices, offers, and whether the "complimentary surprise gift" promotion is still running.

## Source findings vs creative assumptions
Everything in `PRODUCT_BIBLE.md` under "Verified" comes from the sources above.
Creative choices (moods, metaphors, music, camera moves, copy phrasing such as
"Subah, sorted.") are in `../PRODUCT_STORYBOARD.md` and are marked as creative,
never as product facts.
