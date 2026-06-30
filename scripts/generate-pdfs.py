#!/usr/bin/env python3
"""Generate beautiful downloadable PDFs for the GenAI Playbook and the Agentic AI Playbook,
in all 10 languages. Each PDF has a cover page, table of contents, and all chapters
with proper print typography."""
import os, sys, re, yaml, markdown, html, glob
from weasyprint import HTML
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "src" / "content" / "docs"
OUT = ROOT / "public" / "downloads"
OUT.mkdir(parents=True, exist_ok=True)

LANGS = ["en", "it", "pl", "ta", "ko", "he", "fi", "ar", "nl", "de"]
LANG_NAMES = {
    "en": "English", "it": "Italiano", "pl": "Polski", "ta": "தமிழ்",
    "ko": "한국어", "he": "עברית", "fi": "Suomi", "ar": "العربية",
    "nl": "Nederlands", "de": "Deutsch",
}

# GenAI chapters (weight 1-19), Agentic chapters (weight 20+)
GENAI_FILES = ["introduction", "leverage", "departmental", "transformative", "data",
               "internal", "people", "eng", "security", "weakness", "futureproof"]
AGENTIC_FILES = ["agents-intro", "agents-anatomy", "agents-tools-mcp",
                 "agents-orchestration", "agents-multiagent", "agents-memory-rag",
                 "agents-evals-observability", "agents-security-governance",
                 "agents-production", "agents-future"]

PLAYBOOKS = [
    {"id": "genai-playbook", "name": "GenAI Playbook", "subtitle": "The executive guide to implementing Generative AI",
     "files": GENAI_FILES},
    {"id": "agentic-ai-playbook", "name": "Agentic AI Playbook", "subtitle": "From GenAI to autonomous agents in production",
     "files": AGENTIC_FILES},
]

def is_rtl(lang): return lang in ("he", "ar")

def load_chapter(basename, lang):
    """Load a chapter's frontmatter + body. Returns (meta, html_body) or None."""
    path = DOCS / f"{basename}.md" if lang == "en" else DOCS / f"{basename}.{lang}.md"
    if not path.exists():
        # fallback to English if translation missing
        path = DOCS / f"{basename}.md"
        if not path.exists():
            return None
    text = path.read_text(encoding="utf-8")
    # parse frontmatter
    if text.startswith("---"):
        end = text.index("\n---", 3) + 4
        fm = yaml.safe_load(text[3:text.index("\n---", 3)])
        body = text[end:].strip()
    else:
        fm = {}
        body = text
    # convert markdown to html
    md = markdown.Markdown(extensions=["extra", "toc", "sane_lists", "fenced_code"], extension_configs={"toc": {"toc_depth": "2-3"}})
    html_body = md.convert(body)
    return fm, html_body

def print_css(lang):
    rtl = is_rtl(lang)
    direction = "rtl" if rtl else "ltr"
    return f"""
@page {{
  size: A4;
  margin: 22mm 20mm 24mm 20mm;
  @bottom-center {{
    content: counter(page);
    font-size: 9pt;
    color: #78716c;
  }}
  @bottom-left {{
    content: "whatgenerativeai.com";
    font-size: 8pt;
    color: #a8a29e;
  }}
}}
@page cover {{ margin: 0; @bottom-center {{ content: none; }} @bottom-left {{ content: none; }} }}
@page toc {{ @bottom-center {{ content: none; }} }}

* {{ box-sizing: border-box; }}
body {{
  font-family: 'Inter', 'Noto Sans', 'DejaVu Sans', sans-serif;
  font-size: 11pt;
  line-height: 1.65;
  color: #1c1917;
  direction: {direction};
}}
h1, h2, h3, h4 {{ font-weight: 700; color: #0f172a; line-height: 1.25; }}
h1 {{ font-size: 22pt; margin: 0 0 8pt 0; color: #0d9488; }}
h2 {{ font-size: 16pt; margin: 28pt 0 8pt 0; color: #134e4a; border-bottom: 1.5px solid #ccfbf1; padding-bottom: 4pt; }}
h3 {{ font-size: 13pt; margin: 20pt 0 6pt 0; color: #0f766e; }}
h4 {{ font-size: 11.5pt; margin: 14pt 0 4pt 0; color: #115e59; }}
p {{ margin: 6pt 0; text-align: justify; }}
a {{ color: #0d9488; text-decoration: none; }}
ul, ol {{ margin: 6pt 0; padding-{direction[0] if rtl else "left"}: 20pt; }}
li {{ margin: 2pt 0; }}
code {{ font-family: 'JetBrains Mono', 'DejaVu Sans Mono', monospace; font-size: 9.5pt; background: #f5f5f4; padding: 1px 4px; border-radius: 3px; color: #134e4a; }}
pre {{ background: #1c1917; color: #fafaf9; padding: 10pt; border-radius: 6px; font-size: 9pt; overflow: hidden; white-space: pre-wrap; margin: 10pt 0; }}
pre code {{ background: none; color: #fafaf9; padding: 0; }}
blockquote {{ border-{direction[0] if rtl else "left"}: 4px solid #14b8a6; background: #f0fdfa; margin: 10pt 0; padding: 8pt 14pt; border-radius: 0 6px 6px 0; color: #134e4a; }}
table {{ width: 100%; border-collapse: collapse; margin: 12pt 0; font-size: 9.5pt; }}
th, td {{ border: 1px solid #d6d3d1; padding: 5pt 8pt; text-align: {direction[0] if rtl else "left"}; }}
th {{ background: #f0fdfa; color: #134e4a; font-weight: 600; }}
tr:nth-child(even) td {{ background: #fafaf9; }}
hr {{ border: none; border-top: 1px solid #d6d3d1; margin: 18pt 0; }}
img {{ max-width: 100%; border-radius: 6px; }}

/* Cover page */
.cover {{
  page: cover;
  height: 297mm;
  width: 210mm;
  background: linear-gradient(160deg, #134e4a 0%, #0f766e 45%, #0d9488 100%);
  color: white;
  padding: 45mm 25mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}}
.cover .badge {{ font-size: 10pt; font-weight: 600; text-transform: uppercase; letter-spacing: 3px; color: #99f6e4; }}
.cover h1 {{ font-size: 36pt; color: white; margin: 20pt 0 8pt 0; line-height: 1.1; font-weight: 800; }}
.cover .subtitle {{ font-size: 15pt; color: #ccfbf1; margin: 0; font-weight: 400; }}
.cover .lang-label {{ font-size: 11pt; color: #99f6e4; margin-top: 6pt; }}
.cover .meta {{ font-size: 10pt; color: #5eead4; }}
.cover .author {{ font-size: 13pt; color: white; font-weight: 600; }}
.cover .author a {{ color: #ccfbf1; }}
.cover .footer-note {{ font-size: 9pt; color: #99f6e4; }}

/* TOC */
.toc {{ page: toc; }}
.toc h2 {{ color: #0d9488; border: none; font-size: 20pt; margin: 0 0 16pt 0; }}
.toc ul {{ list-style: none; padding: 0; }}
.toc li {{ margin: 7pt 0; font-size: 11pt; border-bottom: 1px dotted #d6d3d1; padding-bottom: 4pt; }}
.toc .num {{ color: #0d9488; font-weight: 700; margin-{direction[0] if rtl else "left"}: 0; margin-right: 8pt; }}

/* Chapter break */
.chapter {{ page-break-before: always; }}
.chapter:first-of-type {{ page-break-before: always; }}
.chapter-title {{ color: #0d9488; font-size: 24pt; margin: 0 0 4pt 0; }}
.chapter-desc {{ color: #78716c; font-size: 11pt; font-style: italic; margin: 0 0 12pt 0; }}
.summary-box {{
  background: #f0fdfa; border: 1.5px solid #99f6e4; border-radius: 8px;
  padding: 12pt 16pt; margin: 18pt 0 0 0; page-break-inside: avoid;
}}
.summary-box h2 {{ font-size: 11pt; color: #0d9488; border: none; margin: 0 0 6pt 0; text-transform: uppercase; letter-spacing: 1px; }}
.summary-box p {{ font-size: 9.5pt; color: #44403c; margin: 0; text-align: {direction[0] if rtl else "left"}; }}
"""

