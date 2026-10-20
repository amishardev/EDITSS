# Dietary Guide · Food Fact series (30 videos)

Thirty 9:16 explainers (1080x1920, 30 fps), about 30 seconds each, with a female Hinglish voiceover, burned-in captions, and an end card for the Dietary Guide app. Every number on screen is listed with its source below. Where a claim rests on a small study, the video says so. Medical-adjacent topics carry "not medical advice" and point to a doctor.

**Voice.** Rendered with Kokoro-82M (open source, Apache-2.0, Hindi female voice `hf_alpha`), because ElevenLabs refused free-tier generation on this account ("Free Tier access has been disabled... upgrade to a paid subscription"). The planned ElevenLabs voice is "Ritu Rathore - Natural Conversational" (voice id fTfuemKGBjYqG4ni4gw3). All 30 scripts total ~10,800 characters, about 5,400 credits on Flash v2.5 or 10,800 on Multilingual v2/v3, which fits the Starter plan (30k credits, commercial licence). To swap: save each segment as `public/edu/vo/<slug>/<i>.wav`, run `python3 -I scripts/edu_tts.py - --timings-only`, then re-render. Scenes re-time themselves to the new voice.

Render: `bash scripts/render_edu.sh` (all) or `bash scripts/render_edu.sh protein-kitna` (one). Scripts live in `scripts/edu_topics.py`; voice in `scripts/edu_tts.py`.

| No. | Video | Length | Hook |
|---|---|---|---|
| 01 | `out/edu/edu-01-protein-kitna.mp4` | 32s | Roz kitna protein chahiye? Zyaadatar log galat guess karte hain. |
| 02 | `out/edu/edu-02-chai-khane-ke-saath.mp4` | 32s | Khaane ke saath chai? Ek minute rukiye. |
| 03 | `out/edu/edu-03-sugar-free-label.mp4` | 26s | Sugar-free likha hai, toh healthy? Zaroori nahi. |
| 04 | `out/edu/edu-04-namak-8-gram.mp4` | 29s | Roz kitna namak? Average Indian: lagbhag 8 gram. |
| 05 | `out/edu/edu-05-intermittent-fasting.mp4` | 34s | Intermittent fasting = jaadu? 12 mahine ki research ne kuch aur bataya. |
| 06 | `out/edu/edu-06-brown-bread.mp4` | 29s | Brown bread = healthy? Pehla ingredient dekho. |
| 07 | `out/edu/edu-07-neend-aur-cravings.mp4` | 37s | Neend kam, aur cravings zyaada? Ittefaq nahi bhi ho sakta. |
| 08 | `out/edu/edu-08-icmr-plate.mp4` | 32s | ICMR ke hisaab se din bhar ki plate kaisi? |
| 09 | `out/edu/edu-09-cheeni-6-chammach.mp4` | 30s | Teen cup chai, aur din ka sugar quota khatam? |
| 10 | `out/edu/edu-10-protein-bar-label.mp4` | 30s | Protein bar, protein chips, har jagah. Par har packet healthy nahi. |
| 11 | `out/edu/edu-11-gud-vs-cheeni.mp4` | 26s | Gud healthy, cheeni unhealthy? Calories dekh ke chaunk jaoge. |
| 12 | `out/edu/edu-12-diwali-mithai.mp4` | 32s | Diwali aa rahi hai, mithai bhi. Guilt nahi, smart plan. |
| 13 | `out/edu/edu-13-tel-baar-baar.mp4` | 29s | Pakode wala tel, baar-baar? Ye zaroor jaano. |
| 14 | `out/edu/edu-14-walk-after-meal.mp4` | 27s | Khaane ke baad sirf 2-5 minute. Bas itna. |
| 15 | `out/edu/edu-15-real-fruit-juice.mp4` | 32s | 'Real fruit juice' likha hai? Andar asli phal kitna? |
| 16 | `out/edu/edu-16-nimbu-shahad-detox.mp4` | 31s | Garam paani + nimbu + shahad = fat burn? Suno sach. |
| 17 | `out/edu/edu-17-calorie-balance.mp4` | 36s | Weight loss ka sabse basic rule. |
| 18 | `out/edu/edu-18-ultra-processed.mp4` | 37s | Ultra-processed food kya hota hai? Itni baat kyun? |
| 19 | `out/edu/edu-19-protein-powder.mp4` | 34s | Gym jaate ho toh protein powder zaroori? ICMR ne kya kaha? |
| 20 | `out/edu/edu-20-dal-chawal-combo.mp4` | 31s | Dal-chawal sirf comfort food nahi, smart protein combo hai. |
| 21 | `out/edu/edu-21-food-order.mp4` | 29s | Wahi khaana, bas order badlo. Pehle sabzi, phir roti. |
| 22 | `out/edu/edu-22-gut-dahi.mp4` | 27s | Gut health trend everywhere. Ghar ka dahi kitna kaam ka? |
| 23 | `out/edu/edu-23-iron-vitamin-c.mp4` | 28s | Palak, dal sab kha rahe ho, phir bhi iron kam? Ye trick miss ho rahi hai. |
| 24 | `out/edu/edu-24-veg-protein.mp4` | 31s | Veg ho aur protein ki tension? Ye desi sources dekho. |
| 25 | `out/edu/edu-25-label-trick.mp4` | 27s | Kisi bhi packet ka sach, 10 second mein. |
| 26 | `out/edu/edu-26-b12-vegetarian.mp4` | 31s | Vegetarian ho? Vitamin B12 pe dhyaan zaroori. |
| 27 | `out/edu/edu-27-ragi-calcium.mp4` | 27s | Calcium matlab sirf doodh? Ragi se miliye. |
| 28 | `out/edu/edu-28-fibre.mp4` | 27s | Pet jaldi khaali lagta hai? Shaayad fibre kam hai. |
| 29 | `out/edu/edu-29-paani-kitna.mp4` | 31s | 8 glass paani ka rule: sach ya myth? |
| 30 | `out/edu/edu-30-56-percent.mp4` | 29s | India mein aadhe se zyaada disease burden, khaane se juda. |

