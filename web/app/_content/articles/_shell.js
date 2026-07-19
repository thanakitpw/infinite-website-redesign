// Shared chrome for article detail pages (/articles/[slug]).
// Kept as plain HTML strings so the existing client script (enhance.jsx) can
// linkify contacts/buttons exactly the way it does on every other page.

const CONTACT_BAR = `<div style="background:#018438;color:#eafaf0;display:flex;justify-content:space-between;align-items:center;padding:9px 56px;font-size:13px;font-weight:500"><span>โทร 02-041-0119 · 086-339-4682 · 061-421-5422</span><span>จ–ส 8:00–17:00 · imatthailand@gmail.com</span></div>`;

const HEADER = `<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 56px;border-bottom:1px solid #e7eae4">
  <a href="/" style="display:flex;align-items:center;gap:14px;color:inherit"><img src="/images/logo.jpg" alt="Infinite Material and Technology" style="height:56px;width:auto;display:block;border-radius:6px"><div style="line-height:1.15"><div style="font-weight:700;font-size:16px;letter-spacing:.2px">INFINITE MATERIAL & TECHNOLOGY</div><div style="font-family:'IBM Plex Mono',monospace;font-size:10.5px;letter-spacing:1px;color:#5c6b62">ผู้เชี่ยวชาญสีกันไฟโครงสร้างเหล็ก · NEOCOAT</div></div></a>
  <div style="display:flex;align-items:center;gap:20px;font-size:15px;font-weight:500">
    <a href="/" style="color:#2b382f">หน้าแรก</a>
    <a href="/products" style="color:#2b382f">สินค้า</a>
    <a href="/services" style="color:#2b382f">บริการ</a>
    <a href="/standards" style="color:#2b382f">มาตรฐาน</a>
    <a href="/articles" style="color:#018438;font-weight:600">บทความ</a>
    <a href="/about" style="color:#2b382f">เกี่ยวกับเรา</a>
    <a href="/contact" style="color:#2b382f">ติดต่อ</a>
  </div>
  <a href="/contact" style="background:#018438;color:#fff;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14.5px">ขอใบเสนอราคา</a>
</div>`;

const FOOTER = `<div style="background:#0e1a14;color:#c3cfc7;padding:56px 56px 30px">
  <div style="display:grid;grid-template-columns:1.6fr 1fr 1fr 1.2fr;gap:40px;padding-bottom:36px;border-bottom:1px solid #223228">
    <div><div style="display:flex;align-items:center;gap:11px;margin-bottom:16px"><div style="background:#fff;padding:5px;border-radius:9px;display:inline-flex"><img src="/images/logo.jpg" alt="Infinite Material" style="height:44px;width:auto;display:block"></div><div style="color:#fff;font-weight:700;font-size:15px">INFINITE MATERIAL</div></div><p style="margin:0;font-size:13.5px;line-height:1.75;color:#8ea395">ผู้เชี่ยวชาญสีกันไฟ Neocoat & วัสดุกันไฟครบวงจร มาตรฐาน ISO 834 / ASTM E119 รับรองโดยวุฒิวิศวกรโยธา</p></div>
    <div><div style="color:#fff;font-weight:600;font-size:14px;margin-bottom:15px">สินค้า</div><div style="font-size:13.5px;line-height:2.15;color:#a9bbaf"><a href="/products" style="color:#a9bbaf">สีกันไฟ Neocoat</a><br><a href="/products" style="color:#a9bbaf">สีรองพื้น/ทับหน้า</a><br><a href="/products" style="color:#a9bbaf">ซีเมนต์กันไฟ</a><br><a href="/products" style="color:#a9bbaf">ผ้ากันไฟ</a><br><a href="/products" style="color:#a9bbaf">สีเซรามิคสะท้อนความร้อน</a></div></div>
    <div><div style="color:#fff;font-weight:600;font-size:14px;margin-bottom:15px">บริษัท</div><div style="font-size:13.5px;line-height:2.15;color:#a9bbaf"><a href="/about" style="color:#a9bbaf">เกี่ยวกับเรา</a><br><a href="/articles" style="color:#a9bbaf">บทความ/ความรู้</a><br><a href="/about" style="color:#a9bbaf">ผลงาน/อ้างอิง</a><br><a href="/standards" style="color:#a9bbaf">มาตรฐาน/ใบรับรอง</a><br><a href="/contact" style="color:#a9bbaf">ติดต่อเรา</a></div></div>
    <div><div style="color:#fff;font-weight:600;font-size:14px;margin-bottom:15px">ติดต่อ</div><div style="font-size:13.5px;line-height:1.95;color:#a9bbaf">โทร 02-041-0119, 086-339-4682<br>LINE: imat999 / blue999<br>imatthailand@gmail.com<br>เขตคลองสามวา กรุงเทพฯ 10510</div></div>
  </div>
  <div style="padding-top:22px;font-size:12px;color:#6f8479;text-align:center">© 2026 บริษัท อินฟินิท แมททีเรียล แอนด์ เทคโนโลยี จำกัด · นโยบายความเป็นส่วนตัว · Sitemap</div>
</div>`;

