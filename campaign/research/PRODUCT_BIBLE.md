# Dietary Guide · Product Bible (source-verified)

Compiled 20 Oct 2026 for the product video campaign. Every factual line carries
its source. **Packaging beats everything else**: where the brochure or website
data disagree with the printed pack, the pack wins, and the disagreement is
listed under "Do not use".

## Sources and how much to trust them

| Key | Source | Trust |
|---|---|---|
| **PACK** | The printed packaging, read from the official packshots and from real phone photos of the physical products (`dgwebsiteimg/WhatsApp Image 2026-02-24…`, `234t34t.jpeg`, `ewrt34t32tafafdq3.jpeg`, `324t32t4erwt.jpeg`, `re.jpeg`, `wertewrt.jpeg`…) | **Highest** |
| **CAT** | `dg-ads/DG-Content/ad-assets/ad_catalogue.json`, the brand's own product catalogue that its product-ad renderer reads | High for names, image mapping, weights and pack chips. Its quote "reviews" are not usable (see below) |
| **WEB** | `NavdhiIITK/dietaryguide-web` `src/data/store-products.ts` and `products.ts` (site source, last commit 2026-08-20) | Medium. Several entries contradict the packs, so it was used only where it agrees with PACK or photos |
| **BRO** | `White and Brown Minimalist Marbel Skincare Brochure.pdf` (identical copy in `dg-ads`) | Medium. **Its text columns are misaligned with its images** (see below) |
| **LIVE** | `dietaryguide.in/products` | **Not reachable** from this environment (DNS ENOTFOUND), so nothing was verified live |

### Brochure layout warning (verified visually)
- The paragraph "Powered by a nutrient-dense blend of Jowar, Bajra, and Ragi… 21g of plant-based protein per serving. Naturally sweetened and 100% preservative free" sits under the Chana Jor image but describes the **Millet Granola**. 21g/serving matches the granola pack, and WEB `products.ts` also says jowar/bajra/ragi.
- On page 2, the paragraph under the heading "DIGESTION TEA" ("Elevate your gifting with The Wellness Treat…") describes **The Wellness Treat**. The actual tea copy is the right-hand column ("The perfect post meal ritual…").

---

## Verified inventory

Six individual sellable products plus one gift box. The brand's own rotation
(CAT `rotation`) is: granola, chana, almond, tea, seeds, rajma, treat. No other
product appears in any source.

