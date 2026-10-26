#!/usr/bin/env python3
"""เอาบทความ SEO จาก seo/blog/*.md ขึ้นเว็บ (ฟอร์แมตเดียวกับ seo/blogs ของ hometools)

ใช้:  python3 web/scripts/publish-article.py seo/blog/06-*.md [--cover รูป.png] [--dry]
      python3 web/scripts/publish-article.py seo/blog/*.md --dry       # ตรวจทั้งชุด ไม่เขียนอะไร

ทำอะไร:
  1. อ่านกล่อง SEO META บนหัวไฟล์ (slug, title tag, meta desc, หมวด, เวลาอ่าน, วันเผยแพร่, รูปปก, เกี่ยวข้อง)
  2. แปลงเนื้อเป็น fragment HTML ด้วย md2article.convert() ตัวเดียวกับบทเดิม
     → web/app/_content/articles/<slug>.html
  3. upsert รายการใน web/app/_content/articles/_meta.json (ทะเบียนที่ _shell.js อ่าน)
     พร้อม FAQ ที่หน้าใช้สร้าง FAQPage schema
  4. --cover: ย่อรูปเป็นกว้าง 1600 แล้วแปลงเป็น WebP q80 → web/public/images/articles/<slug>.webp

ตรวจก่อนเขียน (ไม่ผ่านไม่เขียน): ลิงก์ภายในทุกตัวต้องชี้หน้าที่มีจริง, ต้องมี FAQ,
วันเผยแพร่ต้องเป็น YYYY-MM-DD, บทความที่เกี่ยวข้องต้องไม่ขึ้นเว็บหลังบทนี้, รูปปกต้องมีไฟล์อยู่จริง
"""
import io, json, re, subprocess, sys, pathlib
from datetime import date

HERE = pathlib.Path(__file__).resolve().parent
WEB = HERE.parent
sys.path.insert(0, str(HERE))
from md2article import convert  # noqa: E402

META_JSON = WEB / "app" / "_content" / "articles" / "_meta.json"
FRAG_DIR = WEB / "app" / "_content" / "articles"
IMG_DIR = WEB / "public" / "images" / "articles"
BRAND = re.compile(r"\s*\|\s*Infinite Material.*$")
TH_MONTH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
STATIC_PAGES = {"/", "/about", "/products", "/services", "/standards", "/articles", "/contact"}


def slugs_in(path):
    return set(re.findall(r'slug:\s*"([^"]+)"', io.open(path, encoding="utf-8").read()))


def field(block, name):
    m = re.search(rf"^{name}\s*(?:\(\d+\))?\s*:\s*(.*)$", block, re.M)
    return m.group(1).strip() if m else ""


def parse(src):
    md = io.open(src, encoding="utf-8").read()
    head = re.match(r"\s*<!--(.*?)-->", md, re.S)
    if not head:
        raise ValueError("ไม่พบกล่อง SEO META บนหัวไฟล์")
    block = head.group(1)
    body = re.sub(r"<!--.*?-->", "", md, flags=re.S).strip()
    meta = {
        "slug": field(block, "URL slug").removeprefix("/articles/").strip("/"),
        "seoTitle": BRAND.sub("", field(block, "Title tag")),
        "description": field(block, "Meta desc"),
        "cat": field(block, "หมวด"),
        "read": field(block, "เวลาอ่าน"),
        "publishAt": field(block, "วันเผยแพร่"),
        "image": field(block, "รูปปก") or None,
        "related": [s.strip() for s in field(block, "เกี่ยวข้อง").split(",") if s.strip()],
    }
    return meta, body


