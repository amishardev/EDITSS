"""The 30-part 'Food Fact' education series: scripts, scenes and sources.

Run `python3 -I scripts/edu_topics.py` to write src/edu/topics.json, which both
the voice script (scripts/edu_tts.py) and the Remotion compositions read.

Every segment has:
  vo    - what the voice says (Devanagari, English terms written phonetically)
  cap   - the on-screen caption (Roman Hinglish, *word* = accent)
  scene - what the frame shows
Only figures checked against the listed sources are used. Where a claim rests
on a small study, the script says so.
"""
import json, os, sys

def S(vo, cap, scene): return dict(vo=vo, cap=cap, scene=scene)
def hook(lines, kicker=None, icon=None, big=None):
    d = dict(type='hook', lines=lines)
    if kicker: d['kicker'] = kicker
    if icon: d['icon'] = icon
    if big: d['big'] = big
    return d
def stat(value, label, unit=None, decimals=0, note=None, icon=None, prefix=None):
    d = dict(type='stat', value=value, label=label, decimals=decimals)
    for k, v in dict(unit=unit, note=note, icon=icon, prefix=prefix).items():
        if v is not None: d[k] = v
    return d
def bars(items, title=None, note=None):
    d = dict(type='bars', items=[dict(label=l, value=v, unit=u, hi=h) for l, v, u, h in items])
    if title: d['title'] = title
    if note: d['note'] = note
    return d
def compare(left, right, title=None, verdict=None, note=None):
    side = lambda t: dict(label=t[0], value=t[1], **({'sub': t[2]} if len(t) > 2 else {}))
    d = dict(type='compare', left=side(left), right=side(right))
    for k, v in dict(title=title, verdict=verdict, note=note).items():
        if v: d[k] = v
    return d
def lst(items, title=None, note=None):
    d = dict(type='list', items=[dict(icon=i, text=t) for i, t in items])
    if title: d['title'] = title
    if note: d['note'] = note
    return d
def myth(m, f, note=None):
    d = dict(type='myth', myth=m, fact=f)
    if note: d['note'] = note
    return d
def cubes(count, label, sub=None, note=None, kind='sugar'):
    d = dict(type='cubes', count=count, label=label, kind=kind)
    if sub: d['sub'] = sub
    if note: d['note'] = note
    return d
def timeline(steps, gaps, title=None, note=None):
    d = dict(type='timeline', steps=[dict(icon=i, label=l) for i, l in steps], gaps=gaps)
    if title: d['title'] = title
    if note: d['note'] = note
    return d
def plate(parts, title=None, centre=None, note=None):
    d = dict(type='plate', parts=[dict(label=l, value=v, share=s) for l, v, s in parts])
    for k, v in dict(title=title, centre=centre, note=note).items():
        if v: d[k] = v
    return d
def label(heading, words, title=None, footer=None, note=None):
    d = dict(type='label', heading=heading, words=[dict(t=w[0], hi=w[1]) if isinstance(w, tuple) else dict(t=w) for w in words])
    for k, v in dict(title=title, footer=footer, note=note).items():
        if v: d[k] = v
    return d
def say(lines, icon=None, note=None, dark=False):
    d = dict(type='statement', lines=lines)
    if icon: d['icon'] = icon
    if note: d['note'] = note
    if dark: d['dark'] = True
    return d
def cta(line, sub, screen): return dict(type='cta', line=line, sub=sub, screen=screen)

ICMR24 = 'ICMR-NIN Dietary Guidelines for Indians, 2024'