// Article catalogue — single source of truth for detail pages + related lists.
export const ARTICLES = [
  { slug: "what-is-fireproof-paint", title: "สีกันไฟคืออะไร ทำงานอย่างไร แบบเข้าใจง่าย", cat: "ความรู้พื้นฐาน", date: "10 ก.ค. 2026", read: "5 นาที", image: "/images/work-spray-steel.png", fit: "cover", excerpt: "ทำความรู้จักหลักการ “พองตัวเป็นฉนวน” (intumescent) ที่ช่วยหน่วงเวลาการวิบัติของโครงสร้างเหล็กเมื่อเกิดเพลิงไหม้", related: ["iso834-astm-e119", "cement-vs-fireproof-paint", "fire-rating-hours"] },
  { slug: "fire-rating-hours", title: "สีกันไฟทนไฟได้กี่ชั่วโมง เลือกอย่างไรให้ผ่านกฎหมาย", cat: "มาตรฐาน & กฎหมาย", date: "3 ก.ค. 2026", read: "6 นาที", image: "/images/cert-fsrg.png", fit: "contain", excerpt: "แนวทางเลือกชั่วโมงทนไฟให้ตรงกับกฎกระทรวงและประเภทอาคาร", related: ["iso834-astm-e119", "calculate-fireproof-paint", "what-is-fireproof-paint"] },
  { slug: "water-vs-solvent-based", title: "สีกันไฟสูตรน้ำ vs สูตรน้ำมัน ต่างกันอย่างไร", cat: "วิธีเลือก/คำนวณ", date: "26 มิ.ย. 2026", read: "5 นาที", image: "/images/paint-promo-banner.jpg", fit: "cover", excerpt: "เปรียบเทียบข้อดี–ข้อจำกัด และงานที่เหมาะกับแต่ละสูตร", related: ["what-is-fireproof-paint", "fireproof-application-steps", "calculate-fireproof-paint"] },
  { slug: "calculate-fireproof-paint", title: "วิธีคำนวณปริมาณสีกันไฟ / ราคาต่อตารางเมตร", cat: "วิธีเลือก/คำนวณ", date: "19 มิ.ย. 2026", read: "7 นาที", image: "/images/neocoat-paint-s.png", fit: "contain", excerpt: "สูตรคำนวณจำนวนถังจากพื้นที่ผิวเหล็กและความหนาที่ต้องการ", related: ["fire-rating-hours", "water-vs-solvent-based", "fireproof-application-steps"] },
  { slug: "iso834-astm-e119", title: "มาตรฐาน ISO 834 และ ASTM E119 อธิบายง่ายๆ", cat: "มาตรฐาน & กฎหมาย", date: "12 มิ.ย. 2026", read: "6 นาที", image: "/images/steel-truss-2.jpg", fit: "cover", excerpt: "ทั้งสองมาตรฐานทดสอบอะไร ต่างกันตรงไหน และอ่านผลอย่างไร", related: ["fire-rating-hours", "what-is-fireproof-paint", "cement-vs-fireproof-paint"] },
  { slug: "fireproof-application-steps", title: "ขั้นตอนการทา/พ่นสีกันไฟโครงสร้างเหล็กที่ถูกต้อง", cat: "ขั้นตอนงานติดตั้ง", date: "5 มิ.ย. 2026", read: "7 นาที", image: "/images/work-roof-factory.png", fit: "cover", excerpt: "ตั้งแต่เตรียมผิว รองพื้น จนถึงคุมความหนาฟิล์มให้ได้มาตรฐาน", related: ["calculate-fireproof-paint", "water-vs-solvent-based", "what-is-fireproof-paint"] },
  { slug: "cement-vs-fireproof-paint", title: "ซีเมนต์กันไฟ vs สีกันไฟ เลือกแบบไหนดี", cat: "ความรู้พื้นฐาน", date: "29 พ.ค. 2026", read: "5 นาที", image: "/images/fendolite-m2.png", fit: "contain", excerpt: "เทียบการใช้งาน ต้นทุน และความเหมาะสมกับแต่ละประเภทงาน", related: ["what-is-fireproof-paint", "fire-rating-hours", "iso834-astm-e119"] },
];

const BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

function imgBox(image, fit, h) {
  const bg = fit === "contain" ? "#ffffff" : "#eef4ef";
  return `background:${bg};background-image:url('${image}');background-size:${fit || "cover"};background-position:center;background-repeat:no-repeat;height:${h}px`;
}

function hero(a) {
  return `<div style="background:#06351f;color:#fff;padding:40px 56px 44px"><div style="max-width:820px;margin:0 auto">
    <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#8fe8b3;margin-bottom:16px"><a href="/" style="color:#8fe8b3">หน้าแรก</a> / <a href="/articles" style="color:#8fe8b3">บทความ</a> / ${a.cat}</div>
    <span style="display:inline-block;background:#018438;color:#fff;font-size:12px;font-weight:600;padding:5px 14px;border-radius:999px;margin-bottom:18px">${a.cat}</span>
    <h1 style="margin:0 0 18px;font-size:33px;font-weight:700;line-height:1.4;letter-spacing:-.2px">${a.title}</h1>
    <div style="font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:#a9c6b5">${a.date} · อ่าน ${a.read} · โดยทีมวิศวกร Infinite</div>
  </div></div>`;
}

function cta() {
  return `<div style="background:#06351f;border-radius:18px;padding:32px 36px;margin:44px 0 4px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap">
    <div style="max-width:560px"><div style="color:#fff;font-size:21px;font-weight:700;margin-bottom:8px">ต้องการคำปรึกษาหรือใบเสนอราคางานกันไฟ?</div><div style="color:#a9c6b5;font-size:15px;line-height:1.7">ทีมวิศวกรช่วยคำนวณปริมาณ ความหนาฟิล์ม และชั่วโมงทนไฟให้ตรงมาตรฐาน — ฟรี ไม่มีค่าใช้จ่าย</div></div>
    <a href="/contact" style="background:#12b459;color:#04140c;padding:15px 30px;border-radius:11px;font-weight:700;font-size:15.5px;white-space:nowrap">ขอใบเสนอราคา</a>
  </div>`;
}

function related(a) {
  const cards = (a.related || [])
    .map((slug) => BY_SLUG[slug])
    .filter(Boolean)
    .map((r) => `<a href="/articles/${r.slug}" style="border:1px solid #e7eae4;border-radius:16px;overflow:hidden;color:inherit;display:block"><div style="${imgBox(r.image, r.fit, 150)}"></div><div style="padding:20px"><div style="font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:#8a978d;margin-bottom:9px">${r.cat} · ${r.date}</div><div style="font-size:16.5px;font-weight:600;line-height:1.45;margin-bottom:10px">${r.title}</div><span style="color:#018438;font-weight:600;font-size:14px">อ่านต่อ →</span></div></a>`)
    .join("");
  if (!cards) return "";
  return `<div style="background:#f7faf8;border-top:1px solid #e7eae4;padding:46px 56px 56px"><div style="max-width:1120px;margin:0 auto"><div style="font-size:22px;font-weight:700;margin-bottom:22px;color:#0e1a14">บทความที่เกี่ยวข้อง</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">${cards}</div></div></div>`;
}

// Wrap the per-article body (read from _content/articles/<slug>.html) with the
// shared page chrome and return one HTML string for dangerouslySetInnerHTML.
export function renderArticlePage(a, body) {
  return `<div style="width:1440px;margin:0 auto;background:#fff;color:#0e1a14">${CONTACT_BAR}${HEADER}${hero(a)}<div style="padding:46px 56px 10px"><div style="max-width:820px;margin:0 auto">${body}${cta()}</div></div>${related(a)}${FOOTER}</div>`;
}
