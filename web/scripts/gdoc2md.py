#!/usr/bin/env python3
"""ดึงเนื้อบทความที่แก้ใน Google Doc กลับมาเป็น .md ใน content/articles/ (ขาเข้าของ md2article.py --doc)

ใช้:  python3 web/scripts/gdoc2md.py content/articles/NN-slug.md <ไฟล์ export.md จาก Google Doc>
export ได้จาก https://docs.google.com/document/d/<id>/export?format=md

ทำอะไร:
  - แทนเนื้อหาหลัง frontmatter ด้วยเนื้อจาก Doc (frontmatter เดิมเก็บไว้ทั้งหมด)
  - ถ้าชื่อเรื่อง (H1) ใน Doc เปลี่ยน แก้ title: ใน frontmatter ให้ตรง
  - ลิงก์ภายในหายตอนส่งเป็น Doc (--doc ตัดทิ้ง) จึงใส่กลับจากไฟล์ .md เดิม
    ตามข้อความลิงก์ ตัวไหนหาข้อความไม่เจอแล้ว (ลูกค้าแก้ประโยค) จะรายงานออกมา
"""
import io, re, sys, pathlib

UNESCAPE = re.compile(r"\\([#()\[\]\-.*_+!>|~`])")


def unbold(t):
    t = t.strip()
    return t[2:-2].strip() if t.startswith("**") and t.endswith("**") else t


def clean_table(rows):
    cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
    cells = [r for r in cells if not all(re.match(r"^:?-+:?$", c) for c in r if c) or not any(r)]
    cells = [r for r in cells if any(c for c in r)]
    if not cells:
        return []
    n = len(cells[0])
    out = ["| " + " | ".join(cells[0]) + " |", "|" + "---|" * n]
    out += ["| " + " | ".join(r) + " |" for r in cells[1:]]
    return out


def convert(doc):
    lines = doc.replace("\r", "").split("\n")
    title, out, i, in_faq = None, [], 0, False
    while i < len(lines):
        raw = lines[i]
        l = UNESCAPE.sub(r"\1", raw.rstrip())
        # Doc export ข้อรายการที่ย่อหน้าไว้ออกมาเป็น "> 1." / "> *" ไม่ใช่ callout จริง
        l = re.sub(r"^>\s+(?=(\d+\.|[-*])\s)", "", l)
        if l.startswith("**คีย์เวิร์ด:**") or re.fullmatch(r"#+\s*(\*\*)?\s*(\*\*)?", l):
            i += 1; continue
        if l.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(UNESCAPE.sub(r"\1", lines[i].rstrip())); i += 1
            out += [""] + clean_table(rows) + [""]
            continue
        if l.startswith("# "):
            title = unbold(l[2:]); out += [f"# {title}", ""]; i += 1; continue
        if l.startswith("## "):
            h = unbold(l[3:]); in_faq = h.startswith("คำถามที่พบบ่อย")
            out += ["", f"## {h}", ""]; i += 1; continue
        if l.startswith("### "):
            h = unbold(l[4:])
            out += ["", f"**{h}**" if in_faq else f"### {h}"]
            if not in_faq: out.append("")
            i += 1; continue
        m = re.match(r"^\s*[-*]\s+(.*)", l)
        if m:
            out.append(f"- {m.group(1).strip()}"); i += 1; continue
        m = re.match(r"^\s*(\d+)\.\s+(.*)", l)
        if m:
            out.append(f"{m.group(1)}. {m.group(2).strip()}"); i += 1; continue
        if not l.strip():
            # บรรทัดว่างหลังรายการ/FAQ ปิดบล็อก
            out.append(""); i += 1; continue
        # Doc ขึ้นย่อหน้าใหม่ด้วย hard break ("  " ท้ายบรรทัด) ไม่ใช่บรรทัดว่าง
        text = l.strip()
        prev = out[-1] if out else ""
        if prev and not prev.startswith(("#", "|", "- ")) and not re.match(r"^\d+\.\s", prev) and not (in_faq and prev.startswith("**")):
            out.append("")
        out.append(text)
        if not raw.endswith("  "):
            out.append("")
        i += 1
    body = re.sub(r"\n{3,}", "\n\n", "\n".join(out)).strip() + "\n"
    # ข้อรายการที่คั่นด้วยบรรทัดว่างต้องติดกัน ไม่งั้น md2article แตกเป็นหลาย <ol> แล้วเลขเริ่ม 1 ใหม่ทุกข้อ
    body = re.sub(r"(?m)^(\d+\. .*)\n\n(?=\d+\. )", r"\1\n", body)
    body = re.sub(r"(?m)^(- .*)\n\n(?=- )", r"\1\n", body)
    return title, body


def relink(body, old_body):
    links = re.findall(r"\[([^\]]+)\]\((/[^)]+)\)", old_body)
    lost = []
    lines = body.split("\n")
    for text, href in links:
        for k, l in enumerate(lines):
            if l.startswith("#"):
                continue
            # ข้ามข้อความที่อยู่ในลิงก์อยู่แล้ว
            plain = re.sub(r"\[[^\]]*\]\([^)]*\)", lambda m: "\0" * len(m.group(0)), l)
            j = plain.find(text)
            if j >= 0:
                lines[k] = l[:j] + f"[{text}]({href})" + l[j + len(text):]
                break
        else:
            lost.append(f"[{text}]({href})")
    return "\n".join(lines), lost


def main():
    md_path, doc_path = map(pathlib.Path, sys.argv[1:3])
    md = io.open(md_path, encoding="utf-8").read()
    fm, old_body = md.split("\n---\n", 1)
    title, body = convert(io.open(doc_path, encoding="utf-8").read())
    body, lost = relink(body, old_body)
    if title:
        fm = re.sub(r'^title:.*$', f'title: "{title}"', fm, count=1, flags=re.M)
    io.open(md_path, "w", encoding="utf-8").write(fm + "\n---\n\n" + body)
    print(f"{md_path.name}: ลิงก์ใส่กลับ {len(set(re.findall(r'\]\((/[^)]+)\)', body)))} · หาย {len(lost)}")
    for x in lost:
        print("   หาย:", x)


if __name__ == "__main__":
    main()
