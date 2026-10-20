"""Food Fact series: one explainer a day, 25 Oct to 23 Nov 2026 (IST).

Episode numbers match the order here (see ORDER in scripts/edu_topics.py), so the
"Food Fact No." in each video is the day it goes out. Times avoid the promo posts
already planned for the same day (scripts/posting/promo.py) by at least 4 hours.
"""

def F(n, date, day, time, slug, title, why, caption):
    return dict(date=date, day=day, time=time, kind=f'Food Fact No.{n:02d}', film=title,
                file=f'edu/edu-{n:02d}-{slug}.mp4', why=why, caption=caption, series='food')

FOOD = [
F(1, '2026-10-25', 'Sun', '6:30 PM', 'protein-kitna', 'Roz kitna protein chahiye?',
  'Series launch. A broad topic everyone has an opinion on, in the Sunday evening scroll.',
  """Aaj se roz ek Food Fact. 30 din, 30 sach 🧡

Shuruaat sabse common sawaal se: roz kitna protein chahiye?

ICMR ke hisaab se healthy adults ko har kilo body weight par lagbhag 0.83 g protein chahiye. 60 kg ho toh karib 50 g roz.

Ek hi meal mein sab nahi. Dal, dahi, paneer, chana, anda, thoda thoda har plate mein.

Apni plate ka protein jaanna hai? Dietary Guide pe ek photo lo, link bio mein.

Source: ICMR-NIN 2020 (RDA for healthy adults)
#DietaryGuide #FoodFact #Protein #VegProtein #NutritionIndia"""),

F(2, '2026-10-26', 'Mon', '8:30 AM', 'chai-khane-ke-saath', 'Khaane ke saath chai?',
  'Breakfast time, when chai and nashta land on the same table.',
  """Nashte ke saath chai? Same, hum bhi ☕

Par chai-coffee ke tannins khaane ke iron ko absorb hone se rok sakte hain. Isliye ICMR kehta hai: khaane se 1 ghanta pehle aur 1 ghanta baad tak chai-coffee avoid karo.

Aur ye chhoti baat nahi. NFHS-5 ke mutabik 15-49 saal ki 57% mahilaon mein anaemia hai.

Chai chhodni nahi hai, bas time shift karna hai 😌

Source: ICMR-NIN Dietary Guidelines 2024, NFHS-5
#FoodFact #ChaiLovers #Iron #Anaemia #DietaryGuide"""),

F(3, '2026-10-27', 'Tue', '8:00 PM', 'sugar-free-label', "'Sugar-free' = healthy?",
  'Evening online-shopping time, when the sugar-free stuff goes into the cart.',
  """'Sugar-free' dekh ke cart mein daal diya? Ek second ruko.

ICMR ki guidelines kehti hain, sugar-free products mein bhi fat, maida, starch aur chhupi mithaas ho sakti hai. Maltitol, fructose, corn syrup, molasses: naam alag, kaam same.

Front ka claim nahi, peeche ki ingredient list padho.

Label samajh na aaye toh Dietary Guide pe scan kar lo.

Source: ICMR-NIN Dietary Guidelines 2024
#FoodFact #LabelPadho #SugarFree #HealthySnacking #DietaryGuide"""),

F(4, '2026-10-28', 'Wed', '12:30 PM', 'namak-8-gram', 'Roz kitna namak?',
  'Lunch hour, with the achaar on the side.',
  """Average Indian roz lagbhag 8 gram namak khaata hai. WHO kehta hai 5 gram se kam 🧂

Aur zyaada namak sabzi se nahi, achaar, papad, namkeen aur packet wale khaane se aata hai.

Aaj se ek kaam: khaane pe upar se namak daalna band. Bas itna.

Tumhara weak point kya hai, achaar ya namkeen? Comment mein batao 👇

Source: ICMR-NCDIR study (Scientific Reports 2023), WHO
#FoodFact #SaltIntake #HeartHealth #IndianFood #DietaryGuide"""),

F(5, '2026-10-29', 'Thu', '12:30 PM', 'intermittent-fasting', 'Intermittent fasting: jaadu?',
  'Midday, when the fasting window crowd breaks their fast.',
  """Intermittent fasting sab kar rahe hain. Par kya ye sach mein jaadu hai? ⏰

NEJM mein chhapi 12 mahine ki ek study mein dono groups ne calories kam ki. Ek group ne sirf 8 ghante ki window mein khaaya. Weight loss: 8.0 kg vs 6.3 kg, aur farak statistically significant nahi tha.

Matlab asli game total calories aur consistency ka hai. Jo tareeka lambe time tak nibha sako, wahi best.

Diabetes hai ya dawai chal rahi hai? Fasting se pehle doctor se zaroor baat karo.

Source: Liu et al., NEJM 2022
#FoodFact #IntermittentFasting #WeightLoss #CalorieDeficit #DietaryGuide"""),

F(6, '2026-10-30', 'Fri', '8:30 AM', 'brown-bread', 'Brown bread ka sach',
  'Breakfast toast time.',
  """Brown bread = healthy bread? Rang dekh ke mat lena 🍞

Label pe ingredients zyaada se kam ke order mein likhe hote hain. Pehla ingredient 'wheat flour' ya maida hai, toh woh refined ho sakta hai. Aur brown rang caramel colour se bhi aa sakta hai.

Asli pehchaan: sabse pehle whole wheat ya atta likha ho.

Agli grocery pe ek baar check karna, aur batana kya mila 👀

Source: FSSAI labelling rules, ICMR-NIN 2024
#FoodFact #BrownBread #LabelPadho #Breakfast #DietaryGuide"""),

F(7, '2026-10-31', 'Sat', '9:30 PM', 'neend-aur-cravings', 'Neend kam, bhookh zyaada?',
  'Saturday late night, exactly when people are scrolling instead of sleeping.',
  """Raat ko scroll kar rahe ho? Toh ye video tumhare liye hai 🌙

2004 ki ek chhoti study mein, sirf 2 raat 4 ghante sone se bhookh wala hormone ghrelin 28% badha, aur bhookh 24%. Sabse zyaada mann meetha aur namkeen ke liye hua.

Baad ki studies ke results mixed hain, par neend aur cravings ka connection samajhne layak hai.

Toh phone rakho aur so jao 😴 Kal milte hain.

Source: Spiegel et al., Annals of Internal Medicine 2004
#FoodFact #Sleep #Cravings #HealthyHabits #DietaryGuide"""),

F(8, '2026-11-01', 'Sun', '12:30 PM', 'icmr-plate', 'ICMR ki ideal plate',
  'Just before Sunday lunch.',
  """Sunday lunch se pehle ek sawaal: tumhari plate ICMR ki plate jaisi dikhti hai? 🍽️

~2000 kcal ke liye ICMR ka 'My Plate for the Day': 400 g sabziyan, 100 g phal, 300 ml doodh ya dahi, lagbhag 30 g nuts aur beej, aur tel sirf ~27 g.

Simple version yaad rakho: aadhi plate sabzi aur phal.

Aaj ki plate ki photo lo, Dietary Guide batayega kitni close hai.

Source: ICMR-NIN, My Plate for the Day
#FoodFact #ICMR #BalancedDiet #SundayLunch #DietaryGuide"""),

F(9, '2026-11-02', 'Mon', '8:30 AM', 'cheeni-6-chammach', '3 cup chai = din ki cheeni?',
  'The first chai of the week.',
  """Subah ki chai mein kitni chammach cheeni daali? ☕

WHO kehta hai free sugar 10% calories se kam rakho, aur behtar ho toh 5%. Matlab din bhar mein lagbhag 25 g, yaani ~6 chammach.

Ab socho: 2 chammach wali 3 cup chai = 6 chammach. Biscuit aur juice alag se.

Is hafte ka challenge: 2 ki jagah 1.5 chammach. Bas.

Source: WHO Sugars Guideline 2015
#FoodFact #SugarIntake #ChaiTime #MondayMotivation #DietaryGuide"""),

F(10, '2026-11-03', 'Tue', '8:30 PM', 'protein-bar-label', "'High protein' likha hai, toh?",
  'After-gym evening slot.',
  """'High protein' likha hai, toh healthy hai? Har baar nahi 🙃

Protein bar ya chips lene se pehle label pe 3 cheezein dekho:
1. Protein per serving
2. Kitni sugar hai
3. Pehle 3 ingredients kya hain

Sugar aur fat zyaada? Toh woh candy bar bhi ho sakta hai, bas packaging fit hai.

Kharidne se pehle Dietary Guide pe scan karo.

Source: ICMR-NIN Dietary Guidelines 2024 (food first)
#FoodFact #ProteinBar #LabelPadho #GymSnacks #DietaryGuide"""),

F(11, '2026-11-04', 'Wed', '12:30 PM', 'gud-vs-cheeni', 'Gud vs cheeni',
  'Diwali sweets shopping week. Gud wali mithai is everywhere.',
  """Mithai 'gud wali' hai toh healthy hai? Ek baar calories dekh lo 😅

100 g gud mein lagbhag 383 kcal, aur 100 g cheeni mein lagbhag 387 kcal. Farak na ke barabar.

Haan, gud mein thode minerals hote hain, par ek chammach mein bahut kam. Body ke liye dono sugar hi hain.

Gud ho ya cheeni, matra hi asli baat hai.

Source: Indian food composition data (approx.)
#FoodFact #Jaggery #Diwali #SugarMyth #DietaryGuide"""),

F(12, '2026-11-05', 'Thu', '12:30 PM', 'diwali-mithai', 'Diwali mithai, smart plan',
  'Three days before Diwali, when the mithai boxes start arriving.',
  """Diwali aa gayi, mithai ka dabba bhi 🪔 Guilt nahi, plan chahiye.

Chhota piece lo, aaram se swaad lekar khao, aur khaali pet nahi, khaane ke baad.
Phir 2-5 minute ki halki walk. Research kehti hai ye khaane ke baad sugar sambhalne mein madad karti hai.
Aur WHO ke hisaab se din bhar ki free sugar ~6 chammach tak behtar.

Tag karo us dost ko jo kaju katli ka poora dabba khatam kar deta hai 😄

Source: WHO 2015, Buffey et al. (Sports Medicine 2022)
#FoodFact #Diwali #Mithai #FestiveEating #DietaryGuide"""),

F(13, '2026-11-06', 'Fri', '12:30 PM', 'tel-baar-baar', 'Wahi tel, baar baar?',
  'Dhanteras. Kitchens are frying puris and pakodes all day.',
  """Happy Dhanteras ✨ Kadhai mein tel garam hai? Par wahi tel baar baar?

Baar baar garam karne se tel mein polar compounds badhte hain. FSSAI ka rule hai: 25% total polar compounds par tel discard.

Ghar pe pehchaan: tel kaala pade, jhaag aaye, ya dhuan jaldi uthe, toh badal do.

Pakode khao, bas fresh tel mein 😉

Source: FSSAI (RUCO guidance)
#FoodFact #CookingOil #Dhanteras #KitchenTips #DietaryGuide"""),

F(14, '2026-11-07', 'Sat', '1:30 PM', 'walk-after-meal', 'Khaane ke baad 2-5 minute',
  'Right after a festive Saturday lunch.',
  """Lunch ho gaya? Ab bas 2-5 minute utho aur tehlo 🚶

2022 ki research ke mutabik, baithe rehne ke mukable halki walk se khaane ke baad sugar kam badhi.

Ghar mein, office ke corridor mein, chhat pe, kahin bhi. Festive season mein toh ye aadat aur kaam ki hai.

Aaj se try karo, aur Dietary Guide pe streak banao.

Source: Buffey et al., Sports Medicine 2022
#FoodFact #WalkAfterMeals #HealthyHabits #FestiveSeason #DietaryGuide"""),

F(15, '2026-11-08', 'Sun', '11:00 AM', 'real-fruit-juice', "'Real fruit juice' ka sach",
  'Diwali morning, before the evening puja. Juice gift packs are a Diwali staple.',
  """Happy Diwali 🪔 Gift mein juice ka dabba aaya hai? Label padh lo pehle.

ICMR ke mutabik, sirf 10% fruit wala product bhi 'real fruit' ka claim kar sakta hai. Baaki mein added sugar ho sakti hai.
Aur WHO juice ki sugar ko bhi free sugar ginta hai.

Juice ki jagah poora phal khao, fibre bhi milega.

Aapko aur aapki family ko Diwali ki dher saari shubhkamnayein 🧡

Source: ICMR-NIN 2024, WHO 2015
#FoodFact #HappyDiwali #FruitJuice #LabelPadho #DietaryGuide"""),

F(16, '2026-11-09', 'Mon', '9:00 AM', 'nimbu-shahad-detox', 'Nimbu + shahad = fat burn?',
  'The morning after Diwali, when "detox" drinks trend.',
  """Diwali ke baad 'detox' drink ka plan? Ek minute 🍋

Garam paani + nimbu + shahad se fat burn hone ka koi pakka saboot nahi. Aur shahad bhi free sugar hai, WHO ke hisaab se.

Detox ka kaam tumhara liver aur kidney roz karte hain.

Paani piyo, nimbu bhi chalega, bas jaadu mat samjho. Asli reset: normal khaana, achhi neend, thodi walk.

Source: WHO Sugars Guideline 2015
#FoodFact #MythBuster #PostDiwali #Detox #DietaryGuide"""),

F(17, '2026-11-10', 'Tue', '7:30 PM', 'calorie-balance', 'Weight loss ka basic rule',
  'Post-festive reset week, prime evening slot.',
  """Weight loss ka sabse basic rule, jo sabse zyaada bhoola jaata hai ⚖️

Jitna kharch karo, usse thoda kam khao. Yahi calorie deficit hai.
Rough estimate: 1 kg body fat ≈ 7700 kcal. (Bas andaaza hai, har body alag hai.)

Crash diet tikti nahi. Chhota deficit, har meal mein protein, aur roz thodi activity.

Apna calorie target jaanna hai? Dietary Guide calculate karta hai.

Source: common energy-balance approximation
#FoodFact #CalorieDeficit #WeightLoss #BackToBasics #DietaryGuide"""),

F(18, '2026-11-11', 'Wed', '7:30 PM', 'ultra-processed', 'Ultra-processed food kya hai?',
  'Prime evening slot for a meatier explainer.',
  """Ultra-processed food kya hota hai, aur iski itni baat kyun? 🤔

Packet wala khaana jismein aisi cheezein hoti hain jo ghar ki rasoi mein nahi milti: flavour, colour, emulsifier. Jaise chips, instant noodles, sugary drinks, packaged biscuits.

BMJ 2024 ki ek badi review mein, ~1 crore logon ke data mein, inhe 32 health outcomes se juda paaya gaya. Ye link hai, har packet zehar nahi.

Bas roz ka khaana mostly ghar ka rakho.

Source: Lane et al., BMJ 2024
#FoodFact #UltraProcessedFood #EatReal #HomeCooking #DietaryGuide"""),

F(19, '2026-11-12', 'Thu', '6:30 PM', 'protein-powder', 'Protein powder zaroori?',
  'Gym-hour evening.',
  """Gym shuru kiya aur sabse pehle protein powder kharid liya? 💪

ICMR ki 2024 guidelines muscle banane ke liye protein supplements se bachne ki salah deti hain, aur lambe time tak bahut zyaada protein powder lene ke risks ka zikr karti hain.

Food first: dal + roti/chawal, doodh, dahi, paneer, anda.
(Doctor ya dietitian ne kuch alag bola ho, toh unki suno.)

Kitna protein chahiye, apne goal se jaano. Dietary Guide pe plan banao.

Source: ICMR-NIN Dietary Guidelines 2024
#FoodFact #ProteinPowder #GymDiet #ICMR #DietaryGuide"""),

F(20, '2026-11-13', 'Fri', '1:00 PM', 'dal-chawal-combo', 'Dal-chawal: smart combo',
  'Lunch time, the most dal-chawal hour of the day.',
  """Dal-chawal sirf comfort food nahi, smart science hai 🍛

Anaaj mein lysine naam ka amino acid kam hota hai, aur dal mein sulphur wale amino acids. Saath khao toh dono ek doosre ki kami poori karte hain, aur protein quality behtar hoti hai.

Roti-dal, idli-sambar, khichdi, rajma-chawal: sab isi team ke players hain.

Aaj lunch mein kaunsa combo hai? 👇

Source: cereal-pulse protein complementarity research
#FoodFact #DalChawal #DesiFood #VegProtein #DietaryGuide"""),

F(21, '2026-11-14', 'Sat', '1:00 PM', 'food-order', 'Pehle sabzi, phir roti',
  'World Diabetes Day, at lunch time.',
  """Aaj World Diabetes Day hai. Ek aasaan aadat: pehle sabzi, phir roti 🥗

2015 ki ek chhoti study (type 2 diabetes wale 11 log) mein, sabzi aur protein pehle aur carbs baad mein khaane se post-meal sugar kam badhi.

Ye ilaaj nahi, bas ek aadat hai. Diabetes hai toh apne doctor ki salah sabse pehle.

Aaj lunch mein try karo.

Source: Shukla et al., Diabetes Care 2015
#FoodFact #WorldDiabetesDay #BloodSugar #HealthyHabits #DietaryGuide"""),

F(22, '2026-11-15', 'Sun', '12:30 PM', 'gut-dahi', 'Gut health aur ghar ka dahi',
  'Sunday lunch, when dahi is on every thali.',
  """Gut health ke liye mehenge shots? Pehle ghar ka dahi 🥣

Dahi, chaas aur kanji jaise fermented foods mein live bacteria hote hain. Par gut bacteria ko khaana bhi chahiye, aur woh hai fibre.

Toh dahi ke saath dal, sabzi, saabut anaaj aur phal bhi rakho. Basics pehle, trend baad mein.

Source: ISAPP consensus on fermented foods (2021)
#FoodFact #GutHealth #Dahi #Fermented #DietaryGuide"""),

F(23, '2026-11-16', 'Mon', '8:30 PM', 'iron-vitamin-c', 'Iron ka secret partner',
  'Dinner time, when the palak-dal is on the plate.',
  """Palak, dal sab kha rahe ho, phir bhi iron kam? Ye trick note karo 🍋

Plant wala iron body aasani se nahi sokhti. Vitamin C madad karta hai.
Easy pairs: dal pe nimbu, palak ke saath tamatar, khaane ke saath amla ya santra.
Aur chai-coffee khaane se 1 ghanta door.

Thakaan ya kamzori lagti hai? Doctor se test zaroor karwao.

Source: ICMR-NIN 2024; research on vitamin C and plant iron
#FoodFact #Iron #Anaemia #VitaminC #DietaryGuide"""),

F(24, '2026-11-17', 'Tue', '1:00 PM', 'veg-protein', 'Veg protein, desi style',
  'Lunch time. A save-worthy list.',
  """Veg ho aur protein ki tension hai? Save kar lo ye list 📌

Per 100 g (approx): soya chunks (sookhe) ~52 g, moong dal (sookhi) ~24 g, paneer ~18 g.
Dhyaan rahe, pakne ke baad dal ka weight badhta hai, toh per katori protein kam hota hai.

Din bhar baanto: nashte mein dahi ya chana, lunch mein dal, dinner mein paneer ya soya.

Source: Indian food composition data (approx.)
#FoodFact #VegProtein #Paneer #SoyaChunks #DietaryGuide"""),

F(25, '2026-11-18', 'Wed', '7:30 PM', 'label-trick', 'Label padhne ka 10-second trick',
  'Midweek evening, grocery-list time.',
  """Kisi bhi packet ka sach, 10 second mein 🔍

1. Pehle 3 ingredients dekho, yahi sabse zyaada hain
2. Per 100 g sugar, salt, fat
3. Serving size, kyunki poora packet ek serving nahi hota

Bonus: cheeni ke doosre naam bhi pehchano. Glucose syrup, dextrose, invert sugar, corn syrup.

Save karo, agli shopping pe kaam aayega.

Source: FSSAI Labelling & Display Regulations
#FoodFact #LabelPadho #FoodLabels #SmartShopping #DietaryGuide"""),

F(26, '2026-11-19', 'Thu', '12:30 PM', 'b12-vegetarian', 'Vegetarian? B12 check',
  'Lunch time on a weekday.',
  """Vegetarian ho? Vitamin B12 pe dhyaan diya hai kabhi? 💊

B12 zyaadatar animal sources se aata hai: doodh, dahi, paneer, anda, fish. Indian research mein vegetarians ka B12 level non-vegetarians se kam paaya gaya hai.

Roz doodh ya dahi lo, fortified foods dekho. Thakaan ya haath-pair mein jhunjhuni lage toh doctor se test karwao.

Source: Naik et al., Nutrition Journal 2013, and other Indian studies
#FoodFact #VitaminB12 #Vegetarian #VegNutrition #DietaryGuide"""),

F(27, '2026-11-20', 'Fri', '8:30 AM', 'ragi-calcium', 'Calcium = sirf doodh?',
  'Winter breakfast. Ragi daliya season.',
  """Calcium matlab sirf doodh? Ragi se miliye 🌾

100 g ragi mein lagbhag 344 mg calcium hota hai.
Ragi roti, ragi dosa, ya garam ragi daliya, sardi ki subah ke liye perfect.

Aur saath mein thodi dhoop, kyunki vitamin D calcium absorption mein madad karta hai.

Source: ICMR-NIN data via the APEDA Millet Portal
#FoodFact #Ragi #Millets #Calcium #DietaryGuide"""),

F(28, '2026-11-21', 'Sat', '12:30 PM', 'fibre', 'Fibre: underrated hero',
  'Weekend lunch.',
  """Khaane ke ek ghante baad hi bhookh? Shayad fibre kam hai 🥦

Fibre saabut anaaj, dal, sabzi, phal aur beej se milta hai. Pet bhara rakhta hai, aur gut bacteria ka khaana bhi hai.

Easy swaps:
Maida → atta
Juice → poora phal
Chawal ke saath dal aur salad

Source: ICMR-NIN Dietary Guidelines 2024
#FoodFact #Fibre #GutHealth #EasySwaps #DietaryGuide"""),

F(29, '2026-11-22', 'Sun', '12:30 PM', 'paani-kitna', '8 glass paani: sach ya myth?',
  'Sunday midday. Winter is when people forget to drink water.',
  """Sardi aa gayi, aur paani peena bhool gaye? 💧

'8 glass' bas ek rough rule hai. EFSA ke hisaab se mahilaon ko roz lagbhag 2.0 L aur purushon ko 2.5 L total paani chahiye, aur ismein 20-30% khaane se aata hai.

Garmi, pasina ya exercise ho toh zyaada. Halka peela rang = theek signal.

Source: EFSA reference intakes
#FoodFact #Hydration #WaterIntake #WinterHealth #DietaryGuide"""),

F(30, '2026-11-23', 'Mon', '7:30 PM', '56-percent', '56% bimariyon ka link',
  'Series finale in the prime evening slot. Ask people for their favourite fact.',
  """Food Fact No.30, series ka last episode 🧡

ICMR ke mutabik India ke total disease burden ka 56.4% unhealthy diet se juda hai.

Shuruaat 3 badlaav se: sabzi-phal zyaada, namak-cheeni-fried kam, aur roz thodi activity.
Perfect nahi, bas har din thoda behtar.

30 din saath dene ke liye thank you. Kaunsa Food Fact sabse kaam ka laga? Comment karo 👇

Source: ICMR-NIN Dietary Guidelines 2024
#FoodFact #ICMR #HealthyEating #SmallSteps #DietaryGuide"""),
]

assert len(FOOD) == 30
