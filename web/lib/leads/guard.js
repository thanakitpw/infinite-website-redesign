/* กันสแปมให้ฟอร์มขอใบเสนอราคา — ทำงานฝั่ง server เท่านั้น

   ลูกค้าของที่นี่คือโรงงาน/ผู้รับเหมาในไทย ทีมขายโทรกลับด้วยเบอร์ไทย สัญญาณ
   "ไม่ใช่ลูกค้า" จึงชัดกว่าเว็บทั่วไป แต่ก็ไม่ตัดทิ้งด้วยสัญญาณเดียว — ลูกค้าจริงอาจ
   แปะลิงก์ Google Maps ของไซต์งาน หรือกรอกจากต่างประเทศตอนเดินทาง จึงใช้วิธี
   ให้คะแนนรวม: ชัดเจนว่าเป็นบอทถึงทิ้ง ก้ำกึ่งให้ส่งต่อพร้อมป้าย "อาจเป็นสแปม"
   ให้ทีมขายตัดสินเอง ดีกว่าปล่อยให้ lead จริงหายเงียบ

   สองด่านที่ทิ้งทันทีโดยไม่ต้องนับคะแนน:
   - honeypot: ช่อง `website` ที่ซ่อนไว้ คนมองไม่เห็นจึงไม่กรอก บอทที่เติมทุกช่องจะกรอก
   - เวลากรอก: หน้าเว็บส่ง `elapsed` (ms ตั้งแต่ฟอร์มพร้อมจนกด) มาด้วย
     ต่ำกว่า 3 วินาที คนกรอกชื่อ+เบอร์ไม่ทันแน่ */

const MIN_FILL_MS = 3000;
const DROP_AT = 3; // คะแนนตั้งแต่นี้ = ทิ้ง
const FLAG_AT = 1; // คะแนนตั้งแต่นี้ = ส่งต่อพร้อมป้ายเตือน

const URL_RE = /https?:\/\/|www\.|\.(?:com|net|org|ru|xyz|io|info|biz|top|site|online|shop|club|link)\b/i;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;

/* เบอร์ไทย: 0 ตามด้วย 8-9 หลัก (02-xxx-xxxx = 9 หลัก, 08x/09x/06x = 10 หลัก)
   หรือขึ้นด้วย +66/66 แล้วตัด 0 ตัวแรก ลูกค้าชอบพิมพ์ "02-041-0119 ต่อ 12" จึงหา
   เบอร์แรกที่เข้ารูปในสตริง ไม่เอาทั้งก้อนมาเทียบ */
export function isThaiPhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  const local = digits.startsWith("66") ? "0" + digits.slice(2) : digits;
  return /^0[2-9]\d{7,8}/.test(local);
}

const cyrillicRatio = (s) => {
  const letters = (s.match(/\p{L}/gu) || []).length;
  if (!letters) return 0;
  return (s.match(/[Ѐ-ӿ]/g) || []).length / letters;
};

/* คืน { drop, flag, reasons } — reasons เป็นภาษาไทยเพราะไปโผล่ในเมลถึงทีมขาย
   ctx: { honeypot, elapsed, country } มาจาก body/headers ไม่ใช่ตัว lead */
export function scoreLead(lead, ctx = {}) {
  const reasons = [];

  if (String(ctx.honeypot || "").trim()) {
    return { drop: true, flag: false, reasons: ["กรอกช่องที่ซ่อนไว้ (honeypot)"] };
  }
  const elapsed = Number(ctx.elapsed);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) {
    return { drop: true, flag: false, reasons: [`กรอกเสร็จใน ${Math.round(elapsed / 100) / 10} วินาที`] };
  }

  let score = 0;
  const add = (n, why) => { score += n; reasons.push(why); };

  // ไม่มี elapsed เลย = ไม่ได้มาจากหน้าเว็บ (ยิง API ตรง) หรือ JS เก่าค้างใน cache
  // ตอน deploy — อย่างหลังเกิดได้จริงจึงให้แค่ 2 ไม่ทิ้งทันที
  if (!Number.isFinite(elapsed)) add(2, "ไม่ได้ส่งผ่านฟอร์มบนหน้าเว็บ");

  const country = String(ctx.country || "").toUpperCase();
  if (country && country !== "TH") add(1, `กรอกจากนอกไทย (${country})`);

  if (!isThaiPhone(lead.phone)) add(1, "เบอร์ไม่ใช่รูปแบบเบอร์ไทย");

  const prose = [lead.name, lead.company, lead.detail].filter(Boolean).join("\n");
  if (URL_RE.test(prose)) add(1, "มีลิงก์ในชื่อ/บริษัท/รายละเอียด");
  if (EMAIL_RE.test(lead.name || "")) add(1, "ช่องชื่อเป็นอีเมล");
  // ช่อง LINE/อีเมล ใส่อีเมลได้ แต่ถ้าเป็นลิงก์ (t.me, bit.ly) แปลว่าไม่ใช่ลูกค้า
  if (lead.contact && !EMAIL_RE.test(lead.contact) && URL_RE.test(lead.contact)) add(1, "ช่องติดต่อเป็นลิงก์");
  if (cyrillicRatio(prose) > 0.3) add(2, "ข้อความเป็นภาษารัสเซีย/ซีริลลิก");

  return { drop: score >= DROP_AT, flag: score >= FLAG_AT, reasons };
}

/* ── rate limit ต่อ IP ─────────────────────────────────────────────────────
   เก็บใน memory ของ instance — บน Vercel แต่ละ instance นับแยกกันและหายตอน
   cold start จึงเป็นแค่ด่านแรกกันยิงรัว ไม่ใช่กำแพงจริง (ของจริงคือ WAF rate limit
   ในหน้า Vercel) ฟอร์มนี้มี lead วันละไม่กี่ราย โควตา 5 ครั้ง/10 นาที/IP เหลือเฟือ
   สำหรับคนจริง แม้จะส่งซ้ำเพราะกดผิด */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

export function rateLimited(ip, now = Date.now()) {
  if (!ip) return false;
  const cutoff = now - WINDOW_MS;
  // ล้างของเก่าทั้ง Map ทุกครั้ง — จำนวน IP ในช่วง 10 นาทีน้อยมาก ไม่คุ้มทำ timer แยก
  for (const [k, ts] of hits) {
    const keep = ts.filter((t) => t > cutoff);
    if (keep.length) hits.set(k, keep); else hits.delete(k);
  }
  const ts = hits.get(ip) || [];
  ts.push(now);
  hits.set(ip, ts);
  return ts.length > MAX_PER_WINDOW;
}

export function clientIp(req) {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
}