## 01 · Roz kitna protein chahiye?

**Voiceover (Hindi/Hinglish)**

1. आपको रोज़ कितना प्रोटीन चाहिए? ज़्यादातर लोग इसका अंदाज़ा गलत लगाते हैं।
2. आई सी एम आर के हिसाब से, एक स्वस्थ वयस्क को हर किलो वज़न पर लगभग ज़ीरो पॉइंट एट थ्री ग्राम प्रोटीन चाहिए।
3. यानी साठ किलो के इंसान को रोज़ करीब पचास ग्राम प्रोटीन।
4. इसे हर मील में बाँट दीजिए। दाल, दही, पनीर, चना, या अंडा, हर प्लेट में थोड़ा प्रोटीन।
5. आपकी प्लेट में कितना प्रोटीन है? डाइटरी गाइड पर बस एक फोटो लीजिए।

**Sources**

- ICMR-NIN (2020) Nutrient Requirements for Indians: protein RDA 0.83 g/kg/day for healthy adults

Caption and posting date: see `CAPTIONS.md` (Food Fact No.01).

## 02 · Khaane ke saath chai?

**Voiceover (Hindi/Hinglish)**

1. खाने के साथ चाय पीते हैं? एक मिनट रुकिए।
2. चाय और कॉफ़ी में टैनिन होते हैं, जो खाने से मिलने वाले आयरन का अवशोषण कम कर सकते हैं।
3. इसलिए आई सी एम आर की सलाह है: खाने से एक घंटा पहले, और एक घंटा बाद तक, चाय कॉफ़ी से बचिए।
4. ये ज़रूरी है, क्योंकि भारत में पंद्रह से उनचास साल की सत्तावन प्रतिशत महिलाओं में खून की कमी पाई गई।
5. आयरन से जुड़ा सवाल है? डाइटरी गाइड पर आइरा से पूछिए।

**Sources**

- ICMR-NIN Dietary Guidelines for Indians, 2024: avoid tea/coffee 1 hour before and after meals (tannins reduce iron absorption)
- NFHS-5 (2019-21): 57.0% of women aged 15-49 anaemic

Caption and posting date: see `CAPTIONS.md` (Food Fact No.02).

## 03 · 'Sugar-free' = healthy?

**Voiceover (Hindi/Hinglish)**

1. शुगर फ़्री लिखा है, तो हेल्दी है? ज़रूरी नहीं।
2. आई सी एम आर चेतावनी देता है: ऐसे प्रोडक्ट में फैट, मैदा, स्टार्च, और छुपी हुई मिठास हो सकती है।
3. माल्टिटॉल, फ्रुक्टोज़, कॉर्न सिरप, मोलासेस, ये सब भी मिठास देने वाली चीज़ें हैं।
4. इसलिए नाम नहीं, इंग्रीडिएंट लिस्ट पढ़िए।
5. लेबल समझना मुश्किल लगे, तो डाइटरी गाइड पर स्कैन कीजिए।

**Sources**

- ICMR-NIN Dietary Guidelines for Indians, 2024: 'sugar-free' foods may contain fats, refined flour, starch and hidden sugars (maltitol, fructose, corn syrup, molasses)

Caption and posting date: see `CAPTIONS.md` (Food Fact No.03).

## 04 · Roz kitna namak?

**Voiceover (Hindi/Hinglish)**

