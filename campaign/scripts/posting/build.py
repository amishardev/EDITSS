import html, json, sys, datetime
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from promo import POSTS as PROMO, NOTES as PROMO_NOTES
from food import FOOD

# Usage: python3 -I scripts/posting/build.py <page.html> <CAPTIONS.md>
out_html, out_md = sys.argv[1], sys.argv[2]

def _mins(t):
    hm, ap = t.split(' ')
    h, m = map(int, hm.split(':'))
    return (h % 12 + (12 if ap == 'PM' else 0)) * 60 + m

for p in PROMO:
    p.setdefault('series', 'promo')
POSTS = sorted(PROMO + FOOD, key=lambda p: (p['date'], _mins(p['time'])))
NOTES = [
    PROMO_NOTES[0],
    "Two series overlap until 9 Nov: the promo films and the daily Food Fact. On days with both, they are at least 4 hours apart.",
    "Post the Food Facts in this order. The \"Food Fact No.\" inside each video matches its day, from No.01 on 25 Oct to No.30 on 23 Nov.",
    PROMO_NOTES[1],
    PROMO_NOTES[2],
    "8 Nov is Diwali: Food Fact No.15 goes out in the morning, and the promo slot is still open because there's no Diwali film yet.",
    "Every claim comes from the pack, the app, or the source named at the end of each Food Fact caption. No prices, offers or medical promises.",
]

def week_label(d):
    dt = datetime.date.fromisoformat(d)
    monday = dt - datetime.timedelta(days=dt.weekday())
    sunday = monday + datetime.timedelta(days=6)
    return f"{monday.day} {monday.strftime('%b')} to {sunday.day} {sunday.strftime('%b')}"

def nice(d):
    dt = datetime.date.fromisoformat(d)
    return dt.day, dt.strftime('%b')

# ---------------------------------------------------------------- markdown
md = ["# Dietary Guide posting plan", "",
      "Captions and an upload schedule for all 50 posts (20 promo films and 30 Food Facts), 20 Oct to 23 Nov 2026. Every caption is ready to copy and paste as-is, hashtags included.", ""]
for n in NOTES:
    md.append(f"- {n}")
md.append("")
cur = None
for i, p in enumerate(POSTS, 1):
    wk = week_label(p['date'])
    if wk != cur:
        md += [f"## Week of {wk}", ""]
        cur = wk
    d, m = nice(p['date'])
    md += [f"### {i}. {p['day']} {d} {m}, {p['time']} · {p['film']}", "",
           f"`out/{p['file']}` · {p['kind']} · {p['why']}", "", "```text", p['caption'], "```", ""]
open(out_md, 'w').write("\n".join(md))

# ---------------------------------------------------------------- html
cards = []
cur = None
for i, p in enumerate(POSTS, 1):
    wk = week_label(p['date'])
    if wk != cur:
        if cur is not None:
            cards.append("</section>")
        cards.append(f'<section class="week"><h2>Week of {html.escape(wk)}</h2>')
        cur = wk
    d, m = nice(p['date'])
    kind_cls = 'food' if p.get('series') == 'food' else 'fest' if 'Festive' in p['kind'] else ('prod' if 'Product' in p['kind'] else 'app')
    cards.append(f'''
<article class="post" id="p{i}" data-series="{p.get('series', 'promo')}">
  <div class="when">
    <span class="dow">{p['day']}</span>
    <span class="dnum">{d}</span>
    <span class="mon">{m}</span>
    <span class="time">{p['time']}</span>
  </div>
  <div class="body">
    <div class="meta">
      <span class="kind {kind_cls}">{html.escape(p['kind'])}</span>
      <code class="file">{html.escape(p['file'])}</code>
    </div>
    <h3>{html.escape(p['film'])}</h3>
    <p class="why">{html.escape(p['why'])}</p>
    <div class="cap">
      <pre id="c{i}">{html.escape(p['caption'])}</pre>
      <div class="actions">
        <button type="button" class="copy" data-target="c{i}">Copy caption</button>
        <label class="done"><input type="checkbox" id="done{i}" data-key="{html.escape(p['file'])}"> Posted</label>
      </div>
    </div>
  </div>
</article>''')
cards.append("</section>")

