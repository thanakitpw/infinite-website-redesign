import { parse, NodeType } from "node-html-parser";

/* ── ชั้นกลางระหว่างไฟล์ HTML ใน _content กับระบบหลังบ้าน ──────────────────────
   เนื้อหาของเว็บนี้เป็น HTML เขียนมือ inline style ล้วน แปลงเป็นบล็อก JSON ทั้งก้อน
   จะเสี่ยงพังดีไซน์และกินเวลามาก เฟสแรกจึงไม่แตะโครง HTML เลย แต่ทำสองอย่างแทน

     extractBlocks() — เดินต้นไม้ DOM แล้วแจกกุญแจถาวรให้ทุก "จุดที่แก้ได้"
                       (ข้อความ · รูป <img> · รูปพื้นหลังใน style) จัดกลุ่มตาม
                       section ลูกตรงของ wrapper ซึ่งตรงกับ "บล็อกในหน้านี้"
                       ในดีไซน์หลังบ้านพอดี
     applyOverrides() — เอาค่าที่ลูกค้าแก้จาก Supabase มาทับกลับเข้า HTML ก่อนเสิร์ฟ

   กุญแจ (key) = "<ลำดับบล็อก>/<เส้นทาง DOM><ชนิด>" เช่น "3/0.1.2#t0" หรือ "3/0@bg"
   เส้นทางคือดัชนีลูก element ไล่จากรากบล็อก จึงคงที่ตราบใดที่โครง HTML ไม่ถูกรื้อ

   กันกรณีนักพัฒนาแก้ HTML ทีหลังจนเส้นทางเลื่อน: เก็บ hash ของข้อความเดิมไว้คู่กัน
   ตอน apply ถ้า hash ไม่ตรงจะ "ไม่ทับ" แล้วรายงานกลับเป็น stale ให้หลังบ้านเตือน
   ยอมให้เห็นของเดิมของนักพัฒนา ดีกว่าเอาข้อความลูกค้าไปแปะผิดที่ */

const SKIP_TAGS = new Set(["script", "style", "svg", "path", "noscript", "br"]);
const HAS_CONTENT = /[\p{L}\p{N}]/u;