1. आप रोज़ कितना नमक खाते हैं? औसत भारतीय, लगभग आठ ग्राम।
2. जबकि डब्ल्यू एच ओ कहता है, पाँच ग्राम से कम। यानी एक छोटी चम्मच से भी कम।
3. ज़्यादा नमक छुपा होता है: अचार, पापड़, नमकीन, और पैकेट वाले खाने में।
4. छोटा सा बदलाव: खाने पर ऊपर से नमक डालना बंद कीजिए, और लेबल पर सोडियम देखिए।
5. पैकेट में कितना सोडियम है? डाइटरी गाइड से लेबल स्कैन कीजिए।

**Sources**

- Scientific Reports 2023 (ICMR-NCDIR, National NCD Monitoring Survey): mean salt intake 8.0 g/day
- WHO: adults < 5 g salt/day

Caption and posting date: see `CAPTIONS.md` (Food Fact No.04).

## 05 · Intermittent fasting: jaadu?

**Voiceover (Hindi/Hinglish)**

1. इंटरमिटेंट फ़ास्टिंग, वज़न घटाने का जादू? बारह महीने की एक रिसर्च ने कुछ और बताया।
2. इस स्टडी में दोनों ग्रुप्स ने कैलोरी कम की। एक ग्रुप ने सिर्फ़ आठ घंटे की विंडो में खाया।
3. फ़र्क साफ़ नहीं निकला। असली असर कुल कैलोरी और निरंतरता का था।
4. तो वही तरीका चुनिए जो आप लंबे समय तक निभा सकें। डायबिटीज़ हो या कोई दवा चल रही हो, तो पहले डॉक्टर से बात कीजिए।
5. अपनी कैलोरी का अंदाज़ा चाहिए? डाइटरी गाइड पर अपनी मील्स स्कैन कीजिए।

**Sources**

- Liu D et al., NEJM 2022 (TREATY): time-restricted eating + calorie restriction vs calorie restriction alone, 8.0 vs 6.3 kg at 12 months, difference not significant

Caption and posting date: see `CAPTIONS.md` (Food Fact No.05).

## 06 · Brown bread ka sach

**Voiceover (Hindi/Hinglish)**

1. ब्राउन ब्रेड, मतलब हेल्दी ब्रेड? पहला इंग्रीडिएंट देखिए।
2. लेबल पर इंग्रीडिएंट्स मात्रा के हिसाब से लिखे जाते हैं, सबसे ज़्यादा वाला सबसे पहले।
3. अगर पहला शब्द व्हीट फ़्लोर या मैदा है, तो वह रिफ़ाइंड आटा हो सकता है। भूरा रंग कैरेमल से भी आ सकता है।
4. सही पहचान: सबसे ऊपर होल व्हीट, यानी आटा लिखा हो।
5. ब्रेड हो या बिस्किट, डाइटरी गाइड से लेबल स्कैन करके सच जानिए।

**Sources**

- FSSAI Labelling & Display Regulations 2020: ingredients listed in descending order of weight
- ICMR-NIN Dietary Guidelines for Indians, 2024: 'made with whole grain' claims can mislead

Caption and posting date: see `CAPTIONS.md` (Food Fact No.06).

## 07 · Neend kam, bhookh zyaada?

**Voiceover (Hindi/Hinglish)**

1. रात को नींद कम, और अगले दिन मीठा नमकीन खाने का मन? ये इत्तेफ़ाक़ नहीं भी हो सकता।
2. दो हज़ार चार की एक छोटी स्टडी में, दो रात सिर्फ़ चार घंटे सोने पर, भूख वाला हार्मोन घ्रेलिन अट्ठाईस प्रतिशत बढ़ा।
3. और पेट भरने का सिग्नल देने वाला लेप्टिन अठारह प्रतिशत घटा। भूख चौबीस प्रतिशत बढ़ गई।
4. रोज़ एक ही समय पर सोइए, सात घंटे या उससे ज़्यादा का लक्ष्य रखिए, और शाम के बाद कैफ़ीन कम।
5. नींद और खाने का पूरा पैटर्न समझना है? डाइटरी गाइड पर अपने मेट्रिक्स देखिए।

**Sources**

- Spiegel K et al., Annals of Internal Medicine 2004: 2 nights of 4 h sleep, leptin -18%, ghrelin +28%, hunger +24% (small study; replication mixed)
- AASM/SRS consensus: adults 7+ hours sleep

Caption and posting date: see `CAPTIONS.md` (Food Fact No.07).

## 08 · ICMR ki ideal plate

**Voiceover (Hindi/Hinglish)**