def cover_html(playbook, lang):
    name = LANG_NAMES[lang]
    return f"""
<div class="cover">
  <div>
    <div class="badge">Open-source · Apache 2.0</div>
    <h1>{html.escape(playbook["name"])}</h1>
    <p class="subtitle">{html.escape(playbook["subtitle"])}</p>
    <p class="lang-label">{html.escape(name)}</p>
  </div>
  <div>
    <p class="author">Dipankar Sarkar</p>
    <p class="meta">whatgenerativeai.com · 2026</p>
    <p class="footer-note">Downloaded from whatgenerativeai.com — always up to date online.</p>
  </div>
</div>
"""

def toc_html(chapters, lang):
    items = ""
    for i, (meta, _) in enumerate(chapters, 1):
        title = html.escape(meta.get("title", f"Chapter {i}"))
        items += f'<li><span class="num">{i}.</span> {title}</li>'
    return f'<div class="toc"><h2>Contents</h2><ul>{items}</ul></div>'

def chapter_html(meta, body, idx):
    title = html.escape(meta.get("title", ""))
    desc = html.escape(meta.get("description", "") or "")
    # strip the first H1 from body if it duplicates the title (we render our own)
    body_clean = re.sub(r"^<h1[^>]*>.*?</h1>\s*", "", body, count=1, flags=re.DOTALL)
    return f"""
<div class="chapter">
  <h1 class="chapter-title">{title}</h1>
  <p class="chapter-desc">{desc}</p>
  {body_clean}
</div>
"""

def build_pdf(playbook, lang):
    chapters = []
    for basename in playbook["files"]:
        result = load_chapter(basename, lang)
        if result:
            chapters.append(result)
    if not chapters:
        print(f"  SKIP {playbook['id']} {lang}: no chapters found")
        return False
    # build HTML doc
    parts = [cover_html(playbook, lang), toc_html(chapters, lang)]
    for i, (meta, body) in enumerate(chapters, 1):
        parts.append(chapter_html(meta, body, i))
    doc = f"<!doctype html><html lang='{lang}'><head><meta charset='utf-8'><style>{print_css(lang)}</style></head><body>{''.join(parts)}</body></html>"
    out_name = f"{playbook['id']}-{lang}.pdf"
    out_path = OUT / out_name
    HTML(string=doc).write_pdf(str(out_path))
    size_kb = out_path.stat().st_size // 1024
    print(f"  OK  {out_name}  ({size_kb} KB, {len(chapters)} chapters)")
    return True

def main():
    total = 0
    for pb in PLAYBOOKS:
        print(f"\n=== {pb['name']} ===")
        for lang in LANGS:
            if build_pdf(pb, lang):
                total += 1
    print(f"\nDone: {total} PDFs in {OUT}")

if __name__ == "__main__":
    main()