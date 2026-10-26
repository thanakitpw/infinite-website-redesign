import META from "./_meta.json";

/* วันเผยแพร่ของบทความ แยกจาก _shell.js เพราะ middleware ต้องใช้ด้วย และไม่ควรลาก
   HTML ทั้งก้อนของ _shell.js เข้าไปใน edge bundle

   publishAt แบบ YYYY-MM-DD นับเที่ยงคืนเวลาไทย (เซิร์ฟเวอร์ Vercel รันเป็น UTC)
   ใส่เวลาเต็ม ISO มาก็ได้ ใช้ตอนทดสอบ */
export function isLive(a, now = new Date()) {
  return !!a && (!a.publishAt || new Date(a.publishAt.length > 10 ? a.publishAt : `${a.publishAt}T00:00:00+07:00`) <= now);
}

const BY_SLUG = Object.fromEntries(META.map((a) => [a.slug, a]));

// บทที่มีในทะเบียนแต่ยังไม่ถึงวัน — middleware ตอบ 404 ให้ (ดูเหตุผลใน middleware.js)
export const isScheduled = (slug, now = new Date()) => !!BY_SLUG[slug] && !isLive(BY_SLUG[slug], now);