// hash สั้นแบบ FNV-1a — ใช้แค่ตรวจว่าข้อความต้นทางยังเป็นตัวเดิมไหม ไม่ใช่งานความปลอดภัย
export function hashOf(s) {
  let h = 0x811c9dc5;
  const str = String(s ?? "");
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

const escapeText = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escapeAttr = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const BG_URL = /(background(?:-image)?\s*:[^;]*?url\((['"]?))([^'")]+)(\2\))/i;

/* ── ตัวเดินต้นไม้ที่ extract กับ apply ใช้ร่วมกัน ───────────────────────────
   visit(field, node, ctx) ถูกเรียกทีละจุดที่แก้ได้ ตามลำดับเอกสาร */
function walkBlock(blockRoot, blockIdx, visit) {
  const step = (el, path) => {
    if (SKIP_TAGS.has((el.rawTagName || "").toLowerCase())) return;

    // รูปพื้นหลังใน style attribute
    const style = el.getAttribute?.("style");
    if (style) {
      const m = style.match(BG_URL);
      if (m) visit({ key: `${blockIdx}/${path}@bg`, kind: "image", value: m[3] }, el, { style });
    }

    if ((el.rawTagName || "").toLowerCase() === "img") {
      const src = el.getAttribute("src");
      if (src) {
        visit({ key: `${blockIdx}/${path}@img`, kind: "image", value: src, alt: el.getAttribute("alt") || "" }, el, {});
      }
    }

    let textIdx = 0;
    let elIdx = 0;
    for (const child of el.childNodes) {
      if (child.nodeType === NodeType.TEXT_NODE) {
        const raw = child.rawText || "";
        const value = child.text;
        const i = textIdx++;
        if (value.trim() && HAS_CONTENT.test(value)) {
          visit({ key: `${blockIdx}/${path}#t${i}`, kind: "text", value: value.trim() }, child, { raw, parent: el });
        }
        continue;
      }
      if (child.nodeType !== NodeType.ELEMENT_NODE) continue;
      const i = elIdx++;
      step(child, path === "" ? String(i) : `${path}.${i}`);
    }
  };
  step(blockRoot, "");
}

/* ── ชื่อบล็อก ───────────────────────────────────────────────────────────────
   ลำดับที่ใช้: comment กำกับหน้าบล็อก (ถ้าสั้นและดูเป็นป้ายชื่อจริง) → หัวข้อแรก
   ในบล็อก → "ส่วนที่ N" — comment ในไฟล์พวกนี้บางอันเป็นโน้ตยาวของนักพัฒนา
   ไม่ใช่ชื่อ section จึงต้องคัดออก */
const SECTION_TH = {
  "TOP CONTACT BAR": "แถบติดต่อด้านบน", "CONTACT BAR": "แถบติดต่อด้านบน", "TOP BAR": "แถบติดต่อด้านบน",
  HEADER: "เมนูหลัก", NAV: "เมนูหลัก",
  HERO: "แบนเนอร์หลัก", "HERO SLIDER": "สไลด์แบนเนอร์",
  "CATEGORY ICON ROW": "แถวหมวดสินค้า", "TRUST BAR": "แถบความน่าเชื่อถือ",
  "OUR CLIENTS": "โลโก้ลูกค้า", "BEST SELLERS": "สินค้าขายดี",
  "FEATURE PROMO BAND": "แบนเนอร์โปรโมต", VIDEO: "วิดีโอแนะนำ",
  "WHY US": "ทำไมต้องเลือกเรา", "HOW IT WORKS": "ขั้นตอนการทำงาน",
  "QUOTE BAND": "แถบขอใบเสนอราคา", FOOTER: "ส่วนท้ายเว็บไซต์",
  "STATS STRIP": "แถบตัวเลข", STORY: "เรื่องราวบริษัท", STANDARDS: "มาตรฐาน",
  "PAGE HEAD": "หัวเรื่องหน้า", GRID: "ตารางรายการ", "FILTER SIDEBAR": "แถบตัวกรอง",
};

function cleanComment(raw) {
  if (!raw) return null;
  const s = String(raw).split("\n")[0].replace(/[═─━=–—]{2,}/g, " ").replace(/\s+/g, " ").trim();
  return s || null;
}

function nameOfBlock(el, comment, idx) {
  const c = cleanComment(comment);
  if (c) {
    /* เทียบกับพจนานุกรมก่อนเสมอ แล้วค่อยตัดด้วยความยาว — comment อย่าง
       "HERO SLIDER + OVERLAP SOLUTION CARD" ยาวเกินเกณฑ์ แต่เป็นชื่อ section จริง */
    const up = c.toUpperCase();
    for (const [k, v] of Object.entries(SECTION_TH)) {
      if (up === k || up.startsWith(k + " ") || up.startsWith(k + "/")) return v;
    }
  }
  /* หัวข้อจริงในบล็อกสื่อกับลูกค้าดีกว่า comment ที่นักพัฒนาเขียนไว้คุยกันเอง
     จึงมาก่อน comment ที่ไม่เข้าพจนานุกรม */
  const h = el.querySelector("h1, h2, h3");
  const t = h && h.text.replace(/\s+/g, " ").trim();
  if (t) return t.length > 30 ? t.slice(0, 30) + "…" : t;
  if (c && c.length <= 34) return c;
  return `ส่วนที่ ${idx + 1}`;
}

/* ป้ายกำกับของแต่ละช่องในฟอร์ม — ให้ลูกค้ารู้ว่ากำลังแก้อะไรอยู่ */
function labelOfText(node, ctx) {
  const tag = (ctx.parent?.rawTagName || "").toLowerCase();
  if (/^h[1-3]$/.test(tag)) return "หัวข้อ";
  if (tag === "h4" || tag === "h5") return "หัวข้อย่อย";
  const style = ctx.parent?.getAttribute?.("style") || "";
  if (ctx.parent?.closest?.("a")) return "ปุ่ม/ลิงก์";
  if (/font-weight\s*:\s*(6|7|8|9)00|font-weight\s*:\s*bold/.test(style)) return "หัวข้อย่อย";
  if (/font-size\s*:\s*([3-9]\d|\d{3})px/.test(style)) return "หัวข้อ";
  return "ข้อความ";
}

/* ── ดึงบล็อก + ช่องที่แก้ได้ทั้งหมดของหนึ่งหน้า ─────────────────────────── */
/* หนึ่ง fragment = wrapper ชั้นเดียว ลูกตรงของมันคือ "บล็อก" ที่หลังบ้านโชว์
   ไฟล์ที่เป็น <style> ล้วน (เช่น _lp-head.html) จะไม่มีบล็อกเลย ซึ่งถูกแล้ว
   ตัวนี้ต้องให้ผลลัพธ์เดียวกันทั้งตอน extract และตอน apply ไม่งั้นเลขบล็อกเลื่อน */
function sectionsOf(html) {
  const root = parse(html, { comment: true, blockTextElements: { script: true, style: true } });
  const wrappers = root.childNodes.filter((n) => n.nodeType === NodeType.ELEMENT_NODE);
  const sections = [];
  for (const w of wrappers) {
    if (SKIP_TAGS.has((w.rawTagName || "").toLowerCase())) continue;
    let comment = null;
    let found = false;
    for (const k of w.childNodes) {
      if (k.nodeType === NodeType.COMMENT_NODE) { comment = k.rawText; continue; }
      if (k.nodeType !== NodeType.ELEMENT_NODE) continue;
      if (SKIP_TAGS.has((k.rawTagName || "").toLowerCase())) { comment = null; continue; }
      sections.push({ el: k, comment });
      comment = null;
      found = true;
    }
    if (!found) sections.push({ el: w, comment: null });
  }
  return sections;
}

export function extractBlocks(html) {
  return sectionsOf(html).map(({ el, comment }, idx) => {
    const fields = [];
    walkBlock(el, idx, (f, node, ctx) => {
      const field = { ...f, hash: hashOf(f.value) };
      if (f.kind === "text") field.label = labelOfText(node, ctx);
      else field.label = f.key.endsWith("@bg") ? "รูปพื้นหลัง" : "รูปภาพ";
      fields.push(field);
    });
    return {
      id: String(idx),
      name: nameOfBlock(el, comment, idx),
      tag: (el.rawTagName || "div").toLowerCase(),
      fields,
    };
  });
}

/* ── ทับค่าที่ลูกค้าแก้กลับเข้า HTML ────────────────────────────────────────
   overrides: { [key]: { value, hash, alt } }
   คืน { html, applied, stale } — stale คือกุญแจที่ hash ไม่ตรงกับ HTML ปัจจุบัน

   ตั้งใจ "ตัดต่อสตริงตามตำแหน่ง" แทนการ serialize ต้นไม้ทั้งก้อนกลับออกมา
   เพราะ parser จะ normalize บางอย่างเงียบๆ (เช่น <path/> ใน svg กลายเป็น
   <path></path>) วิธีนี้ทุก byte ที่ไม่ได้ถูกแก้จะเหมือนไฟล์ต้นทางเป๊ะ */

// หาตำแหน่งปิดของแท็กเปิด โดยข้าม > ที่อยู่ในเครื่องหมายคำพูด
function openTagEnd(src, start) {
  let q = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === ">") return i + 1;
  }
  return -1;
}

const ATTR = (name) => new RegExp(`(\\s${name}\\s*=\\s*(["']))(.*?)(\\2)`, "i");

export function applyOverrides(html, overrides) {
  if (!overrides || Object.keys(overrides).length === 0) return { html, applied: 0, stale: [] };

  const sections = sectionsOf(html).map((s) => s.el);
  const edits = [];
  const stale = [];

  sections.forEach((el, idx) => {
    walkBlock(el, idx, (f, node, ctx) => {
      const ov = overrides[f.key];
      if (!ov) return;
      if (ov.hash && ov.hash !== hashOf(f.value)) { stale.push(f.key); return; }

      /* ค่าที่เท่าของเดิมคือไม่ต้องแก้ — ข้ามไปเลย ไม่ใช่แค่ประหยัดงาน แต่กัน
         การเขียนทับที่ทำให้ byte ขยับโดยไม่ได้เปลี่ยนความหมาย (& → &amp;,
         &rsquo; → ’) ซึ่งจะกลายเป็น diff ปลอมเต็มไปหมดเวลาไล่หาปัญหา */
      const sameText = f.kind === "text" && String(ov.value) === f.value;
      const sameImage =
        f.kind === "image" && String(ov.value) === f.value &&
        (ov.alt == null || String(ov.alt) === (f.alt || ""));
      if (sameText || sameImage) return;

      const range = node.range;
      if (!range) return;

      if (f.kind === "text") {
        const raw = html.slice(range[0], range[1]);
        const lead = raw.match(/^\s*/)[0];
        const tail = raw.match(/\s*$/)[0];
        edits.push([range[0], range[1], lead + escapeText(ov.value) + tail]);
        return;
      }

      const tagEnd = openTagEnd(html, range[0]);
      if (tagEnd < 0) return;
      let tag = html.slice(range[0], tagEnd);
      let changed = false;

      if (f.key.endsWith("@img")) {
        const m = tag.match(ATTR("src"));
        if (m) { tag = tag.replace(ATTR("src"), (_x, a, _q, _v, z) => a + escapeAttr(ov.value) + z); changed = true; }
        if (ov.alt != null) {
          if (ATTR("alt").test(tag)) tag = tag.replace(ATTR("alt"), (_x, a, _q, _v, z) => a + escapeAttr(ov.alt) + z);
          else tag = tag.replace(/^<img/i, `<img alt="${escapeAttr(ov.alt)}"`);
          changed = true;
        }
      } else if (f.key.endsWith("@bg")) {
        const m = tag.match(ATTR("style"));
        if (m && BG_URL.test(m[3])) {
          const newStyle = m[3].replace(BG_URL, (_x, a, _q, _u, z) => a + escapeAttr(ov.value) + z);
          tag = tag.replace(ATTR("style"), (_x, a, _q, _v, z) => a + newStyle + z);
          changed = true;
        }
      }

      if (changed) edits.push([range[0], tagEnd, tag]);
    });
  });

  if (!edits.length) return { html, applied: 0, stale };

  edits.sort((a, b) => b[0] - a[0]);
  let out = html;
  let last = Infinity;
  let applied = 0;
  for (const [s0, e0, text] of edits) {
    if (e0 > last) continue; // กันช่วงซ้อนกัน (ไม่ควรเกิด แต่ถ้าเกิดต้องไม่ทำ HTML พัง)
    out = out.slice(0, s0) + text + out.slice(e0);
    last = s0;
    applied++;
  }
  return { html: out, applied, stale };
}

/* ── ติดป้ายบล็อกไว้ใน HTML สำหรับหน้าดูตัวอย่างของหลังบ้าน ──────────────────
   ใช้เฉพาะใน /admin/preview เท่านั้น ห้ามใช้กับ HTML ที่เสิร์ฟให้ผู้ใช้ทั่วไป
   เพื่อไม่ให้ attribute ของเครื่องมือหลุดไปอยู่บนเว็บจริง */
export function markBlocks(html, fragment) {
  const sections = sectionsOf(html).map((s) => s.el);
  const edits = [];
  sections.forEach((el, idx) => {
    if (!el.range) return;
    const tagEnd = openTagEnd(html, el.range[0]);
    if (tagEnd < 0) return;
    const tag = html.slice(el.range[0], tagEnd);
    const marked = tag.replace(/^<([a-zA-Z0-9-]+)/, `<$1 data-cms-block="${fragment}::${idx}"`);
    edits.push([el.range[0], tagEnd, marked]);
  });
  edits.sort((a, b) => b[0] - a[0]);
  let out = html;
  for (const [s0, e0, text] of edits) out = out.slice(0, s0) + text + out.slice(e0);
  return out;
}