1. आई सी एम आर के हिसाब से, दिन भर की प्लेट कैसी दिखनी चाहिए?
2. लगभग दो हज़ार कैलोरी के लिए: चार सौ ग्राम सब्ज़ियाँ, सौ ग्राम फल, और तीन सौ मिलीलीटर दूध या दही।
3. यानी प्लेट में सबसे ज़्यादा जगह सब्ज़ियों और फलों की, अनाज सीमित, और दाल या प्रोटीन ज़रूर।
4. और रोज़ लगभग तीस ग्राम नट्स या बीज, और तेल सत्ताईस ग्राम के आसपास।
5. आपकी प्लेट इस आदर्श प्लेट के कितना करीब है? डाइटरी गाइड पर स्कैन करके देखिए।

**Sources**

- ICMR-NIN My Plate for the Day (~2000 kcal): vegetables 400 g, fruits 100 g, milk/curd 300 ml, nuts & seeds 30 g, fats & oils 27 g; cereals 250-270 g; pulses/eggs/meat ~90 g

Caption and posting date: see `CAPTIONS.md` (Food Fact No.08).

## 09 · 3 cup chai = din ki cheeni?

**Voiceover (Hindi/Hinglish)**

1. तीन कप चाय, और दिन का पूरा शुगर कोटा खत्म?
2. डब्ल्यू एच ओ कहता है, फ़्री शुगर दस प्रतिशत से कम रखिए, और बेहतर हो तो पाँच प्रतिशत, यानी लगभग छह चम्मच।
3. अगर हर कप में दो चम्मच चीनी है, तो तीन कप में ही छह चम्मच हो गई।
4. धीरे-धीरे घटाइए: पहले डेढ़ चम्मच, फिर एक। और बिस्किट, जूस में छुपी चीनी भी गिनिए।
5. अपना रोज़ का खाना डाइटरी गाइड पर ट्रैक कीजिए, और फ़र्क खुद देखिए।

**Sources**

- WHO Guideline: Sugars intake for adults and children (2015): free sugars < 10% of energy, ideally < 5% (about 25 g, 6 teaspoons)

Caption and posting date: see `CAPTIONS.md` (Food Fact No.09).

## 10 · 'High protein' likha hai, toh?

**Voiceover (Hindi/Hinglish)**

1. प्रोटीन बार, प्रोटीन चिप्स, हर जगह हैं। पर हर प्रोटीन वाला पैकेट हेल्दी नहीं होता।
2. लेबल पर तीन चीज़ें देखिए: प्रति सर्विंग कितना प्रोटीन, कितनी शुगर, और पहले इंग्रीडिएंट्स क्या हैं।
3. अगर चीनी और फ़ैट ज़्यादा हैं, तो वह एक कैंडी बार जैसा भी हो सकता है।
4. और याद रखिए, ज़्यादातर प्रोटीन, असली खाने से आ सकता है।
5. कोई भी बार खरीदने से पहले, डाइटरी गाइड से उसका लेबल स्कैन कीजिए।

**Sources**

- Google Trends India 2025: protein bar / protein chips searches at 5-year highs (as reported)
- ICMR-NIN Dietary Guidelines for Indians, 2024: protein from food first; read labels

Caption and posting date: see `CAPTIONS.md` (Food Fact No.10).

## 11 · Gud vs cheeni

**Voiceover (Hindi/Hinglish)**

1. गुड़ हेल्दी, चीनी अनहेल्दी? कैलोरी देखेंगे तो चौंक जाएँगे।
2. सौ ग्राम गुड़ में लगभग तीन सौ अस्सी कैलोरी, और चीनी में भी लगभग उतनी ही।
3. गुड़ में थोड़े मिनरल्स ज़रूर होते हैं, पर एक चम्मच में बहुत कम। शरीर के लिए वह भी शुगर ही है।
4. तो गुड़ हो या चीनी, मात्रा ही असली बात है।
5. अपने दिन की मिठास का हिसाब, डाइटरी गाइड पर रखिए।

**Sources**

- Indian food composition values (per 100 g): jaggery ~383 kcal, sugar ~387 kcal (approx.)
- WHO (2015) free sugars

Caption and posting date: see `CAPTIONS.md` (Food Fact No.11).

## 12 · Diwali mithai, smart plan

**Voiceover (Hindi/Hinglish)**

1. दिवाली आ रही है, मिठाई भी आएगी। गिल्ट नहीं, स्मार्ट प्लान।
2. छोटा पीस चुनिए, आराम से स्वाद लेकर खाइए, और खाली पेट नहीं, खाने के बाद।
3. मिठाई के बाद दो से पाँच मिनट की वॉक। रिसर्च कहती है, हल्की वॉक खाने के बाद शुगर संभालने में मदद करती है।
4. और याद रखिए, डब्ल्यू एच ओ के हिसाब से, पूरे दिन की फ़्री शुगर लगभग छह चम्मच तक बेहतर।
5. त्योहार में भी अपना हिसाब रखिए, डाइटरी गाइड के साथ। हैप्पी दिवाली!