def normalize(body):
    """ฟอร์แมต house template → ฟอร์แมตที่ md2article.convert รับ"""
    lines = body.split("\n")
    title = lines[0][2:].strip() if lines[0].startswith("# ") else None
    out, faq, lead_done = [], [], False
    i = 1 if title else 0
    while i < len(lines):
        l = lines[i]
        if l.strip() == "---":
            i += 1; continue
        # ย่อหน้าแรกเป็นตัวหนาทั้งย่อหน้าใน draft แต่ LEAD ของเว็บมีน้ำหนักอยู่แล้ว
        if not lead_done and l.strip():
            lead_done = True
            m = re.match(r"^\*\*(.+)\*\*$", l.strip())
            out.append(m.group(1) if m else l); i += 1; continue
        m = re.match(r"^\*\*Q:\s*(.+?)\*\*\s*$", l)
        if m:
            q = m.group(1).strip()
            ans = []
            i += 1
            while i < len(lines) and lines[i].strip() and not lines[i].startswith("**"):
                ans.append(re.sub(r"^A:\s*", "", lines[i].strip())); i += 1
            a = " ".join(ans)
            faq.append({"q": q, "a": re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", a).replace("**", "")})
            out += [f"**{q}**", a, ""]
            continue
        out.append(l); i += 1
    return title, "\n".join(out), faq


def th_date(iso):
    y, m, d = map(int, iso.split("-"))
    return f"{d} {TH_MONTH[m - 1]} {y}"


def encode_cover(src, slug):
    dst = IMG_DIR / f"{slug}.webp"
    subprocess.run(["cwebp", "-quiet", "-q", "80", "-resize", "1600", "0", str(src), "-o", str(dst)], check=True)
    return dst


def webp_size(path):
    b = path.read_bytes()
    if b[12:16] == b"VP8X":
        return 1 + int.from_bytes(b[24:27], "little"), 1 + int.from_bytes(b[27:30], "little")
    if b[12:16] == b"VP8 ":
        return int.from_bytes(b[26:28], "little") & 0x3FFF, int.from_bytes(b[28:30], "little") & 0x3FFF
    raise ValueError(f"อ่านขนาดรูป {path.name} ไม่ได้")


def main():
    args = sys.argv[1:]
    dry = "--dry" in args
    cover = args[args.index("--cover") + 1] if "--cover" in args else None
    files = [a for a in args if a.endswith(".md")]
    if cover and len(files) != 1:
        sys.exit("--cover ใช้ได้ทีละบทความ")

    registry = json.loads(META_JSON.read_text(encoding="utf-8"))
    by_slug = {a["slug"]: a for a in registry}
    shell = io.open(FRAG_DIR / "_shell.js", encoding="utf-8").read()
    known_articles = set(re.findall(r'slug:\s*"([^"]+)"', shell)) | set(by_slug)
    products = slugs_in(WEB / "app" / "_data" / "products.js")
    services = slugs_in(WEB / "app" / "_data" / "services.js")

    batch = []
    for f in files:
        meta, body = parse(f)
        title, md, faq = normalize(body)
        meta["title"] = title
        batch.append((f, meta, md, faq))
        known_articles.add(meta["slug"])

    publish_at = {**{s: a.get("publishAt", "") for s, a in by_slug.items()}, **{m["slug"]: m["publishAt"] for _, m, _, _ in batch}}
    failed, ready = False, []
    for f, meta, md, faq in batch:
        errs = []
        if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", meta["slug"]):
            errs.append(f"slug ต้องเป็นภาษาอังกฤษตัวเล็กคั่นด้วย - : {meta['slug']!r}")
        if not meta["title"]:
            errs.append("ไม่มี H1 (# ชื่อเรื่อง) ต่อจากกล่อง META")
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", meta["publishAt"]):
            errs.append(f"วันเผยแพร่ต้องเป็น YYYY-MM-DD: {meta['publishAt']!r}")
        if not faq:
            errs.append("ไม่มี FAQ (**Q: …** / A: …)")
        for href in re.findall(r"\]\((/[^)\s]*)\)", md):
            path = href.split("#")[0].split("?")[0]
            kind, _, slug = path.strip("/").partition("/")
            ok = (path in STATIC_PAGES or (kind == "product" and slug in products)
                  or (kind == "services" and slug in services) or (kind == "articles" and slug in known_articles))
            if not ok:
                errs.append(f"ลิงก์ชี้หน้าที่ไม่มีอยู่: {href}")
        for r in meta["related"]:
            if r not in known_articles:
                errs.append(f"บทความที่เกี่ยวข้องไม่มีอยู่: {r}")
            elif publish_at.get(r, "") > meta["publishAt"]:
                errs.append(f"บทความที่เกี่ยวข้อง {r} ขึ้นเว็บ {publish_at[r]} หลังบทนี้")
        if meta["image"] and not cover and not (WEB / "public" / meta["image"].lstrip("/")).exists():
            errs.append(f"ไม่มีไฟล์รูปปก {meta['image']} (ส่ง --cover มาด้วย)")
        if len(meta["description"]) > 180:
            print(f"   ⚠ {pathlib.Path(f).name}: meta desc ยาว {len(meta['description'])} ตัวอักษร")
        if errs:
            failed = True
            print(f"✗ {pathlib.Path(f).name}")
            for e in errs:
                print("   ", e)
            continue

        state = "ตั้งเวลา" if meta["publishAt"] > date.today().isoformat() else "ขึ้นเว็บ"
        print(f"✓ {pathlib.Path(f).name} → /articles/{meta['slug']} · {state} {meta['publishAt']} · FAQ {len(faq)}")
        ready.append((f, meta, md, faq))

    # ตรวจครบทั้งชุดก่อนค่อยเขียน ไม่งั้นบทที่ผ่านจะมี HTML แต่ไม่มีในทะเบียน
    if failed:
        sys.exit("มีบทความไม่ผ่านการตรวจ ยังไม่ได้เขียนอะไรเลย")
    if dry:
        return

    for f, meta, md, faq in ready:
        html = convert(md)
        io.open(FRAG_DIR / f"{meta['slug']}.html", "w", encoding="utf-8").write(html)
        entry = {
            "slug": meta["slug"], "title": meta["title"], "seoTitle": meta["seoTitle"], "cat": meta["cat"],
            "publishAt": meta["publishAt"], "date": th_date(meta["publishAt"]), "read": meta["read"],
            "excerpt": meta["description"], "description": meta["description"],
            "related": meta["related"], "faq": faq, "source": str(pathlib.Path(f)),
        }
        if cover:
            img = encode_cover(cover, meta["slug"])
            meta["image"] = f"/images/articles/{img.name}"
        if meta["image"]:
            w, h = webp_size(WEB / "public" / meta["image"].lstrip("/"))
            entry.update(image=meta["image"], fit="cover", w=w, h=h)
        by_slug[meta["slug"]] = entry

    out = sorted(by_slug.values(), key=lambda a: a["publishAt"], reverse=True)
    META_JSON.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
