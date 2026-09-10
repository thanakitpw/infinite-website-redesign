#!/usr/bin/env python3
"""แปลงบทความ .md ใน content/articles/ เป็น fragment HTML ของเว็บ (inline style ตามบทเดิม)

ใช้:  python3 web/scripts/md2article.py content/articles/NN-slug.md
เขียนออกที่ web/app/_content/articles/<slug>.html (slug อ่านจาก frontmatter)

.md คือต้นฉบับเดียว แก้บทความให้แก้ที่ .md แล้วรันสคริปต์นี้ใหม่ ห้ามแก้ HTML ตรง ๆ
รองรับ: ย่อหน้า, ## / ###, **คำถาม** + คำตอบ (FAQ), รายการ 1. และ -, ตาราง |, > callout,
ลิงก์ [x](/path), **หนา**, *เอียง*  ส่วน # (H1) ข้ามไป เพราะ _shell.js ใส่ให้จากทะเบียนบทความ
"""
import io, re, sys, pathlib

P   = '<p style="margin:0 0 18px;font-size:16.5px;line-height:1.95;color:#3a4a41">'
LEAD= '<p style="margin:0 0 22px;font-size:18px;line-height:1.9;color:#2b382f;font-weight:500">'
H2  = '<h2 style="font-size:23px;font-weight:700;margin:36px 0 14px;color:#0e1a14;letter-spacing:-.2px">'
H3  = '<h3 style="font-size:18.5px;font-weight:600;margin:26px 0 10px;color:#0e1a14">'
FQ  = '<h3 style="font-size:17.5px;font-weight:600;margin:24px 0 8px;color:#0e1a14">'
OL  = '<ol style="margin:2px 0 20px;padding-left:22px;color:#3a4a41;font-size:16px;line-height:2">'
UL  = '<ul style="margin:2px 0 20px;padding-left:20px;color:#3a4a41;font-size:16px;line-height:2">'
CALL= '<div style="background:#f0f7f2;border-left:4px solid #018438;padding:16px 20px;border-radius:0 12px 12px 0;margin:24px 0;font-size:15.5px;line-height:1.85;color:#26463a">'
TBL = '<div style="overflow-x:auto;margin:22px 0 24px"><table style="border-collapse:collapse;width:100%;min-width:520px;font-size:15px;border:1px solid #e7eae4;border-radius:14px;overflow:hidden">'
TH  = 'style="text-align:left;padding:12px 16px;font-size:13px;font-weight:600;color:#4a584f;border-bottom:1px solid #e7eae4"'
TD  = 'style="padding:11px 16px;border-bottom:1px solid #eef1ec;color:#3a4a41"'
TDM = 'style="padding:11px 16px;border-bottom:1px solid #eef1ec;font-family:\'IBM Plex Mono\',monospace;font-size:14px;color:#3a4a41"'
TDL = 'style="padding:11px 16px;color:#3a4a41"'
TDLM= 'style="padding:11px 16px;font-family:\'IBM Plex Mono\',monospace;font-size:14px;color:#3a4a41"'
A   = 'style="color:#018438;font-weight:600"'
NUMERIC = re.compile(r"^[\d,.\s×÷=%–\-°Cตร.ม.ไมครอนถังเที่ยวชั่วโมงกก.ลิตร ประมาณ]+$")


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(t):
    t = esc(t)
    t = re.sub(r"\[([^\]]+)\]\((/[^)]+)\)", lambda m: f'<a href="{m.group(2)}" {A}>{m.group(1)}</a>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<i>\1</i>", t)
    return t


def cell(t, last):
    plain = re.sub(r"<[^>]+>", "", t)
    mono = bool(re.match(r"^[\d,.]+\s", plain)) or plain.replace(",", "").replace(".", "").replace(" ", "").isdigit()
    st = (TDLM if mono else TDL) if last else (TDM if mono else TD)
    return f"<td {st}>{t}</td>"


def convert(md):
    body = md.split("\n---\n", 1)[1] if md.startswith("---") else md
    lines = body.split("\n")
    out, i, lead_done, in_faq = [], 0, False, False
    while i < len(lines):
        l = lines[i].rstrip()
        if not l.strip():
            i += 1; continue
        if l.startswith("# "):
            i += 1; continue
        if l.startswith("## "):
            text = l[3:].strip()
            in_faq = text.startswith("คำถามที่พบบ่อย")
            out.append(f"{H2}{inline(text)}</h2>"); i += 1; continue
        if l.startswith("### "):
            out.append(f"{H3}{inline(l[4:].strip())}</h3>"); i += 1; continue
        if l.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")]); i += 1
            rows = [r for r in rows if not all(re.match(r"^:?-+:?$", c) for c in r)]
            head, data = rows[0], rows[1:]
            h = "".join(f"<th {TH}>{inline(c)}</th>" for c in head)
            trs = []
            for ri, r in enumerate(data):
                last = ri == len(data) - 1
                trs.append("<tr>" + "".join(cell(inline(c), last) for c in r) + "</tr>")
            out.append(f'{TBL}\n  <thead><tr style="background:#f0f7f2">{h}</tr></thead>\n  <tbody>\n    ' + "\n    ".join(trs) + "\n  </tbody>\n</table></div>")
            continue
        if l.startswith(">"):
            q = []
            while i < len(lines) and lines[i].startswith(">"):
                q.append(lines[i].lstrip("> ").strip()); i += 1
            out.append(f"{CALL}{inline(' '.join(q))}</div>"); continue
        m = re.match(r"^(\d+)\.\s+(.*)", l)
        if m or l.startswith("- "):
            ordered = bool(m); items = []
            while i < len(lines):
                mm = re.match(r"^(\d+)\.\s+(.*)", lines[i]) if ordered else (re.match(r"^-\s+(.*)", lines[i]))
                if not mm: break
                items.append(mm.group(2) if ordered else mm.group(1)); i += 1
            tag = OL if ordered else UL
            out.append(tag + "\n" + "\n".join(f"  <li>{inline(x)}</li>" for x in items) + ("\n</ol>" if ordered else "\n</ul>")); continue
        # FAQ: บรรทัด **คำถาม** ตามด้วยคำตอบ
        if in_faq and re.match(r"^\*\*[^*]+\*\*\s*$", l):
            out.append(f"{FQ}{esc(l.strip('*').strip())}</h3>"); i += 1
            ans = []
            while i < len(lines) and lines[i].strip() and not lines[i].startswith(("**", "#")):
                ans.append(lines[i].strip()); i += 1
            if ans: out.append(f'<p style="margin:0 0 16px;font-size:16.5px;line-height:1.95;color:#3a4a41">{inline(" ".join(ans))}</p>')
            continue
        # ย่อหน้า (บรรทัดต่อเนื่องจนเจอบรรทัดว่าง)
        para = []
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(("#", "|", ">", "- ")) and not re.match(r"^\d+\.\s", lines[i]):
            para.append(lines[i].strip()); i += 1
        text = inline(" ".join(para))
        out.append(f"{LEAD if not lead_done else P}{text}</p>"); lead_done = True
    return "\n\n".join(out) + "\n"


def main():
    src = pathlib.Path(sys.argv[1])
    md = io.open(src, encoding="utf-8").read()
    m = re.search(r"^slug:\s*(\S+)", md, re.M)
    if not m: sys.exit("ไม่พบ slug ใน frontmatter")
    root = pathlib.Path(__file__).resolve().parent.parent
    dst = root / "app" / "_content" / "articles" / f"{m.group(1)}.html"
    html = convert(md)
    io.open(dst, "w", encoding="utf-8").write(html)
    print(f"{src.name} -> {dst.relative_to(root.parent)}  ({len(html):,} bytes)")

if __name__ == "__main__":
    main()