notes = "".join(f"<li>{html.escape(n)}</li>" for n in NOTES)
page = f'''<title>Dietary Guide Posting Plan</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap">
<style>
/* Layout: a single column calendar. Date rail on the left of each post, caption block ready to copy. Brand colours from the app. */
:root {{
  --bg: #FAF8F5;
  --card: #FFFFFF;
  --ink: #0F172A;
  --sub: #55606E;
  --line: #E7E2DA;
  --leaf: #16A34A;
  --teal: #173A3E;
  --haldi: #B9801C;
  --fest: #C2410C;
  --capbg: #F3F7F2;
  --capfg: #13261B;
  --btnfg: #FFFFFF;
  --display: 'Sora', 'Segoe UI', system-ui, sans-serif;
  --body: 'Poppins', 'Segoe UI', system-ui, sans-serif;
  --mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
}}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
    --bg: #0B1416; --card: #11201F; --ink: #EEF2EF; --sub: #9DB0AA; --line: #1F3532;
    --leaf: #34D27A; --teal: #9ED9C3; --haldi: #E7B04A; --fest: #FB923C;
    --capbg: #0E1A19; --capfg: #E3EEE8; --btnfg: #06210F; color-scheme: dark;
  }}
}}
:root[data-theme="dark"] {{
  --bg: #0B1416; --card: #11201F; --ink: #EEF2EF; --sub: #9DB0AA; --line: #1F3532;
  --leaf: #34D27A; --teal: #9ED9C3; --haldi: #E7B04A; --fest: #FB923C;
  --capbg: #0E1A19; --capfg: #E3EEE8; --btnfg: #06210F; color-scheme: dark;
}}
* {{ box-sizing: border-box; }}
body {{ background: var(--bg); color: var(--ink); font-family: var(--body); font-size: 15px; line-height: 1.55; }}
.wrap {{ max-width: 860px; margin: 0 auto; padding-block: 40px 64px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: flex; flex-direction: column; gap: 36px; }}
header {{ display: flex; flex-direction: column; gap: 10px; }}
.eyebrow {{ font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--leaf); font-weight: 600; }}
h1 {{ font-family: var(--display); font-weight: 700; font-size: clamp(30px, 6vw, 44px); line-height: 1.08; letter-spacing: -0.02em; margin: 0; text-wrap: balance; }}
.lede {{ color: var(--sub); max-width: 62ch; margin: 0; }}
.counts {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }}
.counts span {{ font-size: 13px; padding: 4px 12px; border-radius: 999px; border: 1px solid var(--line); color: var(--sub); }}
.notes {{ margin: 0; padding: 18px 20px 18px 36px; border: 1px solid var(--line); border-radius: 14px; background: var(--card); color: var(--sub); display: grid; gap: 6px; }}
.week {{ display: flex; flex-direction: column; gap: 14px; }}
.week h2 {{ font-family: var(--display); font-size: 14px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sub); margin: 0; padding-bottom: 8px; border-bottom: 1px solid var(--line); }}
.post {{ display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 18px; padding: 18px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); }}
.post.is-done {{ opacity: 0.55; }}
.when {{ display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0; padding-top: 2px; }}
.dow {{ font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--sub); }}
.dnum {{ font-family: var(--display); font-weight: 700; font-size: 34px; line-height: 1.05; font-variant-numeric: tabular-nums; }}
.mon {{ font-size: 13px; color: var(--sub); }}
.time {{ margin-top: 8px; font-size: 12px; font-weight: 600; color: var(--teal); white-space: nowrap; font-variant-numeric: tabular-nums; }}
.body {{ min-width: 0; display: flex; flex-direction: column; gap: 6px; }}
.meta {{ display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }}
.kind {{ font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 999px; border: 1.5px solid currentColor; }}
.kind.app {{ color: var(--leaf); }}
.kind.prod {{ color: var(--haldi); }}
.kind.fest {{ color: var(--fest); }}
.kind.food {{ color: var(--teal); background: var(--capbg); }}
.filters {{ display: flex; flex-wrap: wrap; gap: 8px; }}
.filters button {{ font: 600 14px var(--body); color: var(--sub); background: var(--card); border: 1.5px solid var(--line); border-radius: 999px; padding: 8px 16px; cursor: pointer; }}
.filters button[aria-pressed="true"] {{ color: var(--btnfg); background: var(--teal); border-color: var(--teal); }}
.filters button:focus-visible {{ outline: 3px solid var(--leaf); outline-offset: 2px; }}
.file {{ font-family: var(--mono); font-size: 12px; color: var(--sub); overflow-wrap: anywhere; }}
h3 {{ font-family: var(--display); font-weight: 600; font-size: 20px; letter-spacing: -0.01em; margin: 4px 0 0; }}
.why {{ margin: 0; color: var(--sub); font-size: 14px; }}
.cap {{ margin-top: 8px; border-radius: 12px; background: var(--capbg); border: 1px solid var(--line); overflow: hidden; }}
.cap pre {{ margin: 0; padding: 16px 18px; white-space: pre-wrap; overflow-wrap: anywhere; font-family: var(--body); font-size: 15px; line-height: 1.6; color: var(--capfg); user-select: all; -webkit-user-select: all; }}
.actions {{ display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border-top: 1px solid var(--line); }}
.copy {{ font: 600 14px var(--body); color: var(--btnfg); background: var(--leaf); border: 0; border-radius: 999px; padding: 9px 18px; cursor: pointer; }}
.copy:hover {{ filter: brightness(1.06); }}
.copy:focus-visible, .done input:focus-visible {{ outline: 3px solid var(--teal); outline-offset: 2px; }}
.copy.ok {{ background: var(--teal); }}
.done {{ display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--sub); cursor: pointer; }}
.done input {{ width: 18px; height: 18px; accent-color: var(--leaf); }}
@media (max-width: 520px) {{
  .post {{ grid-template-columns: 1fr; gap: 10px; }}
  .when {{ flex-direction: row; align-items: baseline; gap: 8px; }}
  .dnum {{ font-size: 24px; }}
  .time {{ margin: 0 0 0 auto; }}
}}
@media (prefers-reduced-motion: no-preference) {{ .copy {{ transition: background 0.2s; }} }}
</style>
<div class="wrap">
  <header>
    <span class="eyebrow">Instagram Reels · IST</span>
    <h1>Dietary Guide Posting Plan</h1>
    <p class="lede">Every post from Dussehra (20 Oct) to 23 Nov: the 20 promo films, plus the 30-day Food Fact series that starts on 25 Oct. Tap <strong>Copy caption</strong> and paste it straight into Instagram, hashtags included. Ticking <strong>Posted</strong> is only remembered on this device.</p>
    <div class="counts"><span>30 Food Facts</span><span>11 app films</span><span>7 product films</span><span>2 Dussehra films</span></div>
    <div class="filters" role="group" aria-label="Show">
      <button type="button" data-f="all" aria-pressed="true">All 50</button>
      <button type="button" data-f="food" aria-pressed="false">Food Facts</button>
      <button type="button" data-f="promo" aria-pressed="false">Promo films</button>
    </div>
  </header>
  <ul class="notes">{notes}</ul>
  {"".join(cards)}
</div>
<script>
(function () {{
  function store(k, v) {{ try {{ if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); }} catch (e) {{ return null; }} }}
  document.querySelectorAll('.copy').forEach(function (btn) {{
    btn.addEventListener('click', function () {{
      var pre = document.getElementById(btn.dataset.target);
      var text = pre.textContent;
      function done(label) {{ btn.textContent = label; btn.classList.add('ok'); setTimeout(function () {{ btn.textContent = 'Copy caption'; btn.classList.remove('ok'); }}, 1600); }}
      function select() {{ var r = document.createRange(); r.selectNodeContents(pre); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); done('Selected, press copy'); }}
      if (navigator.clipboard && navigator.clipboard.writeText) {{
        navigator.clipboard.writeText(text).then(function () {{ done('Copied'); }}, select);
      }} else {{ select(); }}
    }});
  }});
  var btns = document.querySelectorAll('.filters button');
  function apply(f) {{
    btns.forEach(function (b) {{ b.setAttribute('aria-pressed', String(b.dataset.f === f)); }});
    document.querySelectorAll('.post').forEach(function (el) {{ el.hidden = !(f === 'all' || el.dataset.series === f); }});
    document.querySelectorAll('.week').forEach(function (w) {{ w.hidden = !w.querySelector('.post:not([hidden])'); }});
    store('dg-filter', f);
  }}
  btns.forEach(function (b) {{ b.addEventListener('click', function () {{ apply(b.dataset.f); }}); }});
  var saved = store('dg-filter');
  if (saved === 'food' || saved === 'promo') apply(saved);
  document.querySelectorAll('.done input').forEach(function (cb) {{
    var key = 'dg-posted-' + cb.dataset.key;
    var post = cb.closest('.post');
    if (store(key) === '1') {{ cb.checked = true; post.classList.add('is-done'); }}
    cb.addEventListener('change', function () {{ post.classList.toggle('is-done', cb.checked); store(key, cb.checked ? '1' : null); }});
  }});
}})();
</script>
'''
open(out_html, 'w').write(page)
print('ok', len(POSTS))