**Sources**

- WHO (2015) free sugars < 5% energy (about 25 g)
- Buffey AJ et al., Sports Medicine 2022

Caption and posting date: see `CAPTIONS.md` (Food Fact No.12).

## 13 · Wahi tel, baar baar?

**Voiceover (Hindi/Hinglish)**

1. पकोड़े वाला तेल, बार-बार इस्तेमाल? ये ज़रूर जानिए।
2. तेल को बार-बार गरम करने से उसमें पोलर कंपाउंड्स बढ़ते जाते हैं।
3. एफ़ एस एस ए आई का नियम है: जब ये पच्चीस प्रतिशत तक पहुँचें, तो तेल फेंक देना चाहिए।
4. घर पर पहचान: तेल काला हो जाए, झाग आए, या धुआँ जल्दी उठे, तो बदल दीजिए।
5. तली हुई चीज़ें कितनी बार खा रहे हैं? डाइटरी गाइड पर अपनी मील्स ट्रैक कीजिए।

**Sources**

- FSSAI: vegetable oil not to be used once Total Polar Compounds exceed 25%; RUCO guidance note (discard on darkening, foaming, smoke)

Caption and posting date: see `CAPTIONS.md` (Food Fact No.13).

## 14 · Khaane ke baad 2-5 minute

**Voiceover (Hindi/Hinglish)**

1. खाने के बाद सिर्फ़ दो से पाँच मिनट। बस इतना सा काम।
2. साल दो हज़ार बाईस की एक रिसर्च में पाया गया कि बैठे रहने के मुकाबले, हल्की वॉक से खाने के बाद शुगर कम बढ़ी।
3. खाना खाइए, फिर दो से पाँच मिनट टहल लीजिए, घर में ही सही।
4. लंच के बाद, डिनर के बाद, या लंबे समय बैठने के बीच में।
5. ऐसी छोटी आदतों की स्ट्रीक बनाइए, डाइटरी गाइड के साथ।

**Sources**

- Buffey AJ et al., Sports Medicine 2022: light walking after eating reduced post-meal glucose vs sitting

Caption and posting date: see `CAPTIONS.md` (Food Fact No.14).

## 15 · 'Real fruit juice' ka sach

**Voiceover (Hindi/Hinglish)**

1. पैकेट पर लिखा है रियल फ्रूट जूस? पर अंदर असली फल कितना है?
2. आई सी एम आर के मुताबिक, नियमों के तहत सिर्फ़ दस प्रतिशत फल वाला प्रोडक्ट भी रियल फ्रूट का दावा कर सकता है।
3. बाकी में चीनी और दूसरी चीज़ें हो सकती हैं। और डब्ल्यू एच ओ, जूस की शुगर को भी फ़्री शुगर गिनता है।
4. इसलिए जूस की जगह पूरा फल खाइए, जिसमें फाइबर भी मिलता है।
5. अगली बार खरीदने से पहले, डाइटरी गाइड से लेबल स्कैन कर लीजिए।

**Sources**

- ICMR-NIN Dietary Guidelines for Indians, 2024: 'real fruit' claims allowed with as little as 10% fruit pulp
- WHO (2015): free sugars include sugars in fruit juices

Caption and posting date: see `CAPTIONS.md` (Food Fact No.15).

## 16 · Nimbu + shahad = fat burn?

**Voiceover (Hindi/Hinglish)**

1. सुबह गरम पानी, नींबू और शहद, और फ़ैट बर्न? सुनिए सच।
2. ऐसा कोई पक्का सबूत नहीं कि ये ड्रिंक फ़ैट जलाती है। उल्टा, शहद में शुगर होती है, जिसे डब्ल्यू एच ओ फ़्री शुगर गिनता है।
3. और डिटॉक्स? वो काम आपका लिवर और किडनी हर दिन करते हैं।
4. पानी पीना अच्छा है, नींबू भी ठीक। बस इसे जादू मत समझिए, कुल खाना और एक्टिविटी मायने रखते हैं।
5. फ़िटनेस के मिथ्स पर सवाल? डाइटरी गाइड पर आइरा से पूछिए।

**Sources**

- WHO (2015): honey counts as free sugar
- No good evidence that lemon-honey water burns fat; detoxification is done by liver and kidneys

Caption and posting date: see `CAPTIONS.md` (Food Fact No.16).

## 17 · Weight loss ka basic rule

**Voiceover (Hindi/Hinglish)**

