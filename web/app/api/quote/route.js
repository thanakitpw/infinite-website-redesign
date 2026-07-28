import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";

/* ── ปลายทางของ lead ────────────────────────────────────────────────────────
   โปรเจคนี้ยังไม่มีฐานข้อมูล และบน Vercel ระบบไฟล์เป็น read-only (เขียนได้แค่
   /tmp ซึ่งหายทุกครั้งที่ instance ถูกรีไซเคิล) การเขียนลง data/leads.json จึง
   ใช้ได้แค่ตอน dev บนเครื่องเท่านั้น

   ทางที่ใช้งานได้จริงบน production โดยไม่ต้องลง dependency เพิ่ม คือยิง POST
   ไปที่ webhook ปลายทางเดียว ตั้งค่าที่ env `LEAD_WEBHOOK_URL`
   ปลายทางที่ใช้ได้เลย: n8n Webhook node · Google Apps Script (เขียนลง Sheet) ·
   Make · Zapier · หรือ endpoint ของทีมเอง

   ลำดับการทำงาน: webhook → ไฟล์ (dev) → ถ้าไม่มีอันไหนสำเร็จ **ห้ามตอบ ok**
   เด็ดขาด ต้องแจ้ง error กลับให้ลูกค้าโทร/แอดไลน์ ไม่ใช่ปล่อยให้เห็นคำว่า
   "ส่งสำเร็จ" แล้วข้อมูลหายไปเงียบๆ (พฤติกรรมเดิมของไฟล์นี้) */
const FILE = path.join(process.cwd(), "data", "leads.json");
const WEBHOOK = process.env.LEAD_WEBHOOK_URL;
const ADMIN_TOKEN = process.env.LEADS_ADMIN_TOKEN;

const FALLBACK_MSG =
  "ระบบบันทึกข้อมูลขัดข้องชั่วคราว กรุณาโทร 02-041-0119 หรือแอด LINE imat999 " +
  "เพื่อไม่ให้คำขอของคุณตกหล่น";

const MAX = {
  name: 120, phone: 40, company: 160, contact: 120,
  jobType: 80, area: 40, hours: 40, detail: 2000, source: 40,
};

// ตัดอักขระควบคุมออก กัน log injection และจำกัดความยาวกันยิง payload ใหญ่
const clean = (v, max) =>
  String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

async function sendToWebhook(lead) {
  if (!WEBHOOK) return false;
  const res = await fetch(WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(8000), // กัน webhook ค้างแล้วลาก function ค้างตาม
  });
  if (!res.ok) throw new Error(`webhook ตอบ ${res.status}`);
  return true;
}

function saveToFile(lead) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  let leads = [];
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf8"));
    if (Array.isArray(parsed)) leads = parsed;
  } catch {
    // ไฟล์ยังไม่มีหรือพัง — เริ่มใหม่เป็น array ว่าง
  }
  leads.push(lead);
  fs.writeFileSync(FILE, JSON.stringify(leads, null, 2), "utf8");
  return true;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const name = clean(body.name, MAX.name);
  const phone = clean(body.phone, MAX.phone);
  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: "กรุณากรอกชื่อและเบอร์โทรติดต่อกลับ" },
      { status: 422 }
    );
  }

  const lead = {
    id: Date.now(),
    name,
    phone,
    company: clean(body.company, MAX.company),
    contact: clean(body.contact, MAX.contact),
    jobType: clean(body.jobType, MAX.jobType),
    area: clean(body.area, MAX.area),
    hours: clean(body.hours, MAX.hours),
    detail: clean(body.detail, MAX.detail),
    source: clean(body.source, MAX.source) || "web",
    receivedAt: new Date().toISOString(),
  };

  const failures = [];
  for (const [label, save] of [["webhook", sendToWebhook], ["file", saveToFile]]) {
    try {
      if (await save(lead)) return NextResponse.json({ ok: true, id: lead.id });
    } catch (e) {
      failures.push(`${label}: ${e?.message || e}`);
    }
  }

  // ไม่มีปลายทางไหนรับได้ — log ตัว lead เต็มๆ ไว้ให้กู้จาก Vercel logs ได้
  // และตอบ error ให้ลูกค้ารู้ ห้ามตอบ ok:true เหมือนเดิมเด็ดขาด
  console.error(
    "[LEAD NOT PERSISTED]",
    JSON.stringify(lead),
    "| ปลายทางที่ล้มเหลว:",
    failures.length ? failures.join(" · ") : "ไม่ได้ตั้ง LEAD_WEBHOOK_URL และเขียนไฟล์ไม่ได้"
  );
  return NextResponse.json({ ok: false, error: FALLBACK_MSG }, { status: 503 });
}

/* รายชื่อ+เบอร์ลูกค้าเป็นข้อมูลส่วนบุคคล เดิม endpoint นี้เปิดให้ใครก็ดึงได้
   ตอนนี้ต้องมี LEADS_ADMIN_TOKEN และส่ง Authorization: Bearer <token> มา
   ถ้าไม่ได้ตั้ง token ไว้ จะตอบ 404 ไปเลย ไม่บอกใบ้ว่ามี endpoint นี้อยู่ */
function tokenMatches(given, expected) {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req) {
  const notFound = () => new NextResponse("Not found", { status: 404 });
  if (!ADMIN_TOKEN) return notFound();

  const auth = req.headers.get("authorization") || "";
  const given = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!given || !tokenMatches(given, ADMIN_TOKEN)) return notFound();

  let leads = [];
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf8"));
    if (Array.isArray(parsed)) leads = parsed;
  } catch {
    // ไม่มีไฟล์ (เช่นบน Vercel) — คืน array ว่าง
  }
  return NextResponse.json(
    { count: leads.length, leads },
    { headers: { "Cache-Control": "no-store" } }
  );
}
