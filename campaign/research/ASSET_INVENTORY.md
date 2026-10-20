# Asset inventory (product campaign)

Paths are relative to each cloned repo:
- `dg-ads/` = `github.com/amishardev/dg-ads` (private)
- `web-img/` = `github.com/amishardev/DGWEBSITEIMG` (public; the website's image host)
- `brochure/` = images embedded in `White and Brown Minimalist Marbel Skincare Brochure.pdf` (extracted with `pdfimages`)

Columns: **res** = pixels, **α** = transparent background, **front** = front of pack clearly shown,
**close-up** = holds up at 9:16 close framing, **work** = prep needed.
"Real" = a phone photo of the physical product. "Scene" = a brand-made styled image (AI-rendered; packaging text checked visually).

Duplicate files (same MD5) are listed once. `web-img/` copies of the dg-ads packshots are byte-identical.

## Best packshot per product (used as hero)

| Product | File | res | aspect | α | front | close-up | work | Notes |
|---|---|---|---|---|---|---|---|---|
| Chana Jor | `dg-ads/ChatGPT Image Mar 6, 2026, 12_15_18 AM-Photoroom.png` | 452×1010 | 0.45 | yes | yes | medium (≤1.2× scale) | none | 2× the brochure's 226×505 crop. CAT `image` for chana |
| Rajma Jor | `dg-ads/RAJMAJOR.png` | 305×757 | 0.40 | yes | yes | limited (≤1.4×) | none | Lowest-res packshot; no larger version exists in any repo |
| Millet Granola | `dg-ads/WhatsApp Image 2026-03-01 at 12.14.15 AM-Photoroom.png` | 494×684 | 0.72 | yes | yes | medium | none | CAT `image` for granola |
| Mixed Seed Bar | `dg-ads/, 2026, 08_29_33 PM.png` | 1536×1024 | 1.50 | no | yes | good | bg removal + crop | **Render defect:** net-weight line reads "Net Weigi Seeds". In the campaign build, that line is replaced with the identical "Net Weight: 40g" artwork from the Almond carton render (same layout, same font); the brochure photo of the real carton reads "Net Weight: 40g". Documented, nothing else touched |
| Almond Bar | `dg-ads/08_34_57 PM.png` | 1536×1024 | 1.50 | no | yes | good | bg removal + crop | Clean text |
| Digestion Tea | `dg-ads/diegetiontea.png` | 614×819 | 0.75 | yes | yes | medium | none | CAT `image` for tea |
| The Wellness Treat | `dg-ads/324t32t4erwt-removebg-preview.png` | 758×589 | 1.29 | yes | yes (flat front) | medium | none | `web-img/The Wellness Treat-Photoroom.png` (1280×847) has the same ~760×594 content plus padding, so it's no sharper |

## Real product photos (physical products)

| File | res | Shows | Use |
|---|---|---|---|
| `web-img/234t34t.jpeg` | 899×1599 (9:16) | **Opened Wellness Treat box with contents** | Hero ad: the real contents reveal |
| `web-img/ewrt34t32tafafdq3.jpeg` | 1599×899 | Top-down of the box contents (tea, granola, Chana Jor 140g, second jar, 2 bar cartons, DG tee) | Contents evidence; detail pans |
| `web-img/re.jpeg`, `wertewrt.jpeg` | 1599×899 | Real closed box (sleeve + lid print) | Evidence of the real box |
| `web-img/WhatsApp Image 2026-02-24 at 8.01.37 PM.jpeg` | 1200×1600 | Real Chana Jor jar, close | Chana macro (real roasted chana visible through the jar) |
| `web-img/WhatsApp Image 2026-02-24 at 8ghjghj.01.38 PM.jpeg` | 1200×1600 | Chana Jor jar standing | Chana texture |
| `web-img/WhatsApp Image 2026-02-24fgyh at 8.01.37 PM.jpeg` | 1200×1600 | Chana Jor jar | spare |
| `web-img/WhatsApp Image 2026-02-24 at 8.01.34 PM.jpeg`, `…oooo4…`, `…aouut…`, `…2ghjhj4…` | 1200×1600 | Chana + Rajma jars side by side | Rajma macro (real roasted rajma in the jar) |
| `web-img/324t32t4erwt.jpeg`, `wertwertwertewrtewtr.jpeg`, `wertwrtwt23.jpeg` | 899×1599 | Real granola carton | Granola "real pack" beat |
| `web-img/ewrtewrtertewrterw.jpeg`, `wertwertwertew.jpeg` | 899×1599 | Real Digestion Tea carton | Tea "real pack" beat |
| `web-img/WhatsApp Image 2026-02-28 at 12.07.05 PM.jpeg` | 1599×899 | Real closed box | spare |
| `web-img/WhatsApp Image 2026-02-28 at 12.38.44 PM…jpeg` | 899×1599 | Real tea carton, small in frame | spare |

## Brand scene images (styled, AI-rendered by the brand; packaging text checked)

| File | res | Product | Look | Use |
|---|---|---|---|---|
| `web-img/ChatGPT Image Mar 6, 2026, 01_07_12 AM.png` | 1024×1536 | Treat | lidded box on gold, mint, soft window light | Hero: luxury reveal |
| `web-img/…01_07_21 AM.png` | 1024×1536 | Treat | dark, candles, wet reflective floor | Hero: silhouette opener |
| `web-img/…01_07_19 AM.png` | 1024×1536 | Treat | marble, mug, morning light | spare |
| `web-img/…01_07_23 AM.png` | 1024×1536 | Treat | Holi colour burst | spare (festive) |
| `web-img/…01_06_57 AM.png` | 1024×1024 | Treat | white box angled on white | spare |
| `web-img/…01_07_09 AM.png` | 1024×1024 | Treat | CG open box with pouch, granola, tea, bar | **Not used** (real photo preferred) |
| `web-img/…01_35_55`, `01_35_58`, `01_36_04`, `01_36_08`, `01_36_17` | 1024×1536 | Granola | marble kitchen, bowls, morning light | Granola film |
| `web-img/…01_37_08` | 1024×1024 | Granola | box on rocks | spare |
| `web-img/…01_37_11` | 1024×1536 | Granola | dark/yellow split | spare |
| `brochure/im-001.png` | 878×878 | Granola | sunlit kitchen, bowl, kettle | Granola film |
| `web-img/…01_42_06`, `01_42_08` | 1024×1024 | Chana | dark studio, magnifier on chana | Chana film |
| `web-img/…01_42_11` | 1024×1536 | Chana | dark kitchen, flying bits | Chana film |
| `web-img/…01_42_19` | 1536×1024 | Chana | desk with laptop | Chana film |
| `web-img/…01_42_23` | 1024×1536 | Chana + Rajma | ember/spice sparks, "DG" in sparks | Rajma film |
| `web-img/…01_50_33` | 1024×1024 | Rajma | fiery ember close-up | Rajma film |
| `web-img/…01_46_19` | 1024×1024 | Rajma | tilted jar, studio | Rajma film |
| `web-img/…01_46_24` | 1024×1536 | Rajma | window light, coffee | Rajma film |
| `web-img/…01_46_03` (=`01_46_11`) | 1536×1024 | Chana + Rajma | desk, both jars | spare |
| `web-img/…01_46_18`, `brochure/im-003.png` | 1536×1024 / 615×410 | Rajma | runner holding the jar at sunrise | spare (fitness trope; not used) |
| `brochure/im-008.png` | 934×607 | Both bars | cartons, wrappers, real-looking bars, almonds, pumpkin seeds | Bar films (macro crops) |
| `brochure/im-009.png` | 410×615 | Tea | carton, star anise, tea bags | Tea film |
| `brochure/im-002.png` | 753×753 | Treat | candles (same set as 01_07_21) | spare |
| `brochure/im-000.png` | 2189×1460 | — | white marble texture | backgrounds |
| `dgblog/04-08-2026.mp4` | 1280×720, 10s | Almond bar + IRA | park, flying almonds | Not used (landscape, low-res for 9:16) |

## Brand and character

| File | res | α | Use |
|---|---|---|---|
| `dg-ads/logo_transparet_dark.png` | 500×500 | yes | Wordmark on light backgrounds |
| `dg-ads/logo_transparent_white.png` | 512×512 | yes | Wordmark on dark backgrounds |
| `campaign/public/ira/ira.png` (the supplied IRA reference) | 1254×1254 | yes | Sign-off cameo in selected films. `IRA_COLOURED.png` itself is not in any workspace or repo; the IRA image supplied earlier in this project is the same character and is used instead |

## Missing / weak
- **No high-res packshots.** The largest are 452–760px on the long side (bars excepted). No source files (AI/PSD/print PDFs) exist in any repo.
- **No real macro food photography or video** of the snacks themselves. Texture comes from crops of the real jar photos and brand scenes.
- **No legible ingredient or nutrition panels** on any image.
- **No licensed music or SFX** in any repo. The score is composed in code (`scripts/compose.py`).
- **No real box-opening footage.** The hero film animates the real photos and packshots, and says nothing to imply live footage.