1. वज़न घटाने का सबसे बेसिक नियम, जिसे लोग सबसे ज़्यादा भूलते हैं।
2. जितनी कैलोरी शरीर खर्च करता है, उससे थोड़ी कम खाइए। यही कैलोरी डेफ़िसिट है।
3. मोटे तौर पर, एक किलो फ़ैट लगभग सात हज़ार सात सौ कैलोरी के बराबर माना जाता है। पर ये सिर्फ़ एक मोटा अंदाज़ा है।
4. बहुत ज़्यादा कमी लंबे समय तक नहीं टिकती। छोटा, टिकाऊ डेफ़िसिट, अच्छा प्रोटीन, और रोज़ की एक्टिविटी।
5. आपका कैलोरी टारगेट क्या होना चाहिए? डाइटरी गाइड आपके लिए कैलकुलेट करता है।

**Sources**

- Energy balance; ~7700 kcal per kg fat is a common approximation (Wishnofsky 1958) with known limits (Hall KD 2008)

Caption and posting date: see `CAPTIONS.md` (Food Fact No.17).

## 18 · Ultra-processed food kya hai?

**Voiceover (Hindi/Hinglish)**

1. अल्ट्रा प्रोसेस्ड फ़ूड, आख़िर होता क्या है? और इसकी इतनी बात क्यों हो रही है?
2. ऐसा पैकेट वाला खाना, जिसमें घर की रसोई में न मिलने वाली चीज़ें होती हैं, जैसे फ़्लेवर, कलर, इमल्सीफ़ायर।
3. दो हज़ार चौबीस की बी एम जे की एक बड़ी समीक्षा में, लगभग एक करोड़ लोगों के डेटा में, इन्हें बत्तीस हेल्थ प्रॉब्लम्स से जुड़ा पाया गया।
4. ये जुड़ाव है, हर पैकेट ज़हर नहीं। पर रोज़ का खाना ज़्यादातर घर का, और कम प्रोसेस्ड रखिए।
5. आपका खाना कितना प्रोसेस्ड है? डाइटरी गाइड से लेबल स्कैन करके देखिए।

**Sources**

- Lane MM et al., BMJ 2024;384:e077310: umbrella review, ~10 million participants, direct associations with 32 health parameters

Caption and posting date: see `CAPTIONS.md` (Food Fact No.18).

## 19 · Protein powder zaroori?

**Voiceover (Hindi/Hinglish)**

1. जिम जाते हैं, तो प्रोटीन पाउडर ज़रूरी है? आई सी एम आर ने क्या कहा, सुनिए।
2. दो हज़ार चौबीस की गाइडलाइंस में, आई सी एम आर ने मसल्स बनाने के लिए प्रोटीन सप्लीमेंट्स से बचने की सलाह दी।
3. लंबे समय तक बहुत ज़्यादा प्रोटीन पाउडर लेने के जोखिमों का भी ज़िक्र किया गया है।
4. खाने से प्रोटीन लीजिए: दाल के साथ अनाज, दूध, दही, पनीर, और अगर खाते हैं तो अंडा।
5. आपको कितना प्रोटीन चाहिए, डाइटरी गाइड आपके गोल के हिसाब से बताता है।

**Sources**

- ICMR-NIN Dietary Guidelines for Indians, 2024: discourages protein supplements for muscle building; cautions on prolonged high intake

Caption and posting date: see `CAPTIONS.md` (Food Fact No.19).

## 20 · Dal-chawal: smart combo

**Voiceover (Hindi/Hinglish)**

1. दाल चावल सिर्फ़ कम्फ़र्ट फ़ूड नहीं, ये एक स्मार्ट प्रोटीन कॉम्बो है।
2. अनाज में लाइसिन नाम का अमीनो एसिड कम होता है, और दालों में सल्फ़र वाले अमीनो एसिड।
3. साथ खाने पर दोनों एक दूसरे की कमी पूरी करते हैं, और प्रोटीन की क्वालिटी बेहतर होती है।
4. इसीलिए रोटी दाल, इडली सांभर, खिचड़ी, राजमा चावल, सब कमाल के कॉम्बो हैं।
5. अपनी थाली में कितना प्रोटीन है, डाइटरी गाइड पर एक फोटो से जानिए।

**Sources**

- Cereal-pulse amino acid complementarity: cereals limited in lysine, pulses in sulphur amino acids (e.g. Br J Nutr reviews; Han F et al., Nutrients 2021)

Caption and posting date: see `CAPTIONS.md` (Food Fact No.20).

## 21 · Pehle sabzi, phir roti

**Voiceover (Hindi/Hinglish)**

1. वही खाना, बस खाने का क्रम बदलिए। पहले सब्ज़ी, फिर रोटी।
2. पहले सब्ज़ी और प्रोटीन, और आख़िर में रोटी चावल।
3. दो हज़ार पंद्रह की एक छोटी स्टडी में, टाइप टू डायबिटीज़ वाले लोगों में, इस क्रम से खाने पर शुगर कम बढ़ी।
4. ये कोई इलाज नहीं, एक आसान आदत है। डायबिटीज़ है तो अपने डॉक्टर की सलाह मानिए।
5. अपनी हर मील का बैलेंस देखना है? डाइटरी गाइड पर एक फोटो लीजिए।