### 1. Roasted Chana Jor Masala
1. **Name:** Roasted Chana Jor Masala (PACK, CAT, WEB). Brochure shortens it to "Chana Jor".
2. **Category / use:** roasted savoury snack (namkeen). Chai time, desk, travel (CAT `uses`).
3. **Packaging:** clear PET jar, white screw lid, kraft-paper label. "Roasted" in orange, big orange "Chana Jor", "MASALA", a bowl illustration, green veg mark, DG logo. Chips: Vegan · Clean Label · 100% Roasted. Net weight 140g (PACK).
4. **Photos:** packshot `dg-ads/ChatGPT Image Mar 6, 2026, 12_15_18 AM-Photoroom.png` (452×1010, transparent). Real photos of the jar: `dgwebsiteimg/WhatsApp Image 2026-02-24 at 8.01.37 PM.jpeg` and others. See ASSET_INVENTORY.
5. **Ingredients:** **not verified.** The pack's ingredient panel is not legible in any image. WEB lists roasted chickpeas, rock salt, chaat masala, amchur, chilli, cumin, **"sunflower oil (trace)"**. BRO says "100% oil-free". These conflict.
6. **Nutrition:** **not verified** (WEB gives values but they cannot be checked against the pack).
7. **Verified features:** Vegan, Clean Label, 100% Roasted, 140g (PACK).
8. **Claims usable in ads:** "100% Roasted", "Vegan", "Clean Label", "140g". "Roasted, not fried" is a restatement of 100% roasted, consistent with CAT and WEB.
9. **Price:** not verified (WEB shows ₹149, but it couldn't be confirmed current). **Not used.**
10. **Link:** dietaryguide.in/products (BRO, CAT captions; not reachable live).
11. **Audience / occasion:** office-goers, students; 6 PM chai, monsoon evenings (CAT).
12. **Best angle:** chai-time crunch, a desi classic made modern.
13. **Do not use:** "oil-free" (conflicts with WEB), "high protein" or protein numbers, "no palm oil / no maida" (CAT copy, not on pack), "low GI", testimonials, price.
14. **Sources:** PACK (packshot + real photos), CAT `products.chana`, WEB `sp-2`, BRO p1.

### 2. Roasted Rajma Jor Masala
1. **Name:** Roasted Rajma Jor Masala (PACK, CAT). WEB and BRO call it "Rajma Jor Masala".
2. **Category / use:** roasted savoury snack. Chai time, desk, travel (CAT).
3. **Packaging:** same jar family as Chana Jor. Kraft label with **dark brown/maroon** "Rajma Jor", red-brown kidney-bean bowl illustration. Chips: Vegan · Clean Label · 100% Roasted. Net weight **125g** (PACK).
4. **Photos:** packshot `dg-ads/RAJMAJOR.png` (305×757, transparent, the lowest-res packshot). Real photos with Chana Jor: `WhatsApp Image 2026-02-24 at 8.01.34 PM.jpeg`, `…oooo4…`, `…aouut…`.
5. **Ingredients:** not verified (WEB: roasted kidney beans + spices).
6. **Nutrition:** not verified.
7. **Verified features:** Vegan, Clean Label, 100% Roasted, 125g (PACK). Made from roasted kidney beans (BRO, WEB, visible in jar).
8. **Usable claims:** as for Chana Jor, plus "roasted rajma (kidney beans)".
9. **Price:** not used.
10. **Link:** dietaryguide.in/products.
11. **Audience / occasion:** savoury snackers who want something new; chai time.
12. **Best angle:** surprise. Rajma, which India knows with chawal, becomes a crunchy snack.
13. **Do not use:** "high in protein/fibre/iron" (BRO/WEB, unverified), "gluten-free", testimonials, price.
14. **Sources:** PACK, CAT `products.rajma`, WEB `sp-2b`, BRO p1.

### 3. High Protein Millet Granola
1. **Name:** High Protein Millet Granola (PACK). WEB and BRO use "High-Protein Millet Granola".
2. **Category / use:** breakfast cereal / snack. Over dahi, with milk, straight from the box (CAT `uses`).
3. **Packaging:** cream kraft carton, serif "HIGH PROTEIN MILLET GRANOLA", red "21g Protein / Serving", green band "NO ADDED SUGAR | NUTRI DENSE | CLEAN LABEL", granola-bowl illustration, Net Weight 100gm (PACK).
4. **Photos:** packshot `dg-ads/WhatsApp Image 2026-03-01 at 12.14.15 AM-Photoroom.png` (494×684, transparent). Real photos `324t32t4erwt.jpeg`, `wertwertwertewrtewtr.jpeg`, `wertwrtwt23.jpeg`. Brand scenes `ChatGPT Image Mar 6 01_35_55…01_37_11`.
5. **Ingredients:** **conflicting.** BRO and WEB `products.ts` say jowar, bajra, ragi. WEB `store-products.ts` says foxtail millet, oats, pea protein… Not used.
6. **Nutrition:** "21g Protein / Serving" (PACK). Serving size is **not printed** on the front. WEB says 50g, unverified.
7. **Verified features:** 21g protein per serving, No Added Sugar, Nutri Dense, Clean Label, 100gm (PACK). Millet-based (name).
8. **Usable claims:** exactly the pack wording: "21g Protein / Serving", "No Added Sugar", "Nutri Dense", "Clean Label".
9. **Price:** not used.
10. **Link:** dietaryguide.in/products.
11. **Audience / occasion:** breakfast, the 4 PM slump (CAT `moment`).
12. **Best angle:** an elevated desi breakfast, "Subah, sorted."
13. **Do not use:** specific millets, "naturally sweetened", "preservative free", "keeps you full", weight-loss framing, iron/magnesium, testimonials, price.
14. **Sources:** PACK, CAT `products.granola`, WEB `sp-1`, BRO p1.

### 4. Mixed Seed Protein Bar
1. **Name:** Mixed Seed Protein Bar (WEB, BRO). CAT says "Mixed Seeds Protein Bar". The pack reads "PROTEIN BAR · 10g PLANT PROTEIN · Mixed Seeds".
2. **Category / use:** on-the-go protein bar. Desk, travel, pre/post workout (CAT).
3. **Packaging:** kraft carton and flow-wrap, DG logo, serif "PROTEIN BAR", **dark-brown** brush stripe "10g PLANT PROTEIN", "Mixed Seeds", chocolatey seed-bar stack with leaves, ticks "NO ADDED SUGAR · VEGAN · CLEAN LABEL", Net Weight 40g (PACK, brochure image).
4. **Photos:** `dg-ads/, 2026, 08_29_33 PM.png` (1536×1024 carton render, white bg). **Defect:** in this render the net-weight line is garbled ("Net Weigi Seeds"). The brochure photo of the same carton reads "Net Weight: 40g". The real carton appears in the box photos.
5. **Ingredients:** **conflicting.** WEB lists honey and says "not strictly vegan", but the PACK says **VEGAN**. BRO says pumpkin, sunflower, flax. Not used beyond "mixed seeds".
6. **Nutrition:** 10g plant protein per 40g bar (PACK + CAT `stat_unit`). WEB says a 35g bar, which contradicts the pack.
7. **Verified features:** 10g Plant Protein, No Added Sugar, Vegan, Clean Label, 40g (PACK).
8. **Usable claims:** those five.
9. **Price:** not used (WEB ₹55, unverified).
10. **Link:** dietaryguide.in/products.
11. **Audience / occasion:** desk workers, the 3 PM slump, travel, gym bag (CAT).
12. **Best angle:** the 3 PM energy dip, handled with a clean bar.
13. **Do not use:** omega-3, "sustained energy" as a health claim, specific seed list, honey, sugar grams, testimonials, price.
14. **Sources:** PACK, CAT `products.seeds`, WEB `sp-5`, BRO p2.

### 5. Almond Protein Bar
1. **Name:** Almond Protein Bar (CAT, WEB, BRO). The pack reads "PROTEIN BAR · 10g PLANT PROTEIN · Almond".
2. **Category / use:** on-the-go protein bar. Pre/post workout, travel, meetings (CAT).
3. **Packaging:** same carton system, with a **red-orange** brush stripe "10g PLANT PROTEIN", "Almond", bar stack with almonds. Ticks NO ADDED SUGAR · VEGAN · CLEAN LABEL. Net Weight: 40g (PACK).
4. **Photos:** `dg-ads/08_34_57 PM.png` (1536×1024 carton render, white bg, text clean). Brochure scene `im-008.png` shows cartons, wrappers and bars.
5. **Ingredients:** not verified (WEB lists honey, which conflicts with Vegan; BRO says California almonds).
6. **Nutrition:** 10g plant protein per 40g bar (PACK, CAT). WEB says 10.5g in 35g, which conflicts.
7. **Verified features:** 10g Plant Protein, No Added Sugar, Vegan, Clean Label, 40g, contains almonds (name, art).
8. **Usable claims:** those.
9. **Price:** not used.
10. **Link:** dietaryguide.in/products.
11. **Audience / occasion:** gym bag, training days, travel.
12. **Best angle:** real almonds, a refined, premium snack moment.
13. **Do not use:** "California almonds", vitamin E, muscle recovery, honey, testimonials, price.
14. **Sources:** PACK, CAT `products.almond`, WEB `sp-6`, BRO p2.

### 6. Digestion Tea
1. **Name:** Digestion Tea (PACK, CAT, WEB, BRO).
2. **Category / use:** tea bags for after meals and the evening wind-down (CAT `uses`).
3. **Packaging:** cream carton, serif "DIGESTION TEA", "Immunity Booster", a 6-tick claims list, illustration of a cup of light green tea with leaves, "7 TEA BAGS · NET QUANTITY: 9g" (PACK).
4. **Photos:** packshot `dg-ads/diegetiontea.png` (614×819, transparent). Real photos `ewrtewrtertewrterw.jpeg`, `wertwertwertew.jpeg`, box-content photos. Brochure scene `im-009.png`.
5. **Ingredients:** **conflicting, three ways.** BRO: "fennel, ajwain, and ginger" and also "Fennel and Ginger". WEB: fennel, ginger, peppermint, licorice, coriander, cardamom, tulsi. The PACK illustration shows green tea. **None used.**
6. **Nutrition:** none relevant.
7. **Pack claims (printed):** Immunity Booster · Supports healthy metabolism · Helps maintain metabolic balance · Aids in weight management* · Supports digestive wellness · Light and gentle on the system · Promotes gut health · 7 tea bags · 9g.
8. **Usable in ads:** "7 tea bags", "Light and gentle on the system" (printed, non-medical), "the perfect post-meal ritual" (BRO heading). The tea is positioned as a ritual, not a remedy.
9. **Price:** not used.
10. **Link:** dietaryguide.in/products.
11. **Audience / occasion:** after a heavy dinner, evening wind-down.
12. **Best angle:** a calm, premium post-meal ritual.
13. **Do not use:** immunity, metabolism, weight management, "eases bloating", "caffeine-free" (conflicts with the green-tea art), any ingredient names, "7-day reset" (CAT copy, unsupported), testimonials, price.
14. **Sources:** PACK, CAT `products.tea`, WEB `sp-4`, BRO p2.

### 7. The Wellness Treat (gift box)
1. **Name:** The Wellness Treat. Box print: "DIETARY GUIDE'S THE WELLNESS TREAT". Lid print: "DG | THE WELLNESS TREAT" (PACK). WEB subtitle: "Premium Diet Snack Gift Box".
2. **Category / use:** curated gift box. Gifting, festive and corporate hampers (CAT, captions).
3. **Packaging:** **chocolate-brown and cream** sleeve with a flowing gold-line curve, "THE WELLNESS TREAT" in cream, tagline "HIGH PROTEIN · SMART NUTRITION · ENERGIZING". The inner box is white, with "DG | THE WELLNESS TREAT" printed in brown on the lid (PACK, real photos `re.jpeg`, `wertewrt.jpeg`, `234t34t.jpeg`).
4. **Photos:** packshot `dg-ads/324t32t4erwt-removebg-preview.png` (758×589, transparent front). **Real opened box** `dgwebsiteimg/234t34t.jpeg` (899×1599, vertical) and `ewrt34t32tafafdq3.jpeg` (1599×899, top-down). Brand scenes `ChatGPT Image Mar 6 01_07_12` (lid box, gold surface), `01_07_19`, `01_07_21` (candles), `01_06_57`.
5. **Contents, verified from the real photos and consistent with WEB:** Digestion Tea · High Protein Millet Granola · Roasted Chana Jor Masala (140g) · a second Jor jar (label facing away; contents look like roasted rajma, unconfirmed) · two Protein Bar cartons (one is Mixed Seeds, the other's flavour isn't visible) · a white **Dietary Guide branded tee/pouch**. WEB lists "Granola, Chana Jor, Plant-Protein Bars, Digestion Tea, Branded Pouch / Tee". BRO says every box comes with a "Complimentary Surprise Gift… from limited edition branded merchandise to fitness accessories".
6. **Nutrition:** n/a (WEB's per-100g box values are meaningless for a mixed box and are not used).
7. **Verified features:** High Protein · Smart Nutrition · Energizing (box print). A curated collection of the brand's functional snacks (BRO). Includes the items above (photos).
8. **Usable claims:** box tagline, "a curated collection of our finest functional snacks" (BRO), the photographed contents, and that a branded surprise is included (photo + WEB + BRO). The video says "a little surprise", not a specific item.
9. **Price / offer:** WEB shows ₹999 (MRP ₹1,499) and free shipping above ₹999. **Not confirmed current, so not used.**
10. **Link:** dietaryguide.in/products (BRO, printed on the brochure).
11. **Audience / occasion:** Raksha Bandhan, Diwali and festive gifting, corporate gifting, self-care (CAT `seasonal_hooks`, captions).
12. **Best angle:** a thoughtful gift that's genuinely good. The brochure line "Health, Happiness, and a Little Surprise!" is the brand's own.
13. **Do not use:** "suitable for diabetics" (WEB FAQ, a medical claim), ratings/reviews (4.9★, 128 reviews, top review), price, rajma as a confirmed content item, a specific surprise item.
14. **Sources:** PACK + real photos, CAT `products.treat`, WEB `wt-1`, BRO p1–p2.

---

## Claims that apply across the range (do not use)
- **Testimonials:** CAT `quote`/`attrib` ("— Meera, Delhi" etc.) and WEB `topReview`, `rating`, `reviewCount` cannot be traced to real customers. Never shown.
- **Medical / weight claims:** no cure, detox, immunity, bloating, weight-management or diabetes claims, even where printed or listed. The brand's own content rules say "Never claim cure/diagnosis/detox".
- **Prices and offers:** none shown (unverified, and the live site is unreachable).

## Brand system (verified)
- Logo: `dg-ads/logo_transparet_dark.png` (dark teal wordmark), `logo_transparent_white.png` (light), `logo.jpg` (pink on dark).
- Packaging family: kraft/cream base, the multi-colour food-mosaic "DG" monogram, serif product names, green veg mark.
- Campaign palette (brief): teal #173A3E, leaf #16A34A, deep green #15803D, haldi gold #D99A2B, off-white #FAF8F5, ink #0F172A. Product films let each pack's own colours lead (Chana orange, Rajma maroon, Granola cream/red/green, Seeds dark brown, Almond red-orange, Tea cream/green, Treat chocolate/cream/gold).
- Handle and site: `@dietaryguide.in`, `dietaryguide.in` (CAT prompts, BRO).
