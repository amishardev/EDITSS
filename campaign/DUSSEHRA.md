# Dussehra films

Two 9:16 festive films (1080x1920, 30 fps, H.264 + AAC, -14 LUFS) for
Vijayadashami. Everything festive is drawn in code: marigold toran, diyas,
rangoli, fireworks and a stylized paper effigy. The films use symbols only,
with no deity shown and no prices or offers. The music is original, with a
dhol, a shehnai-style reed lead and a tanpura drone, all synthesized in
`scripts/compose.py`.

| # | Composition | File | Length | Hook | CTA |
|---|---|---|---|---|---|
| D01 | `D01-DussehraApp` | `out/dussehra-01-app.mp4` | 22.0s | "Is Dussehra, 10 sar jalao." | Try Dietary Guide |
| D02 | `D02-DussehraTreat` | `out/dussehra-02-wellness-treat.mp4` | 25.0s | A match lights one diya in the dark | Gift The Wellness Treat |

```bash
npm run render:dussehra && npm run finish:dussehra && npm run qa:dussehra
```

## D01 · App · "Is Dussehra, 10 sar jalao."

The idea: everyone has a Ravan with ten heads, and each head is a food habit.
The app's real features are the arrows.

| Time | Beat | Picture | On-screen | VO (Hinglish) |
|---|---|---|---|---|
| 0.0-2.2 | HOOK | A ten-headed effigy rises against a fireworks sky | Is Dussehra, 10 sar jalao. | "Is Dussehra... das sar jalao." |
| 2.2-6.3 | DESIRE | Numbered heads, habit list | Milo apne andar ke Ravan se. 1 Late-night noodles · 2 Kal se pakka · 3 Extra cheeni · 4 Label? Kaun padhe · 5 Breakfast skip · 6 Paani kam · 7 Calorie guesswork · 8 Mood eating · 9 Bina soche snacking · 10 Fried everything | "Milo apne andar ke Ravan se. Late-night noodles, kal se pakka, extra cheeni..." |
| 6.3-7.9 | REVEAL | IRA arrives with a phone | Aur ye rahe tumhare teer. | "Aur ye rahe tumhare teer." |
| 7.9-16.1 | REASON | Real app screens, a golden arrow per feature, a head bursts into flame, the habit gets struck through | Teer 1 Label scan · Teer 2 Meal scan · Teer 3 Ask IRA · Teer 4 Streaks | "Label scan. Meal scan. IRA se pucho. Streak banao." |
| 16.1-17.7 | REASON | A volley takes the other six heads | Baaki 6? Ek saath. | "Baaki chhe? Ek saath." |
| 17.7-19.7 | CLIMAX | The whole effigy burns, fireworks | Burai par acchai ki jeet. Plate par bhi. | "Burai par acchai ki jeet. Plate par bhi." |
| 19.7-22.0 | CTA | Marigold toran, IRA celebrates, logo | शुभ विजयादशमी · Try Dietary Guide | "Shubh Vijayadashami. Try Dietary Guide." |

## D02 · The Wellness Treat · "Is Dussehra, gift karo kuch alag."

| Time | Beat | Picture | On-screen | VO |
|---|---|---|---|---|
| 0.0-2.7 | HOOK | A match strikes and one diya lights in the dark, warm glow spreads | Is Dussehra, gift karo kuch alag. | "Is Dussehra, gift karo kuch alag." |
| 2.7-6.9 | DESIRE | Toran drops, a row of diyas lights, a rangoli is drawn | Mithai ke saath, thoda care bhi. | "Mithai ke saath... thoda care bhi." |
| 6.9-11.0 | REVEAL | The real box rises onto the rangoli under marigold petals | Dietary Guide's The Wellness Treat · High Protein · Smart Nutrition · Energizing | "Dietary Guide ka The Wellness Treat." |
| 11.0-16.7 | REASON | Real opened-box photo, every item labelled | Andar? Pyaar, snack-size mein. · Digestion Tea · High Protein Millet Granola · Roasted Chana Jor Masala · Protein Bars · + a little surprise · Shown: the actual box | "Andar? Tea, granola, chana jor, protein bars, aur ek little surprise." |
| 16.7-20.7 | GIFT | IRA presents it, fireworks | Apno ke liye, is Dussehra. | "Apno ke liye." |
| 20.7-25.0 | CTA | Box, logo, diyas | शुभ विजयादशमी · Health, Happiness, and a Little Surprise. · Gift The Wellness Treat · dietaryguide.in/products | "Shubh Vijayadashami. Gift karo The Wellness Treat." |

## Notes

- **Effigy:** it's a stylized paper Ravan effigy, the kind burned at every Ramlila. It's played as fun, with each head a habit. No deity or epic character is shown.
- **Fonts:** the Devanagari line uses Poppins Devanagari, loaded from `public/fonts` like the other brand fonts.
- **Box contents:** these follow the same verified list as the product films (see `research/PRODUCT_BIBLE.md`).
- **"Mithai ke saath":** the line positions the box next to sweets, not against them.