**Sources**

- Shukla AP et al., Diabetes Care 2015;38(7):e98-e99: vegetables and protein before carbohydrate lowered post-meal glucose (pilot, n=11)

Caption and posting date: see `CAPTIONS.md` (Food Fact No.21).

## 22 · Gut health aur ghar ka dahi

**Voiceover (Hindi/Hinglish)**

1. गट हेल्थ का ट्रेंड हर जगह है। पर घर का दही इसमें कितना काम का है?
2. दही, छाछ और कांजी जैसे फ़र्मेंटेड फ़ूड में ज़िंदा बैक्टीरिया होते हैं।
3. पर गट बैक्टीरिया को खाना भी चाहिए, और वो है फ़ाइबर।
4. तो दही के साथ दाल, सब्ज़ी, साबुत अनाज और फल भी रखिए। महंगे शॉट्स से पहले, ये बेसिक्स।
5. रोज़ का बैलेंस्ड खाना, डाइटरी गाइड पर ट्रैक कीजिए।

**Sources**

- Marco ML et al., Nat Rev Gastroenterol Hepatol 2021 (ISAPP consensus on fermented foods)
- Dietary fibre as substrate for gut microbiota

Caption and posting date: see `CAPTIONS.md` (Food Fact No.22).

## 23 · Iron ka secret partner

**Voiceover (Hindi/Hinglish)**

1. पालक, दाल सब खा रहे हैं, फिर भी आयरन कम? ये ट्रिक शायद मिस हो रही है।
2. पौधों वाला आयरन शरीर आसानी से नहीं सोखता। विटामिन सी इसमें मदद करता है।
3. दाल पर नींबू, पालक के साथ टमाटर, या खाने के साथ आँवला या संतरा।
4. और चाय कॉफ़ी को खाने से कम से कम एक घंटा दूर रखिए।
5. आयरन से जुड़ा सवाल है? डाइटरी गाइड पर आइरा से पूछिए।

**Sources**

- Vitamin C enhances non-heme iron absorption (e.g. Hallberg L et al., Am J Clin Nutr 1989)
- ICMR-NIN Dietary Guidelines for Indians, 2024: tea/coffee 1 hour away from meals

Caption and posting date: see `CAPTIONS.md` (Food Fact No.23).

## 24 · Veg protein, desi style

**Voiceover (Hindi/Hinglish)**

1. शाकाहारी हैं और प्रोटीन की टेंशन है? ये देसी सोर्स देखिए।
2. सौ ग्राम में: सोया चंक्स में लगभग बावन ग्राम, मूंग दाल में करीब चौबीस, और पनीर में लगभग अठारह ग्राम प्रोटीन।
3. ध्यान रहे, सूखी और पकी दाल में फ़र्क है। पकने पर पानी से वज़न बढ़ता है।
4. दिन भर में बाँटिए: नाश्ते में दही या चना, लंच में दाल, और डिनर में पनीर या सोया।
5. हर मील का प्रोटीन, डाइटरी गाइड पर एक फोटो से।

**Sources**

- Approximate protein per 100 g from Indian food composition data: soya chunks (dry) ~52 g, moong dal (dry) ~24 g, paneer ~18-19 g

Caption and posting date: see `CAPTIONS.md` (Food Fact No.24).

## 25 · Label padhne ka 10-second trick

**Voiceover (Hindi/Hinglish)**

1. किसी भी पैकेट का सच, दस सेकंड में। ये तीन चीज़ें देखिए।
2. पहला, शुरुआती तीन इंग्रीडिएंट्स। दूसरा, प्रति सौ ग्राम चीनी, नमक और फैट। तीसरा, सर्विंग साइज़, क्योंकि पूरा पैकेट एक सर्विंग नहीं होता।
3. और चीनी के दूसरे नाम भी पहचानिए: ग्लूकोज़ सिरप, डेक्सट्रोज़, इन्वर्ट शुगर, कॉर्न सिरप।
4. हर पैकेट पढ़ना मुश्किल है? डाइटरी गाइड पर लेबल स्कैन कीजिए।

**Sources**

- FSSAI Labelling & Display Regulations 2020
- WHO (2015) free sugars

Caption and posting date: see `CAPTIONS.md` (Food Fact No.25).

## 26 · Vegetarian? B12 check

**Voiceover (Hindi/Hinglish)**

