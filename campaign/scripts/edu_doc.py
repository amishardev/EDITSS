"""Writes EDU_SERIES.md: every video's hook, script, sources and a ready-to-paste caption."""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
topics = json.load(open(os.path.join(ROOT, 'src/edu/topics.json')))
timings = json.load(open(os.path.join(ROOT, 'src/edu/timings.json')))

TAGS = {
    'protein': '#Protein #VegProtein', 'chai': '#ChaiLovers #IronDeficiency', 'namak': '#SaltIntake #HeartHealth',
    'cheeni': '#SugarFree #ChaiTime', 'juice': '#LabelPadho #FruitJuice', 'sugar-free': '#LabelPadho #SugarFree',
    'bread': '#BrownBread #LabelPadho', 'label': '#LabelPadho #FoodLabels', 'gud': '#Jaggery #SugarMyth',
    'tel': '#CookingOil #KitchenTips', 'walk': '#WalkAfterMeals #BloodSugar', 'neend': '#Sleep #Cravings',
    'fasting': '#IntermittentFasting #WeightLoss', 'processed': '#UltraProcessedFood #EatReal', 'iron': '#Iron #Anaemia',
    'plate': '#ICMR #BalancedDiet', 'powder': '#ProteinPowder #GymDiet', '56': '#ICMR #HealthyEating',
    'dal': '#DalChawal #DesiFood', 'ragi': '#Ragi #Millets', 'paani': '#Hydration #WaterIntake', 'b12': '#VitaminB12 #Vegetarian',
    'order': '#FoodOrder #BloodSugar', 'veg-protein': '#VegProtein #Paneer', 'fibre': '#Fibre #GutHealth',
    'gut': '#GutHealth #Dahi', 'diwali': '#Diwali #Mithai', 'bar': '#ProteinBar #LabelPadho',
    'detox': '#MythBuster #Detox', 'calorie': '#CalorieDeficit #WeightLoss',
}

def tags_for(slug):
    for k, v in TAGS.items():
        if k in slug:
            return v
    return '#Nutrition'

clean = lambda s: s.replace('*', '')
FEATURE = {'meal-result': 'ek photo se meal scan karo', 'label-result': 'label scan karo', 'chat': 'IRA se poochho',
           'home': 'roz ka khaana track karo', 'streak': 'apni streak banao', 'metrics': 'apne numbers samjho'}

md = ['# Dietary Guide · Food Fact series (30 videos)', '',
      'Thirty 9:16 explainers (1080x1920, 30 fps), about 30 seconds each, with a female Hinglish voiceover, burned-in captions, '
      'and an end card for the Dietary Guide app. Every number on screen is listed with its source below. Where a claim rests on a '
      'small study, the video says so. Medical-adjacent topics carry "not medical advice" and point to a doctor.', '',
      '**Voice.** Rendered with Kokoro-82M (open source, Apache-2.0, Hindi female voice `hf_alpha`), because ElevenLabs refused '
      'free-tier generation on this account ("Free Tier access has been disabled... upgrade to a paid subscription"). The planned '
      'ElevenLabs voice is "Ritu Rathore - Natural Conversational" (voice id fTfuemKGBjYqG4ni4gw3). All 30 scripts total ~10,800 '
      'characters, about 5,400 credits on Flash v2.5 or 10,800 on Multilingual v2/v3, which fits the Starter plan (30k credits, '
      'commercial licence). To swap: save each segment as `public/edu/vo/<slug>/<i>.wav`, run '
      '`python3 -I scripts/edu_tts.py - --timings-only`, then re-render. Scenes re-time themselves to the new voice.', '',
      'Render: `bash scripts/render_edu.sh` (all) or `bash scripts/render_edu.sh protein-kitna` (one). '
      'Scripts live in `scripts/edu_topics.py`; voice in `scripts/edu_tts.py`.', '',
      '| No. | Video | Length | Hook |', '|---|---|---|---|']
for t in topics:
    tm = timings.get(t['slug'])
    ln = f"{tm['total'] / 30:.0f}s" if tm else '-'
    md.append(f"| {t['n']:02d} | `out/edu/edu-{t['n']:02d}-{t['slug']}.mp4` | {ln} | {clean(t['segs'][0]['cap'])} |")
md.append('')
for t in topics:
    ctas = [s for s in t['segs'] if s['scene']['type'] == 'cta']
    feat = FEATURE.get(ctas[0]['scene']['screen'], 'try karo') if ctas else 'try karo'
    body = [clean(s['cap']) for s in t['segs'][1:-1]]
    caption = '\n'.join([
        clean(t['segs'][0]['cap']),
        '',
        *body[:3],
        '',
        f"Dietary Guide pe {feat}. Link bio mein 🌿",
        '',
        'Save karo, kisi ko bhejo jise ye jaanna chahiye.',
        '',
        f"Source: {t['sources'][0].split(':')[0]}",
        '',
        f"#DietaryGuide #FoodFacts #NutritionIndia {tags_for(t['slug'])}",
    ])
    md += [f"## {t['n']:02d} · {t['title']}", '', '**Voiceover (Hindi/Hinglish)**', '']
    md += [f"{i + 1}. {s['vo']}" for i, s in enumerate(t['segs'])]
    md += ['', '**Sources**', ''] + [f'- {s}' for s in t['sources']]
    md += ['', '**Caption (copy-paste)**', '', '```text', caption, '```', '']
open(os.path.join(ROOT, 'EDU_SERIES.md'), 'w').write('\n'.join(md))
print('wrote EDU_SERIES.md')