TOPICS = [
dict(slug='protein-kitna', title='Roz kitna protein chahiye?', accent='turmeric', segs=[
  S('आपको रोज़ कितना प्रोटीन चाहिए? ज़्यादातर लोग इसका अंदाज़ा गलत लगाते हैं।',
    'Roz kitna *protein* chahiye? Zyaadatar log galat guess karte hain.',
    hook(['Roz kitna', '*protein*', 'chahiye?'], 'Protein', 'egg')),
  S('आई सी एम आर के हिसाब से, एक स्वस्थ वयस्क को हर किलो वज़न पर लगभग ज़ीरो पॉइंट एट थ्री ग्राम प्रोटीन चाहिए।',
    'ICMR: har kilo body weight par lagbhag *0.83 gram* protein.',
    stat(0.83, 'protein, har *kg* body weight par, roz', 'g', 2, 'ICMR-NIN 2020 · RDA for healthy adults')),
  S('यानी साठ किलो के इंसान को रोज़ करीब पचास ग्राम प्रोटीन।',
    'Matlab 60 kg ke insaan ko roz karib *50 gram*.',
    compare(('Body weight', '60 kg'), ('Protein / din', '~50 g'), 'Ek *example*', '60 × 0.83 = *49.8 g*')),
  S('इसे हर मील में बाँट दीजिए। दाल, दही, पनीर, चना, या अंडा, हर प्लेट में थोड़ा प्रोटीन।',
    'Har meal mein thoda: *dal, dahi, paneer, chana* ya anda.',
    lst([('bowl', 'Dal ya sprouts'), ('milk', 'Dahi ya paneer'), ('grain', 'Roasted chana'), ('egg', 'Anda, agar khaate ho')], 'Har meal mein *thoda*')),
  S('आपकी प्लेट में कितना प्रोटीन है? डाइटरी गाइड पर बस एक फोटो लीजिए।',
    'Plate mein kitna protein? Ek photo lo.',
    cta('Plate mein kitna *protein*? Ek photo lo.', 'Meal scan', 'meal-result')),
], sources=['ICMR-NIN (2020) Nutrient Requirements for Indians: protein RDA 0.83 g/kg/day for healthy adults']),

dict(slug='chai-khane-ke-saath', title='Khaane ke saath chai?', accent='tomato', segs=[
  S('खाने के साथ चाय पीते हैं? एक मिनट रुकिए।',
    'Khaane ke saath *chai*? Ek minute rukiye.',
    hook(['Khaane ke saath', '*chai?*'], 'Iron alert', 'cup')),
  S('चाय और कॉफ़ी में टैनिन होते हैं, जो खाने से मिलने वाले आयरन का अवशोषण कम कर सकते हैं।',
    'Chai-coffee ke *tannins* khaane se *iron absorption* kam kar sakte hain.',
    say(['Tannins', '*iron* ko', 'rok sakte hain'], 'cup')),
  S('इसलिए आई सी एम आर की सलाह है: खाने से एक घंटा पहले, और एक घंटा बाद तक, चाय कॉफ़ी से बचिए।',
    'ICMR: khaane se *1 ghanta pehle* aur *1 ghanta baad* chai-coffee avoid karein.',
    timeline([('cup', 'Chai'), ('plate', 'Khaana'), ('cup', 'Chai')], ['1 ghanta', '1 ghanta'], '*1 ghanta* ka gap', ICMR24)),
  S('ये ज़रूरी है, क्योंकि भारत में पंद्रह से उनचास साल की सत्तावन प्रतिशत महिलाओं में खून की कमी पाई गई।',
    'NFHS-5: 15-49 saal ki *57%* mahilaon mein anaemia.',
    stat(57, '15-49 saal ki *mahilaon* mein anaemia', '%', 0, 'NFHS-5 (2019-21)', 'drop')),
  S('आयरन से जुड़ा सवाल है? डाइटरी गाइड पर आइरा से पूछिए।',
    'Iron ka sawaal? IRA se poochho.',
    cta('Iron ka *sawaal*? IRA se poochho.', 'Ask IRA', 'chat')),
], sources=[ICMR24 + ': avoid tea/coffee 1 hour before and after meals (tannins reduce iron absorption)', 'NFHS-5 (2019-21): 57.0% of women aged 15-49 anaemic']),

dict(slug='namak-8-gram', title='Roz kitna namak?', accent='sky', segs=[
  S('आप रोज़ कितना नमक खाते हैं? औसत भारतीय, लगभग आठ ग्राम।',
    'Roz kitna *namak*? Average Indian: lagbhag *8 gram*.',
    hook(['roz ka *namak*'], 'Salt check', big='8g')),
  S('जबकि डब्ल्यू एच ओ कहता है, पाँच ग्राम से कम। यानी एक छोटी चम्मच से भी कम।',
    'WHO limit: *5 gram se kam*. Ek chhoti chammach se bhi kam.',
    bars([('Average Indian', 8, 'g', True), ('WHO limit', 5, 'g', False)], 'Hum vs *limit*', 'ICMR-NCDIR, Sci Rep 2023 · WHO')),
  S('ज़्यादा नमक छुपा होता है: अचार, पापड़, नमकीन, और पैकेट वाले खाने में।',
    'Hidden namak: *achaar, papad, namkeen*, packaged food.',
    lst([('jar', 'Achaar'), ('salt', 'Namkeen & papad'), ('tag', 'Packaged snacks'), ('bowl', 'Instant noodles')], 'Namak *chhupa* kahan hai?')),
  S('छोटा सा बदलाव: खाने पर ऊपर से नमक डालना बंद कीजिए, और लेबल पर सोडियम देखिए।',
    'Table pe *upar se namak* band. Label pe *sodium* dekho.',
    say(['Upar se namak?', '*Band.*'], 'salt')),
  S('पैकेट में कितना सोडियम है? डाइटरी गाइड से लेबल स्कैन कीजिए।',
    'Packet mein kitna sodium?',
    cta('Packet mein kitna *sodium*?', 'Label scan', 'label-result')),
], sources=['Scientific Reports 2023 (ICMR-NCDIR, National NCD Monitoring Survey): mean salt intake 8.0 g/day', 'WHO: adults < 5 g salt/day']),

dict(slug='cheeni-6-chammach', title='3 cup chai = din ki cheeni?', accent='turmeric', segs=[
  S('तीन कप चाय, और दिन का पूरा शुगर कोटा खत्म?',
    'Teen cup chai, aur din ka *sugar quota* khatam?',
    hook(['3 cup chai =', 'poore din ki', '*cheeni?*'], 'Sugar math', 'cup')),
  S('डब्ल्यू एच ओ कहता है, फ़्री शुगर दस प्रतिशत से कम रखिए, और बेहतर हो तो पाँच प्रतिशत, यानी लगभग छह चम्मच।',
    'WHO: free sugar *10% se kam*, behtar *5%*: lagbhag *6 chammach*.',
    cubes(6, 'chammach', 'Lagbhag *25 g* free sugar, poore din mein', 'WHO Sugars Guideline 2015')),
  S('अगर हर कप में दो चम्मच चीनी है, तो तीन कप में ही छह चम्मच हो गई।',
    'Har cup mein 2 chammach? *3 cup = 6 chammach.*',
    compare(('1 cup chai', '2', 'chammach cheeni'), ('3 cup chai', '6', 'chammach cheeni'), 'Chai *math*', 'Biscuit, juice, mithai *alag se*.')),
  S('धीरे-धीरे घटाइए: पहले डेढ़ चम्मच, फिर एक। और बिस्किट, जूस में छुपी चीनी भी गिनिए।',
    'Dheere ghatao: *1.5*, phir *1 chammach*. Biscuit-juice ki cheeni bhi gino.',
    lst([('cube', '2 → 1.5 → 1 chammach'), ('tag', 'Label pe sugar check'), ('glass', 'Juice nahi, poora phal')], 'Dheere *dheere*')),
  S('अपना रोज़ का खाना डाइटरी गाइड पर ट्रैक कीजिए, और फ़र्क खुद देखिए।',
    'Roz ka khaana track karo.',
    cta('Roz ka khaana, *track* karo', 'Meal scan', 'meal-result')),
], sources=['WHO Guideline: Sugars intake for adults and children (2015): free sugars < 10% of energy, ideally < 5% (about 25 g, 6 teaspoons)']),

dict(slug='real-fruit-juice', title="'Real fruit juice' ka sach", accent='amla', segs=[
  S('पैकेट पर लिखा है रियल फ्रूट जूस? पर अंदर असली फल कितना है?',
    "'*Real fruit juice*' likha hai? Andar asli phal kitna?",
    hook(["'Real fruit'", '*juice?*'], 'Label check', 'glass')),
  S('आई सी एम आर के मुताबिक, नियमों के तहत सिर्फ़ दस प्रतिशत फल वाला प्रोडक्ट भी रियल फ्रूट का दावा कर सकता है।',
    "ICMR: sirf *10% fruit* wala product bhi 'real fruit' claim kar sakta hai.",
    stat(10, "fruit pulp, aur phir bhi *'real fruit'*", '%', 0, ICMR24)),
  S('बाकी में चीनी और दूसरी चीज़ें हो सकती हैं। और डब्ल्यू एच ओ, जूस की शुगर को भी फ़्री शुगर गिनता है।',
    'Baaki mein *added sugar* ho sakti hai. WHO juice ko bhi *free sugar* ginta hai.',
    myth('Juice = phal jitna *healthy*', 'Juice ki sugar *free sugar* hai, aur fibre bhi kam.', 'WHO Sugars Guideline 2015')),
  S('इसलिए जूस की जगह पूरा फल खाइए, जिसमें फाइबर भी मिलता है।',
    'Juice ki jagah *poora phal*: fibre bhi milta hai.',
    say(['Juice nahi,', '*poora phal.*'], 'lemon')),
  S('अगली बार खरीदने से पहले, डाइटरी गाइड से लेबल स्कैन कर लीजिए।',
    'Kharidne se pehle label scan.',
    cta('Kharidne se pehle, *label scan*', 'Label scan', 'label-result')),
], sources=[ICMR24 + ": 'real fruit' claims allowed with as little as 10% fruit pulp", 'WHO (2015): free sugars include sugars in fruit juices']),

dict(slug='sugar-free-label', title="'Sugar-free' = healthy?", accent='berry', segs=[
  S('शुगर फ़्री लिखा है, तो हेल्दी है? ज़रूरी नहीं।',
    '*Sugar-free* likha hai, toh healthy? Zaroori nahi.',
    hook(["'Sugar-free'", '= *healthy?*'], 'Label myth', 'tag')),
  S('आई सी एम आर चेतावनी देता है: ऐसे प्रोडक्ट में फैट, मैदा, स्टार्च, और छुपी हुई मिठास हो सकती है।',
    'ICMR: inmein *fat, maida, starch* aur chhupi mithaas ho sakti hai.',
    label('INGREDIENTS', [('Refined wheat flour (Maida)', True), ('Edible vegetable fat', True), ('Maltitol', True), 'Milk solids', ('Fructose', True), 'Emulsifier', 'Salt'], footer="'Sugar-free' · mithaas phir bhi", note='Example label · ' + ICMR24)),
  S('माल्टिटॉल, फ्रुक्टोज़, कॉर्न सिरप, मोलासेस, ये सब भी मिठास देने वाली चीज़ें हैं।',
    '*Maltitol, fructose, corn syrup, molasses*: ye bhi mithaas hain.',
    lst([('cube', 'Maltitol'), ('sparkle', 'Fructose'), ('drop', 'Corn syrup'), ('jar', 'Molasses')], 'Inhe *pehchano*')),
  S('इसलिए नाम नहीं, इंग्रीडिएंट लिस्ट पढ़िए।',
    'Naam nahi, *ingredient list* padho.',
    say(['Naam nahi,', '*ingredients* padho.'], 'tag')),
  S('लेबल समझना मुश्किल लगे, तो डाइटरी गाइड पर स्कैन कीजिए।',
    'Label confusing? Scan karo.',
    cta('Label *confusing*? Scan karo.', 'Label scan', 'label-result')),
], sources=[ICMR24 + ": 'sugar-free' foods may contain fats, refined flour, starch and hidden sugars (maltitol, fructose, corn syrup, molasses)"]),

dict(slug='brown-bread', title='Brown bread ka sach', accent='turmeric', segs=[
  S('ब्राउन ब्रेड, मतलब हेल्दी ब्रेड? पहला इंग्रीडिएंट देखिए।',
    '*Brown bread* = healthy? Pehla ingredient dekho.',
    hook(['Brown bread,', '*healthy?*'], 'Label check', 'bread')),
  S('लेबल पर इंग्रीडिएंट्स मात्रा के हिसाब से लिखे जाते हैं, सबसे ज़्यादा वाला सबसे पहले।',
    'Ingredients *zyaada se kam* order mein likhe hote hain.',
    say(['Jo *pehle* likha,', 'woh sabse *zyaada*'], 'tag', 'FSSAI Labelling & Display Regulations')),
  S('अगर पहला शब्द व्हीट फ़्लोर या मैदा है, तो वह रिफ़ाइंड आटा हो सकता है। भूरा रंग कैरेमल से भी आ सकता है।',
    "Pehla *'wheat flour'* ya maida? Refined ho sakta hai. Rang *caramel* se bhi.",
    label('INGREDIENTS', [('Wheat flour (Maida)', True), 'Water', 'Wheat bran', 'Sugar', 'Yeast', ('Colour (Caramel)', True), 'Salt'], note='Example label')),
  S('सही पहचान: सबसे ऊपर होल व्हीट, यानी आटा लिखा हो।',
    'Sahi pehchaan: sabse upar *whole wheat (atta)*.',
    lst([('check', 'Pehla: Whole wheat (atta)'), ('cross', 'Pehla: Wheat flour (maida)'), ('bread', 'Rang pe mat jao')], 'Sahi *pehchaan*')),
  S('ब्रेड हो या बिस्किट, डाइटरी गाइड से लेबल स्कैन करके सच जानिए।',
    'Bread ho ya biscuit, scan karo.',
    cta('Bread ho ya biscuit, *scan karo*', 'Label scan', 'label-result')),
], sources=['FSSAI Labelling & Display Regulations 2020: ingredients listed in descending order of weight', ICMR24 + ": 'made with whole grain' claims can mislead"]),

dict(slug='label-trick', title='Label padhne ka 10-second trick', accent='sky', segs=[
  S('किसी भी पैकेट का सच, दस सेकंड में। ये तीन चीज़ें देखिए।',
    'Kisi bhi packet ka sach, *10 second* mein.',
    hook(['label padhne ka', '*trick*'], 'Label 101', big='10s')),
  S('पहला, शुरुआती तीन इंग्रीडिएंट्स। दूसरा, प्रति सौ ग्राम चीनी, नमक और फैट। तीसरा, सर्विंग साइज़, क्योंकि पूरा पैकेट एक सर्विंग नहीं होता।',
    'Pehle *3 ingredients*, per 100 g *sugar-salt-fat*, aur *serving size*.',
    lst([('tag', 'Pehle 3 ingredients'), ('chart', 'Per 100 g: sugar, salt, fat'), ('scale', 'Serving size check')], 'Bas *3 cheezein*', 'FSSAI Labelling & Display Regulations')),
  S('और चीनी के दूसरे नाम भी पहचानिए: ग्लूकोज़ सिरप, डेक्सट्रोज़, इन्वर्ट शुगर, कॉर्न सिरप।',
    'Cheeni ke *doosre naam*: glucose syrup, dextrose, invert sugar, corn syrup.',
    label('CHEENI KE NAAM', [('Glucose syrup', True), ('Dextrose', True), ('Invert sugar', True), ('Corn syrup', True), ('Fructose', True), ('Sucrose', True), ('Honey', True)], 'Cheeni *bhes badal* ke')),
  S('हर पैकेट पढ़ना मुश्किल है? डाइटरी गाइड पर लेबल स्कैन कीजिए।',
    'Label scan karo.',
    cta('Label, *aasaan* bhasha mein', 'Label scan', 'label-result')),
], sources=['FSSAI Labelling & Display Regulations 2020', 'WHO (2015) free sugars']),

dict(slug='gud-vs-cheeni', title='Gud vs cheeni', accent='turmeric', segs=[
  S('गुड़ हेल्दी, चीनी अनहेल्दी? कैलोरी देखेंगे तो चौंक जाएँगे।',
    '*Gud* healthy, cheeni unhealthy? Calories dekh ke chaunk jaoge.',
    hook(['Gud vs', '*cheeni*'], 'Myth or fact', 'cube')),
  S('सौ ग्राम गुड़ में लगभग तीन सौ अस्सी कैलोरी, और चीनी में भी लगभग उतनी ही।',
    '100 g gud: *~380 kcal*. Cheeni: *lagbhag utni hi*.',
    compare(('Gud · 100 g', '~383', 'kcal'), ('Cheeni · 100 g', '~387', 'kcal'), 'Calories *per 100 g*', 'Farak *na ke barabar*.', 'Approx. values, Indian food composition data')),
  S('गुड़ में थोड़े मिनरल्स ज़रूर होते हैं, पर एक चम्मच में बहुत कम। शरीर के लिए वह भी शुगर ही है।',
    'Gud mein thode *minerals*, par ek chammach mein bahut kam. Hai toh *sugar* hi.',
    myth('Gud healthy hai, *jitna chaho* khao', 'Gud bhi *sugar* hai. Minerals bas thode.')),
  S('तो गुड़ हो या चीनी, मात्रा ही असली बात है।',
    'Gud ho ya cheeni, *quantity* hi asli baat.',
    say(['Gud ho ya cheeni,', '*matra* hi asli baat.'], 'spoon')),
  S('अपने दिन की मिठास का हिसाब, डाइटरी गाइड पर रखिए।',
    'Mithaas ka hisaab rakho.',
    cta('Mithaas ka *hisaab* rakho', 'Meal tracking', 'home')),
], sources=['Indian food composition values (per 100 g): jaggery ~383 kcal, sugar ~387 kcal (approx.)', 'WHO (2015) free sugars']),

dict(slug='tel-baar-baar', title='Wahi tel, baar baar?', accent='tomato', segs=[
  S('पकोड़े वाला तेल, बार-बार इस्तेमाल? ये ज़रूर जानिए।',
    'Pakode wala *tel*, baar-baar? Ye zaroor jaano.',
    hook(['Wahi *tel*,', 'baar baar?'], 'Kitchen check', 'oil')),
  S('तेल को बार-बार गरम करने से उसमें पोलर कंपाउंड्स बढ़ते जाते हैं।',
    'Baar-baar garam karne se *polar compounds* badhte hain.',
    say(['Har baar garam,', '*kharaab* thoda aur'], 'flame')),
  S('एफ़ एस एस ए आई का नियम है: जब ये पच्चीस प्रतिशत तक पहुँचें, तो तेल फेंक देना चाहिए।',
    'FSSAI: *25%* polar compounds par tel discard.',
    stat(25, '*total polar compounds*: iske baad tel discard', '%', 0, 'FSSAI · RUCO guidance')),
  S('घर पर पहचान: तेल काला हो जाए, झाग आए, या धुआँ जल्दी उठे, तो बदल दीजिए।',
    'Ghar pe pehchaan: *kaala*, *jhaag*, ya *jaldi dhuan*? Badal do.',
    lst([('oil', 'Rang gehra ya kaala'), ('drop', 'Jhaag banna'), ('flame', 'Jaldi dhuan uthna')], 'Kab *badlein*?', 'FSSAI guidance note on used cooking oil')),
  S('तली हुई चीज़ें कितनी बार खा रहे हैं? डाइटरी गाइड पर अपनी मील्स ट्रैक कीजिए।',
    'Fried kitni baar? Track karo.',
    cta('Fried kitni baar? *Track karo*', 'Meal scan', 'meal-result')),
], sources=['FSSAI: vegetable oil not to be used once Total Polar Compounds exceed 25%; RUCO guidance note (discard on darkening, foaming, smoke)']),

dict(slug='walk-after-meal', title='Khaane ke baad 2-5 minute', accent='leaf', segs=[
  S('खाने के बाद सिर्फ़ दो से पाँच मिनट। बस इतना सा काम।',
    'Khaane ke baad sirf *2-5 minute*. Bas itna.',
    hook(['minute ki *walk*'], 'Easy habit', big='2-5')),
  S('साल दो हज़ार बाईस की एक रिसर्च में पाया गया कि बैठे रहने के मुकाबले, हल्की वॉक से खाने के बाद शुगर कम बढ़ी।',
    '2022 research: baithne ke mukable *halki walk* se post-meal sugar *kam badhi*.',
    say(['Halki walk =', '*kam* sugar spike'], 'walk', 'Buffey et al., Sports Medicine 2022')),
  S('खाना खाइए, फिर दो से पाँच मिनट टहल लीजिए, घर में ही सही।',
    'Khaana, phir *2-5 min* tehlo. Ghar mein bhi chalega.',
    timeline([('plate', 'Khaana'), ('walk', 'Walk'), ('check', 'Done')], ['phir', '2-5 min'], 'Simple *routine*')),
  S('लंच के बाद, डिनर के बाद, या लंबे समय बैठने के बीच में।',
    'Lunch ke baad, dinner ke baad, ya *lambi sitting* ke beech.',
    lst([('fork', 'Lunch ke baad'), ('moon', 'Dinner ke baad'), ('clock', 'Lambi sitting ke beech')], 'Kab *karein*?')),
  S('ऐसी छोटी आदतों की स्ट्रीक बनाइए, डाइटरी गाइड के साथ।',
    'Chhoti aadatein, badi streak.',
    cta('Chhoti aadatein, *badi streak*', 'Streaks', 'streak')),
], sources=['Buffey AJ et al., Sports Medicine 2022: light walking after eating reduced post-meal glucose vs sitting']),

dict(slug='neend-aur-cravings', title='Neend kam, bhookh zyaada?', accent='berry', segs=[
  S('रात को नींद कम, और अगले दिन मीठा नमकीन खाने का मन? ये इत्तेफ़ाक़ नहीं भी हो सकता।',
    'Neend kam, aur *cravings* zyaada? Ittefaq nahi bhi ho sakta.',
    hook(['Neend *kam*,', 'bhookh *zyaada?*'], 'Sleep & food', 'moon')),
  S('दो हज़ार चार की एक छोटी स्टडी में, दो रात सिर्फ़ चार घंटे सोने पर, भूख वाला हार्मोन घ्रेलिन अट्ठाईस प्रतिशत बढ़ा।',
    '2004 study: 2 raat, 4 ghante neend. *Ghrelin* (bhookh) *28%* upar.',
    bars([('Ghrelin (bhookh) ↑', 28, '%', True), ('Leptin (pet bhara) ↓', 18, '%', False)], '2 raat, sirf *4 ghante*', 'Spiegel et al., Ann Intern Med 2004 · small study')),
  S('और पेट भरने का सिग्नल देने वाला लेप्टिन अठारह प्रतिशत घटा। भूख चौबीस प्रतिशत बढ़ गई।',
    '*Leptin* 18% neeche, bhookh *24%* upar.',
    stat(24, 'zyaada bhookh, khaaskar *meetha, namkeen*', '%', 0, 'Spiegel et al., 2004 · later studies are mixed', prefix='+')),
  S('रोज़ एक ही समय पर सोइए, सात घंटे या उससे ज़्यादा का लक्ष्य रखिए, और शाम के बाद कैफ़ीन कम।',
    'Roz same time, *7+ ghante*, aur shaam ke baad *caffeine kam*.',
    lst([('clock', 'Roz same time'), ('moon', '7+ ghante ka target'), ('cup', 'Shaam ke baad caffeine kam')], 'Better *neend*', 'Adults: 7+ hours (AASM/SRS)')),
  S('नींद और खाने का पूरा पैटर्न समझना है? डाइटरी गाइड पर अपने मेट्रिक्स देखिए।',
    'Neend aur khaana, connected.',
    cta('Neend aur khaana, *connected*', 'Metrics', 'metrics')),
], sources=['Spiegel K et al., Annals of Internal Medicine 2004: 2 nights of 4 h sleep, leptin -18%, ghrelin +28%, hunger +24% (small study; replication mixed)', 'AASM/SRS consensus: adults 7+ hours sleep']),

dict(slug='intermittent-fasting', title='Intermittent fasting: jaadu?', accent='sky', segs=[
  S('इंटरमिटेंट फ़ास्टिंग, वज़न घटाने का जादू? बारह महीने की एक रिसर्च ने कुछ और बताया।',
    '*Intermittent fasting* = jaadu? 12 mahine ki research ne kuch aur bataya.',
    hook(['Intermittent', '*fasting*', '= jaadu?'], 'Trend check', 'clock')),
  S('इस स्टडी में दोनों ग्रुप्स ने कैलोरी कम की। एक ग्रुप ने सिर्फ़ आठ घंटे की विंडो में खाया।',
    'Dono groups ne *calories kam* ki. Ek ne *8 ghante* ki window mein khaaya.',
    compare(('Sirf calorie kam', '6.3 kg', '12 mahine'), ('+ 8 hr window', '8.0 kg', '12 mahine'), 'Weight loss, *12 mahine*', 'Farak *statistically significant nahi*.', 'Liu et al., NEJM 2022 · 139 adults')),
  S('फ़र्क साफ़ नहीं निकला। असली असर कुल कैलोरी और निरंतरता का था।',
    'Asli asar: *total calories* aur *consistency*.',
    say(['Asli game:', '*calories* +', '*consistency*'], 'scale')),
  S('तो वही तरीका चुनिए जो आप लंबे समय तक निभा सकें। डायबिटीज़ हो या कोई दवा चल रही हो, तो पहले डॉक्टर से बात कीजिए।',
    'Jo *lambe time* nibha sako, wahi. Dawai chal rahi ho toh *doctor* se poochho.',
    lst([('check', 'Jo nibha sako, wahi'), ('scale', 'Total calories pe dhyaan'), ('heart', 'Dawai chal rahi? Pehle doctor')], 'Kya *chunein*?')),
  S('अपनी कैलोरी का अंदाज़ा चाहिए? डाइटरी गाइड पर अपनी मील्स स्कैन कीजिए।',
    'Calories ka andaaza, ek photo mein.',
    cta('Calories ka *andaaza*, ek photo mein', 'Meal scan', 'meal-result')),
], sources=['Liu D et al., NEJM 2022 (TREATY): time-restricted eating + calorie restriction vs calorie restriction alone, 8.0 vs 6.3 kg at 12 months, difference not significant']),

dict(slug='ultra-processed', title='Ultra-processed food kya hai?', accent='tomato', segs=[
  S('अल्ट्रा प्रोसेस्ड फ़ूड, आख़िर होता क्या है? और इसकी इतनी बात क्यों हो रही है?',
    '*Ultra-processed food* kya hota hai? Itni baat kyun?',
    hook(['Ultra-processed', '*food*', 'kya hai?'], 'Food science', 'tag')),
  S('ऐसा पैकेट वाला खाना, जिसमें घर की रसोई में न मिलने वाली चीज़ें होती हैं, जैसे फ़्लेवर, कलर, इमल्सीफ़ायर।',
    'Packet food jismein *ghar ki rasoi* mein na milne wali cheezein: flavour, colour, emulsifier.',
    lst([('tag', 'Chips, instant noodles'), ('glass', 'Sugary drinks'), ('bread', 'Packaged biscuits, cakes')], 'Kuch *examples*')),
  S('दो हज़ार चौबीस की बी एम जे की एक बड़ी समीक्षा में, लगभग एक करोड़ लोगों के डेटा में, इन्हें बत्तीस हेल्थ प्रॉब्लम्स से जुड़ा पाया गया।',
    'BMJ 2024: ~1 crore logon ka data, *32 health outcomes* se link.',
    stat(32, 'health outcomes se *link* (association)', None, 0, 'Lane et al., BMJ 2024 · umbrella review')),
  S('ये जुड़ाव है, हर पैकेट ज़हर नहीं। पर रोज़ का खाना ज़्यादातर घर का, और कम प्रोसेस्ड रखिए।',
    'Link hai, har packet zehar nahi. Par roz ka khaana *mostly ghar ka*.',
    say(['Roz ka khaana,', '*mostly ghar ka.*'], 'bowl')),
  S('आपका खाना कितना प्रोसेस्ड है? डाइटरी गाइड से लेबल स्कैन करके देखिए।',
    'Kitna processed? Scan karo.',
    cta('Kitna *processed*? Scan karo', 'Label scan', 'label-result')),
], sources=['Lane MM et al., BMJ 2024;384:e077310: umbrella review, ~10 million participants, direct associations with 32 health parameters']),

dict(slug='iron-vitamin-c', title='Iron ka secret partner', accent='amla', segs=[
  S('पालक, दाल सब खा रहे हैं, फिर भी आयरन कम? ये ट्रिक शायद मिस हो रही है।',
    'Palak, dal sab kha rahe ho, phir bhi *iron* kam? Ye trick miss ho rahi hai.',
    hook(['Iron wala khaana,', 'phir bhi *kami?*'], 'Iron trick', 'leaf')),
  S('पौधों वाला आयरन शरीर आसानी से नहीं सोखता। विटामिन सी इसमें मदद करता है।',
    'Plant iron body aasaani se nahi sokhti. *Vitamin C* madad karta hai.',
    say(['Plant iron +', '*vitamin C*', '= better absorption'], 'lemon', 'Thakaan ya kamzori? Doctor se test karwayein')),
  S('दाल पर नींबू, पालक के साथ टमाटर, या खाने के साथ आँवला या संतरा।',
    'Dal pe *nimbu*, palak ke saath *tamatar*, ya *amla*.',
    lst([('lemon', 'Dal + nimbu'), ('leaf', 'Palak + tamatar'), ('sparkle', 'Khaane ke saath amla/santra')], 'Easy *pairs*')),
  S('और चाय कॉफ़ी को खाने से कम से कम एक घंटा दूर रखिए।',
    'Aur *chai-coffee* khaane se 1 ghanta door.',
    timeline([('plate', 'Khaana'), ('cup', 'Chai')], ['1 ghanta'], 'Chai *baad mein*', ICMR24)),
  S('आयरन से जुड़ा सवाल है? डाइटरी गाइड पर आइरा से पूछिए।',
    'Iron ka sawaal? IRA se poochho.',
    cta('*Iron* ka sawaal? IRA se poochho', 'Ask IRA', 'chat')),
], sources=['Vitamin C enhances non-heme iron absorption (e.g. Hallberg L et al., Am J Clin Nutr 1989)', ICMR24 + ': tea/coffee 1 hour away from meals']),

dict(slug='icmr-plate', title='ICMR ki ideal plate', accent='leaf', segs=[
  S('आई सी एम आर के हिसाब से, दिन भर की प्लेट कैसी दिखनी चाहिए?',
    'ICMR ke hisaab se din bhar ki *plate* kaisi?',
    hook(['ICMR ki', '*ideal plate*'], 'My Plate for the Day', 'plate')),
  S('लगभग दो हज़ार कैलोरी के लिए: चार सौ ग्राम सब्ज़ियाँ, सौ ग्राम फल, और तीन सौ मिलीलीटर दूध या दही।',
    '~2000 kcal: *400 g sabzi*, 100 g phal, 300 ml doodh/dahi.',
    plate([('Sabziyan', '400 g', 400), ('Anaaj', '250-270 g', 260), ('Doodh/dahi', '300 ml', 300), ('Phal', '100 g', 100), ('Dal/anda/meat', '~90 g', 90), ('Nuts & seeds', '30 g', 30), ('Tel/ghee', '27 g', 27)], 'Din bhar, *~2000 kcal*', 'per day', 'ICMR-NIN My Plate for the Day')),
  S('यानी प्लेट में सबसे ज़्यादा जगह सब्ज़ियों और फलों की, अनाज सीमित, और दाल या प्रोटीन ज़रूर।',
    'Plate ka bada hissa *sabzi-phal*, anaaj seemit, dal/protein zaroor.',
    say(['Aadhi plate', '*sabzi aur phal*'], 'leaf')),
  S('और रोज़ लगभग तीस ग्राम नट्स या बीज, और तेल सत्ताईस ग्राम के आसपास।',
    'Roz ~*30 g nuts/seeds*, tel ~*27 g*.',
    lst([('grain', 'Nuts & seeds ~30 g'), ('oil', 'Tel/ghee ~27 g'), ('bowl', 'Dal, anda ya meat ~90 g')], 'Chhoti *cheezein*', 'ICMR-NIN My Plate for the Day (~2000 kcal)')),
  S('आपकी प्लेट इस आदर्श प्लेट के कितना करीब है? डाइटरी गाइड पर स्कैन करके देखिए।',
    'Aapki plate kitni close?',
    cta('Aapki plate *kitni close*?', 'Meal scan', 'meal-result')),
], sources=['ICMR-NIN My Plate for the Day (~2000 kcal): vegetables 400 g, fruits 100 g, milk/curd 300 ml, nuts & seeds 30 g, fats & oils 27 g; cereals 250-270 g; pulses/eggs/meat ~90 g']),

dict(slug='protein-powder', title='Protein powder zaroori?', accent='sky', segs=[
  S('जिम जाते हैं, तो प्रोटीन पाउडर ज़रूरी है? आई सी एम आर ने क्या कहा, सुनिए।',
    'Gym jaate ho toh *protein powder* zaroori? ICMR ne kya kaha?',
    hook(['Protein powder', '*zaroori?*'], 'ICMR 2024', 'jar')),
  S('दो हज़ार चौबीस की गाइडलाइंस में, आई सी एम आर ने मसल्स बनाने के लिए प्रोटीन सप्लीमेंट्स से बचने की सलाह दी।',
    'ICMR 2024: muscle ke liye *protein supplements* avoid karne ki salah.',
    myth('Muscle = *protein powder*', 'ICMR: protein *khaane* se lo, supplements se bacho.', ICMR24)),
  S('लंबे समय तक बहुत ज़्यादा प्रोटीन पाउडर लेने के जोखिमों का भी ज़िक्र किया गया है।',
    'Lambe time tak *bahut zyaada* protein powder ke risks ka zikr hai.',
    say(['Bahut zyaada,', 'bahut lamba?', '*Risk.*'], 'pill')),
  S('खाने से प्रोटीन लीजिए: दाल के साथ अनाज, दूध, दही, पनीर, और अगर खाते हैं तो अंडा।',
    'Khaane se protein: *dal + anaaj*, doodh, dahi, paneer, anda.',
    lst([('bowl', 'Dal + roti/chawal'), ('milk', 'Doodh, dahi, paneer'), ('egg', 'Anda, fish, chicken')], 'Food *first*')),
  S('आपको कितना प्रोटीन चाहिए, डाइटरी गाइड आपके गोल के हिसाब से बताता है।',
    'Aapka protein target.',
    cta('Aapka *protein target*, aapke goal se', 'Personal plan', 'home')),
], sources=[ICMR24 + ': discourages protein supplements for muscle building; cautions on prolonged high intake']),

dict(slug='56-percent', title='56% bimariyon ka link', accent='tomato', segs=[
  S('भारत में बीमारियों का आधे से ज़्यादा बोझ, खाने से जुड़ा है।',
    'India mein *aadhe se zyaada* disease burden, khaane se juda.',
    hook(['bimariyon ka *link*', 'khaane se'], 'ICMR 2024', big='56%')),
  S('आई सी एम आर के अनुसार, कुल डिज़ीज़ बर्डन का छप्पन दशमलव चार प्रतिशत, अनहेल्दी डाइट की वजह से है।',
    'ICMR: *56.4%* total disease burden, unhealthy diet ki wajah se.',
    stat(56.4, 'total disease burden, *unhealthy diet* se', '%', 1, ICMR24)),
  S('शुरुआत तीन आसान बदलावों से कीजिए: सब्ज़ी और फल ज़्यादा, नमक चीनी और तला हुआ कम, और रोज़ थोड़ी एक्टिविटी।',
    '3 badlaav: *sabzi-phal zyaada*, namak-cheeni-fried *kam*, roz *activity*.',
    lst([('leaf', 'Sabzi & phal zyaada'), ('salt', 'Namak, cheeni, fried kam'), ('walk', 'Roz thodi activity')], '*3* badlaav')),
  S('परफ़ेक्ट नहीं, बस हर दिन थोड़ा बेहतर।',
    'Perfect nahi, bas *har din thoda behtar*.',
    say(['Perfect nahi,', '*thoda behtar.*'], 'sparkle', dark=True)),
  S('हर दिन का खाना ट्रैक कीजिए, डाइटरी गाइड के साथ।',
    'Har din, thoda behtar.',
    cta('Har din, *thoda behtar*', 'Track meals', 'home')),
], sources=[ICMR24 + ': 56.4% of total disease burden in India due to unhealthy diets']),

dict(slug='dal-chawal-combo', title='Dal-chawal: smart combo', accent='turmeric', segs=[
  S('दाल चावल सिर्फ़ कम्फ़र्ट फ़ूड नहीं, ये एक स्मार्ट प्रोटीन कॉम्बो है।',
    '*Dal-chawal* sirf comfort food nahi, smart *protein combo* hai.',
    hook(['Dal-chawal:', '*smart combo*'], 'Desi science', 'bowl')),
  S('अनाज में लाइसिन नाम का अमीनो एसिड कम होता है, और दालों में सल्फ़र वाले अमीनो एसिड।',
    'Anaaj mein *lysine* kam, dal mein *sulphur amino acids* kam.',
    compare(('Anaaj (roti/chawal)', 'Lysine', 'kam'), ('Dal', 'Methionine', 'kam'), 'Dono mein *ek kami*')),
  S('साथ खाने पर दोनों एक दूसरे की कमी पूरी करते हैं, और प्रोटीन की क्वालिटी बेहतर होती है।',
    'Saath khaane par *ek doosre ki kami* poori. Protein quality *behtar*.',
    say(['Anaaj + dal =', '*better* protein'], 'check', 'Cereal-pulse complementarity (protein quality research)')),
  S('इसीलिए रोटी दाल, इडली सांभर, खिचड़ी, राजमा चावल, सब कमाल के कॉम्बो हैं।',
    'Roti-dal, idli-sambar, khichdi, rajma-chawal: *sab combos*.',
    lst([('bowl', 'Roti + dal'), ('plate', 'Idli + sambar'), ('bowl', 'Khichdi'), ('fork', 'Rajma + chawal')], 'Desi *combos*')),
  S('अपनी थाली में कितना प्रोटीन है, डाइटरी गाइड पर एक फोटो से जानिए।',
    'Thaali ka protein, ek photo mein.',
    cta('Thaali ka *protein*, ek photo mein', 'Meal scan', 'meal-result')),
], sources=['Cereal-pulse amino acid complementarity: cereals limited in lysine, pulses in sulphur amino acids (e.g. Br J Nutr reviews; Han F et al., Nutrients 2021)']),

dict(slug='ragi-calcium', title='Calcium = sirf doodh?', accent='berry', segs=[
  S('कैल्शियम मतलब सिर्फ़ दूध? रागी से मिलिए।',
    '*Calcium* matlab sirf doodh? *Ragi* se miliye.',
    hook(['Calcium =', 'sirf doodh?', 'Miliye *ragi* se'], 'Millet power', 'grain')),
  S('सौ ग्राम रागी में लगभग तीन सौ चवालीस मिलीग्राम कैल्शियम होता है।',
    '100 g ragi: lagbhag *344 mg calcium*.',
    stat(344, 'calcium, *100 g ragi* mein', 'mg', 0, 'ICMR-NIN food composition data (via APEDA)')),
  S('रागी रोटी, रागी डोसा, या रागी का दलिया। हफ़्ते में कुछ बार शामिल कीजिए।',
    '*Ragi roti*, ragi dosa, ya ragi daliya.',
    lst([('bread', 'Ragi roti'), ('plate', 'Ragi dosa ya idli'), ('bowl', 'Ragi daliya')], 'Kaise *khaayein*?')),
  S('साथ में थोड़ी धूप भी, क्योंकि विटामिन डी, कैल्शियम के अवशोषण में मदद करता है।',
    'Saath mein *vitamin D* bhi: calcium absorption ke liye.',
    say(['Calcium +', '*vitamin D*', '= team'], 'sun')),
  S('मिलेट्स को अपनी डाइट में ट्रैक कीजिए, डाइटरी गाइड के साथ।',
    'Millets, apni diet mein.',
    cta('Millets, *apni diet* mein', 'Meal scan', 'meal-result')),
], sources=['APEDA Millet Portal (NIN/ICMR data): finger millet calcium 344 mg/100 g']),

dict(slug='paani-kitna', title='8 glass paani: sach ya myth?', accent='sky', segs=[
  S('आठ गिलास पानी वाला नियम, सच या मिथ?',
    '*8 glass* paani ka rule: sach ya myth?',
    hook(['glass paani:', '*sach ya myth?*'], 'Hydration', big='8')),
  S('यूरोपियन फ़ूड सेफ़्टी अथॉरिटी के अनुसार, महिलाओं को लगभग दो लीटर, और पुरुषों को ढाई लीटर कुल पानी चाहिए।',
    'EFSA: mahilayein *~2.0 L*, purush *~2.5 L* total paani.',
    bars([('Purush', 2.5, 'L', True), ('Mahilayein', 2.0, 'L', True)], 'Roz ka *total* paani', 'EFSA reference intake · moderate climate & activity')),
  S('इसमें खाने से मिलने वाला पानी भी शामिल है, लगभग बीस से तीस प्रतिशत।',
    'Ismein *khaane ka paani* bhi shaamil: ~20-30%.',
    say(['Dal, sabzi, phal', 'mein bhi *paani*'], 'drop')),
  S('गर्मी, पसीना, या एक्सरसाइज़ हो तो ज़्यादा पीजिए। पेशाब का रंग हल्का पीला रहना अच्छा संकेत है।',
    'Garmi, pasina, exercise? *Zyaada piyo*. Halka peela rang = theek.',
    lst([('sun', 'Garmi mein zyaada'), ('walk', 'Exercise ke baad'), ('drop', 'Halka peela = theek')], 'Apna *signal* pehchano')),
  S('आपके लिए सही मात्रा क्या है? डाइटरी गाइड पर आइरा से पूछिए।',
    'Sahi amount? IRA se poochho.',
    cta('Apne liye *sahi amount*? IRA se poochho', 'Ask IRA', 'chat')),
], sources=['EFSA (2010) Dietary Reference Values for water: adequate total water intake 2.0 L/day women, 2.5 L/day men (about 20-30% from food)']),

dict(slug='b12-vegetarian', title='Vegetarian? B12 check', accent='amla', segs=[
  S('वेजिटेरियन हैं? तो विटामिन बी ट्वेल्व पर ध्यान देना ज़रूरी है।',
    'Vegetarian ho? *Vitamin B12* pe dhyaan zaroori.',
    hook(['Vegetarian?', '*B12* check karo'], 'Veg nutrition', 'pill')),
  S('बी ट्वेल्व ज़्यादातर पशु स्रोतों से मिलता है, जैसे दूध, दही, अंडा, मछली और मीट।',
    'B12 zyaadatar *animal sources* se: doodh, dahi, anda, fish.',
    lst([('milk', 'Doodh, dahi, paneer'), ('egg', 'Anda'), ('fork', 'Fish, chicken')], 'B12 *kahan* milta hai')),
  S('भारतीय रिसर्च में, शाकाहारियों का बी ट्वेल्व लेवल, नॉन वेजिटेरियन्स से कम पाया गया है।',
    'Indian research: *vegetarians* mein B12 level *kam* paaya gaya.',
    say(['Veg diet,', '*B12 kam*', 'ho sakta hai'], 'chart', 'Indian studies, e.g. Naik et al., Nutrition Journal 2013')),
  S('दूध दही रोज़ लीजिए, फ़ोर्टिफ़ाइड फ़ूड देखिए, और थकान या झुनझुनी हो तो डॉक्टर से टेस्ट करवाइए।',
    'Roz *doodh-dahi*, fortified foods, aur thakaan ho toh *doctor se test*.',
    lst([('milk', 'Roz doodh ya dahi'), ('tag', 'Fortified foods'), ('heart', 'Lakshan? Doctor se test')], 'Kya *karein*?')),
  S('अपने खाने से जुड़े सवाल, डाइटरी गाइड पर आइरा से पूछिए।',
    'Veg diet ke sawaal? IRA se poochho.',
    cta('Veg diet ke *sawaal*? IRA se poochho', 'Ask IRA', 'chat')),
], sources=['Naik S et al., Nutrition Journal 2013: lower B12 status in Indian lacto-vegetarians; milk improved status', 'Down To Earth: India lacks nationwide B12 data']),

dict(slug='food-order', title='Pehle sabzi, phir roti', accent='leaf', segs=[
  S('वही खाना, बस खाने का क्रम बदलिए। पहले सब्ज़ी, फिर रोटी।',
    'Wahi khaana, bas *order* badlo. Pehle *sabzi*, phir roti.',
    hook(['Pehle *sabzi*,', 'phir roti'], 'Food order', 'fork')),
  S('पहले सब्ज़ी और प्रोटीन, और आख़िर में रोटी चावल।',
    'Pehle *sabzi*, phir *protein*, aakhir mein *roti-chawal*.',
    timeline([('leaf', 'Sabzi'), ('egg', 'Protein'), ('bread', 'Roti/chawal')], ['phir', 'phir'], 'Khaane ka *order*')),
  S('दो हज़ार पंद्रह की एक छोटी स्टडी में, टाइप टू डायबिटीज़ वाले लोगों में, इस क्रम से खाने पर शुगर कम बढ़ी।',
    '2015 ki ek *chhoti study*: is order se post-meal sugar *kam badhi*.',
    say(['Same khaana,', '*kam* sugar spike'], 'chart', 'Shukla et al., Diabetes Care 2015 · 11 adults with type 2 diabetes')),
  S('ये कोई इलाज नहीं, एक आसान आदत है। डायबिटीज़ है तो अपने डॉक्टर की सलाह मानिए।',
    'Ilaaj nahi, *aasaan aadat*. Diabetes hai toh *doctor* ki salah.',
    say(['Ilaaj nahi,', '*aasaan aadat.*'], 'heart', dark=True)),
  S('अपनी हर मील का बैलेंस देखना है? डाइटरी गाइड पर एक फोटो लीजिए।',
    'Har meal ka balance.',
    cta('Har meal ka *balance*', 'Meal scan', 'meal-result')),
], sources=['Shukla AP et al., Diabetes Care 2015;38(7):e98-e99: vegetables and protein before carbohydrate lowered post-meal glucose (pilot, n=11)']),

dict(slug='veg-protein', title='Veg protein, desi style', accent='turmeric', segs=[
  S('शाकाहारी हैं और प्रोटीन की टेंशन है? ये देसी सोर्स देखिए।',
    'Veg ho aur *protein* ki tension? Ye desi sources dekho.',
    hook(['Veg *protein*,', 'desi style'], 'Protein list', 'bowl')),
  S('सौ ग्राम में: सोया चंक्स में लगभग बावन ग्राम, मूंग दाल में करीब चौबीस, और पनीर में लगभग अठारह ग्राम प्रोटीन।',
    'Per 100 g: *soya chunks ~52 g*, moong dal ~24 g, paneer ~18 g.',
    bars([('Soya chunks (sookhe)', 52, 'g', True), ('Moong dal (sookhi)', 24, 'g', False), ('Paneer', 18, 'g', False)], 'Protein *per 100 g*', 'Approx. values · Indian food composition data')),
  S('ध्यान रहे, सूखी और पकी दाल में फ़र्क है। पकने पर पानी से वज़न बढ़ता है।',
    'Dhyaan rahe: *sookhi* vs *paki* dal. Pakne par weight badhta hai.',
    say(['Sookhi vs *paki*', 'dal: farak hai'], 'scale')),
  S('दिन भर में बाँटिए: नाश्ते में दही या चना, लंच में दाल, और डिनर में पनीर या सोया।',
    'Din bhar baanto: *nashte* mein dahi, *lunch* mein dal, *dinner* mein paneer.',
    lst([('sun', 'Nashta: dahi ya chana'), ('bowl', 'Lunch: dal ya rajma'), ('moon', 'Dinner: paneer ya soya')], 'Din bhar *baanto*')),
  S('हर मील का प्रोटीन, डाइटरी गाइड पर एक फोटो से।',
    'Har meal ka protein, ek photo se.',
    cta('Har meal ka *protein*, ek photo se', 'Meal scan', 'meal-result')),
], sources=['Approximate protein per 100 g from Indian food composition data: soya chunks (dry) ~52 g, moong dal (dry) ~24 g, paneer ~18-19 g']),

dict(slug='fibre', title='Fibre: underrated hero', accent='amla', segs=[
  S('पेट जल्दी खाली लगता है? शायद आपकी डाइट में फ़ाइबर कम है।',
    'Pet jaldi khaali lagta hai? Shaayad *fibre* kam hai.',
    hook(['Fibre:', '*underrated*', 'hero'], 'Gut & fullness', 'leaf')),
  S('फ़ाइबर साबुत अनाज, दाल, सब्ज़ी, फल और बीजों से मिलता है।',
    'Fibre: *saabut anaaj*, dal, sabzi, phal, beej.',
    lst([('grain', 'Saabut anaaj, millets'), ('bowl', 'Dal, chana, rajma'), ('leaf', 'Sabzi & phal')], 'Fibre *kahan* hai?')),
  S('ये पेट भरा महसूस करवाता है, और आँतों के अच्छे बैक्टीरिया का खाना भी है।',
    'Pet *bhara* rakhta hai, aur *gut bacteria* ka khaana bhi.',
    say(['Pet bhara,', '*gut* khush'], 'gut')),
  S('आसान स्वैप्स: मैदा की जगह आटा, जूस की जगह फल, और चावल के साथ दाल और सलाद।',
    'Swaps: *maida → atta*, *juice → phal*, chawal ke saath dal-salad.',
    lst([('bread', 'Maida → atta'), ('glass', 'Juice → poora phal'), ('bowl', 'Chawal + dal + salad')], 'Easy *swaps*')),
  S('अपने खाने का बैलेंस, डाइटरी गाइड पर देखिए।',
    'Khaane ka balance dekho.',
    cta('Khaane ka *balance* dekho', 'Meal scan', 'meal-result')),
], sources=[ICMR24 + ': whole grains, pulses, vegetables and fruits as fibre sources', 'Dietary fibre and gut microbiota (general nutrition science)']),

dict(slug='gut-dahi', title='Gut health aur ghar ka dahi', accent='berry', segs=[
  S('गट हेल्थ का ट्रेंड हर जगह है। पर घर का दही इसमें कितना काम का है?',
    '*Gut health* trend everywhere. Ghar ka *dahi* kitna kaam ka?',
    hook(['Gut health', 'aur *ghar ka dahi*'], 'Trend check', 'gut')),
  S('दही, छाछ और कांजी जैसे फ़र्मेंटेड फ़ूड में ज़िंदा बैक्टीरिया होते हैं।',
    '*Dahi, chaas* aur *kanji* jaise fermented foods mein live bacteria.',
    lst([('milk', 'Dahi'), ('glass', 'Chaas'), ('jar', 'Kanji')], '*Fermented* desi')),
  S('पर गट बैक्टीरिया को खाना भी चाहिए, और वो है फ़ाइबर।',
    'Par gut bacteria ko *khaana* bhi chahiye: *fibre*.',
    say(['Bacteria ko', '*khaana* bhi chahiye:', 'fibre'], 'leaf')),
  S('तो दही के साथ दाल, सब्ज़ी, साबुत अनाज और फल भी रखिए। महंगे शॉट्स से पहले, ये बेसिक्स।',
    'Dahi + *fibre*: dal, sabzi, saabut anaaj. Mehenge shots se pehle *basics*.',
    say(['Mehenge shots se', 'pehle, *basics.*'], 'sparkle', dark=True)),
  S('रोज़ का बैलेंस्ड खाना, डाइटरी गाइड पर ट्रैक कीजिए।',
    'Gut ke liye roz ka plan.',
    cta('Gut ke liye *roz ka plan*', 'Meal scan', 'meal-result')),
], sources=['Marco ML et al., Nat Rev Gastroenterol Hepatol 2021 (ISAPP consensus on fermented foods)', 'Dietary fibre as substrate for gut microbiota']),

dict(slug='diwali-mithai', title='Diwali mithai, smart plan', accent='turmeric', segs=[
  S('दिवाली आ रही है, मिठाई भी आएगी। गिल्ट नहीं, स्मार्ट प्लान।',
    'Diwali aa rahi hai, *mithai* bhi. Guilt nahi, *smart plan*.',
    hook(['Diwali *mithai*:', 'guilt nahi,', 'plan'], 'Festive special', 'sweet')),
  S('छोटा पीस चुनिए, आराम से स्वाद लेकर खाइए, और खाली पेट नहीं, खाने के बाद।',
    '*Chhota piece*, aaram se, aur khaali pet nahi.',
    lst([('sweet', 'Chhota piece'), ('clock', 'Aaram se, swaad lekar'), ('plate', 'Khaali pet nahi, khaane ke baad')], 'Mithai *rules*')),
  S('मिठाई के बाद दो से पाँच मिनट की वॉक। रिसर्च कहती है, हल्की वॉक खाने के बाद शुगर संभालने में मदद करती है।',
    'Mithai ke baad *2-5 min walk*. Post-meal sugar ke liye helpful.',
    timeline([('sweet', 'Mithai'), ('walk', 'Walk')], ['2-5 min'], 'Phir *walk*', 'Buffey et al., Sports Medicine 2022')),
  S('और याद रखिए, डब्ल्यू एच ओ के हिसाब से, पूरे दिन की फ़्री शुगर लगभग छह चम्मच तक बेहतर।',
    'WHO: poore din ki free sugar *~6 chammach* tak behtar.',
    cubes(6, 'chammach', '*Poore din* ki free sugar, behtar limit', 'WHO 2015 (< 5% energy, about 25 g)')),
  S('त्योहार में भी अपना हिसाब रखिए, डाइटरी गाइड के साथ। हैप्पी दिवाली!',
    'Tyohaar bhi, hisaab bhi.',
    cta('Tyohaar bhi, *hisaab* bhi', 'Meal scan', 'meal-result')),
], sources=['WHO (2015) free sugars < 5% energy (about 25 g)', 'Buffey AJ et al., Sports Medicine 2022']),

dict(slug='protein-bar-label', title="'High protein' likha hai, toh?", accent='berry', segs=[
  S('प्रोटीन बार, प्रोटीन चिप्स, हर जगह हैं। पर हर प्रोटीन वाला पैकेट हेल्दी नहीं होता।',
    '*Protein* bar, protein chips, har jagah. Par har packet healthy nahi.',
    hook(["'High protein'", 'likha hai,', '*toh?*'], 'Trend check', 'bar')),
  S('लेबल पर तीन चीज़ें देखिए: प्रति सर्विंग कितना प्रोटीन, कितनी शुगर, और पहले इंग्रीडिएंट्स क्या हैं।',
    'Dekho: *protein per serving*, *sugar*, aur *pehle ingredients*.',
    lst([('chart', 'Protein per serving'), ('cube', 'Kitni sugar?'), ('tag', 'Pehle 3 ingredients')], 'Label pe *3 cheezein*')),
  S('अगर चीनी और फ़ैट ज़्यादा हैं, तो वह एक कैंडी बार जैसा भी हो सकता है।',
    'Sugar-fat zyaada? Toh *candy bar* jaisa bhi ho sakta hai.',
    myth("'Protein' likha = *healthy*", '*Sugar, fat* aur ingredients bhi dekho.')),
  S('और याद रखिए, ज़्यादातर प्रोटीन, असली खाने से आ सकता है।',
    'Zyaadatar protein *asli khaane* se aa sakta hai.',
    say(['Pehle *asli khaana*,', 'phir packet'], 'bowl', ICMR24 + ': food first')),
  S('कोई भी बार खरीदने से पहले, डाइटरी गाइड से उसका लेबल स्कैन कीजिए।',
    'Kharidne se pehle, scan.',
    cta('Kharidne se pehle, *scan*', 'Label scan', 'label-result')),
], sources=['Google Trends India 2025: protein bar / protein chips searches at 5-year highs (as reported)', ICMR24 + ': protein from food first; read labels']),

dict(slug='nimbu-shahad-detox', title='Nimbu + shahad = fat burn?', accent='amla', segs=[
  S('सुबह गरम पानी, नींबू और शहद, और फ़ैट बर्न? सुनिए सच।',
    'Garam paani + nimbu + *shahad* = fat burn? Suno sach.',
    hook(['Nimbu + shahad', '= *fat burn?*'], 'Myth buster', 'lemon')),
  S('ऐसा कोई पक्का सबूत नहीं कि ये ड्रिंक फ़ैट जलाती है। उल्टा, शहद में शुगर होती है, जिसे डब्ल्यू एच ओ फ़्री शुगर गिनता है।',
    'Fat burn ka *pakka saboot nahi*. Aur shahad = *free sugar* (WHO).',
    myth('Nimbu-shahad paani *fat jalata* hai', 'Saboot nahi. Shahad bhi *free sugar* hai.', 'WHO Sugars Guideline 2015')),
  S('और डिटॉक्स? वो काम आपका लिवर और किडनी हर दिन करते हैं।',
    'Aur *detox*? Woh kaam *liver aur kidney* roz karte hain.',
    say(['Detox?', '*Liver aur kidney*', 'already on duty'], 'heart')),
  S('पानी पीना अच्छा है, नींबू भी ठीक। बस इसे जादू मत समझिए, कुल खाना और एक्टिविटी मायने रखते हैं।',
    'Paani accha, nimbu theek. Bas *jaadu* mat samjho.',
    lst([('drop', 'Paani: haan'), ('lemon', 'Nimbu: theek'), ('scale', 'Asli game: total khaana + activity')], 'Toh *kya karein*?')),
  S('फ़िटनेस के मिथ्स पर सवाल? डाइटरी गाइड पर आइरा से पूछिए।',
    'Koi bhi myth? IRA se poochho.',
    cta('Koi bhi *myth*? IRA se poochho', 'Ask IRA', 'chat')),
], sources=['WHO (2015): honey counts as free sugar', 'No good evidence that lemon-honey water burns fat; detoxification is done by liver and kidneys']),

dict(slug='calorie-balance', title='Weight loss ka basic rule', accent='sky', segs=[
  S('वज़न घटाने का सबसे बेसिक नियम, जिसे लोग सबसे ज़्यादा भूलते हैं।',
    'Weight loss ka *sabse basic* rule.',
    hook(['Weight loss ka', '*basic rule*'], 'Back to basics', 'scale')),
  S('जितनी कैलोरी शरीर खर्च करता है, उससे थोड़ी कम खाइए। यही कैलोरी डेफ़िसिट है।',
    'Kharch se *thoda kam* khao: yahi *calorie deficit*.',
    compare(('Khaaya', 'In'), ('Kharch kiya', 'Out'), 'Calorie *balance*', 'In < Out = *deficit*')),
  S('मोटे तौर पर, एक किलो फ़ैट लगभग सात हज़ार सात सौ कैलोरी के बराबर माना जाता है। पर ये सिर्फ़ एक मोटा अंदाज़ा है।',
    'Rough estimate: *1 kg fat ≈ 7700 kcal*. Bas ek andaaza.',
    stat(7700, 'kcal ≈ *1 kg* body fat, rough estimate', None, 0, 'Common approximation · real results vary')),
  S('बहुत ज़्यादा कमी लंबे समय तक नहीं टिकती। छोटा, टिकाऊ डेफ़िसिट, अच्छा प्रोटीन, और रोज़ की एक्टिविटी।',
    'Crash diet *tikti nahi*. Chhota deficit, protein, activity.',
    lst([('check', 'Chhota, tikaau deficit'), ('egg', 'Har meal mein protein'), ('walk', 'Roz activity')], 'Jo *tike*, wahi')),
  S('आपका कैलोरी टारगेट क्या होना चाहिए? डाइटरी गाइड आपके लिए कैलकुलेट करता है।',
    'Aapka calorie target?',
    cta('Aapka *calorie target*?', 'Metrics', 'metrics')),
], sources=['Energy balance; ~7700 kcal per kg fat is a common approximation (Wishnofsky 1958) with known limits (Hall KD 2008)']),
]

assert len(TOPICS) == 30, len(TOPICS)
for i, t in enumerate(TOPICS, 1):
    t['n'] = i

out = sys.argv[1] if len(sys.argv) > 1 else 'src/edu/topics.json'
os.makedirs(os.path.dirname(out), exist_ok=True)
json.dump(TOPICS, open(out, 'w'), ensure_ascii=False, indent=1)
print('wrote', out, len(TOPICS), 'topics,', sum(len(t['segs']) for t in TOPICS), 'segments,', sum(len(s['vo']) for t in TOPICS for s in t['segs']), 'VO characters')