1. वेजिटेरियन हैं? तो विटामिन बी ट्वेल्व पर ध्यान देना ज़रूरी है।
2. बी ट्वेल्व ज़्यादातर पशु स्रोतों से मिलता है, जैसे दूध, दही, अंडा, मछली और मीट।
3. भारतीय रिसर्च में, शाकाहारियों का बी ट्वेल्व लेवल, नॉन वेजिटेरियन्स से कम पाया गया है।
4. दूध दही रोज़ लीजिए, फ़ोर्टिफ़ाइड फ़ूड देखिए, और थकान या झुनझुनी हो तो डॉक्टर से टेस्ट करवाइए।
5. अपने खाने से जुड़े सवाल, डाइटरी गाइड पर आइरा से पूछिए।

**Sources**

- Naik S et al., Nutrition Journal 2013: lower B12 status in Indian lacto-vegetarians; milk improved status
- Down To Earth: India lacks nationwide B12 data

Caption and posting date: see `CAPTIONS.md` (Food Fact No.26).

## 27 · Calcium = sirf doodh?

**Voiceover (Hindi/Hinglish)**

1. कैल्शियम मतलब सिर्फ़ दूध? रागी से मिलिए।
2. सौ ग्राम रागी में लगभग तीन सौ चवालीस मिलीग्राम कैल्शियम होता है।
3. रागी रोटी, रागी डोसा, या रागी का दलिया। हफ़्ते में कुछ बार शामिल कीजिए।
4. साथ में थोड़ी धूप भी, क्योंकि विटामिन डी, कैल्शियम के अवशोषण में मदद करता है।
5. मिलेट्स को अपनी डाइट में ट्रैक कीजिए, डाइटरी गाइड के साथ।

**Sources**

- APEDA Millet Portal (NIN/ICMR data): finger millet calcium 344 mg/100 g

Caption and posting date: see `CAPTIONS.md` (Food Fact No.27).

## 28 · Fibre: underrated hero

**Voiceover (Hindi/Hinglish)**

1. पेट जल्दी खाली लगता है? शायद आपकी डाइट में फ़ाइबर कम है।
2. फ़ाइबर साबुत अनाज, दाल, सब्ज़ी, फल और बीजों से मिलता है।
3. ये पेट भरा महसूस करवाता है, और आँतों के अच्छे बैक्टीरिया का खाना भी है।
4. आसान स्वैप्स: मैदा की जगह आटा, जूस की जगह फल, और चावल के साथ दाल और सलाद।
5. अपने खाने का बैलेंस, डाइटरी गाइड पर देखिए।

**Sources**

- ICMR-NIN Dietary Guidelines for Indians, 2024: whole grains, pulses, vegetables and fruits as fibre sources
- Dietary fibre and gut microbiota (general nutrition science)

Caption and posting date: see `CAPTIONS.md` (Food Fact No.28).

## 29 · 8 glass paani: sach ya myth?

**Voiceover (Hindi/Hinglish)**

1. आठ गिलास पानी वाला नियम, सच या मिथ?
2. यूरोपियन फ़ूड सेफ़्टी अथॉरिटी के अनुसार, महिलाओं को लगभग दो लीटर, और पुरुषों को ढाई लीटर कुल पानी चाहिए।
3. इसमें खाने से मिलने वाला पानी भी शामिल है, लगभग बीस से तीस प्रतिशत।
4. गर्मी, पसीना, या एक्सरसाइज़ हो तो ज़्यादा पीजिए। पेशाब का रंग हल्का पीला रहना अच्छा संकेत है।
5. आपके लिए सही मात्रा क्या है? डाइटरी गाइड पर आइरा से पूछिए।

**Sources**

- EFSA (2010) Dietary Reference Values for water: adequate total water intake 2.0 L/day women, 2.5 L/day men (about 20-30% from food)

Caption and posting date: see `CAPTIONS.md` (Food Fact No.29).

## 30 · 56% bimariyon ka link

**Voiceover (Hindi/Hinglish)**

1. भारत में बीमारियों का आधे से ज़्यादा बोझ, खाने से जुड़ा है।
2. आई सी एम आर के अनुसार, कुल डिज़ीज़ बर्डन का छप्पन दशमलव चार प्रतिशत, अनहेल्दी डाइट की वजह से है।
3. शुरुआत तीन आसान बदलावों से कीजिए: सब्ज़ी और फल ज़्यादा, नमक चीनी और तला हुआ कम, और रोज़ थोड़ी एक्टिविटी।
4. परफ़ेक्ट नहीं, बस हर दिन थोड़ा बेहतर।
5. हर दिन का खाना ट्रैक कीजिए, डाइटरी गाइड के साथ।

**Sources**

- ICMR-NIN Dietary Guidelines for Indians, 2024: 56.4% of total disease burden in India due to unhealthy diets

Caption and posting date: see `CAPTIONS.md` (Food Fact No.30).
