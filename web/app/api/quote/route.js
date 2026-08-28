import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";
import { publicClient } from "../../../lib/supabase/public";
import { emailLead, canEmail } from "../../../lib/leads/notify";

export const dynamic = "force-dynamic";

/* ── ปลายทางของ lead ────────────────────────────────────────────────────────
   ที่เก็บถาวรคือตาราง `leads` ใน Supabase (migration 0004) ส่วนอีเมลผ่าน Resend
   เป็นตัวปลุกทีมขาย — แยกหน้าที่กันตั้งใจ เมลล้ม lead ต้องไม่หาย DB ล้มก็ยัง
   ได้เมล ทั้งสองทางล้มพร้อมกันถึงจะตอบ error

   ยังรองรับ `LEAD_WEBHOOK_URL` ไว้เป็นทางสำรอง (n8n / Google Apps Script /
   Make) สำหรับคนที่อยากได้ lead ลง Google Sheet ด้วย ไม่ตั้งก็ข้ามไป
   ส่วนไฟล์ data/leads.json ใช้ได้แค่ตอน dev บนเครื่อง — บน Vercel ระบบไฟล์
   เป็น read-only

   กติกาเดียวที่ห้ามผิด: ถ้าไม่มีปลายทางไหนรับได้เลย **ห้ามตอบ ok** ต้องบอก
   ลูกค้าให้โทร/แอดไลน์ ไม่ใช่ขึ้นว่า "ส่งสำเร็จ" แล้วข้อมูลหายเงียบๆ */
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

/* ที่เก็บหลัก — insert ด้วย anon key ได้เพราะ 0004 เปิด policy เฉพาะ insert
   และ grant เฉพาะคอลัมน์ที่ลูกค้ากรอก อ่านกลับด้วย key นี้ไม่ได้ ต้องล็อกอินหลังบ้าน
   จึงขอ id กลับมาไม่ได้ (select ไม่ผ่าน RLS) — ใช้ .select() ไม่ได้ ต้อง insert เฉยๆ */
async function saveToSupabase(lead) {
  const sb = publicClient();
  if (!sb) return false;
  const { error } = await sb.from("leads").insert({
    name: lead.name,
    phone: lead.phone,
    company: lead.company || null,
    contact: lead.contact || null,
    job_type: lead.jobType || null,
    area: lead.area || null,
    hours: lead.hours || null,
    detail: lead.detail || null,
    source: lead.source,
  });
  if (error) throw new Error(error.message);
  return true;
}

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
  let stored = false;
  for (const [label, save] of [
    ["supabase", saveToSupabase],
    ["webhook", sendToWebhook],
    ["file", saveToFile],
  ]) {
    try {
      if (await save(lead)) { stored = true; break; }
    } catch (e) {
      failures.push(`${label}: ${e?.message || e}`);
    }
  }

  /* เมลส่งเสมอ ไม่ผูกกับผลของการเก็บ — เคสที่กลัวที่สุดคือ DB ล่มแล้วทีมขาย
     ไม่รู้เลยว่ามีคนติดต่อเข้ามา ตราบใดที่เมลถึง lead ก็ยังไม่หาย */
  let mailed = false;
  if (canEmail()) {
    const r = await emailLead(lead);
    mailed = r.ok;
    if (!r.ok) failures.push(`email: ${r.error}`);
  }

  if (stored || mailed) {
    /* เก็บได้แต่เมลไม่ออก = lead ปลอดภัยแต่ทีมขายไม่รู้ตัว ต้องมีร่องรอยไว้เสมอ
       ไม่งั้นวันที่ Resend หมดโควตาหรือ key ถูกถอน จะเงียบไปเป็นเดือนโดยไม่มีใครรู้ */
    if (!mailed && canEmail()) {
      console.error("[LEAD EMAIL FAILED]", `lead ${lead.id} ของ ${lead.name}`, "|", failures.join(" · "));
    }
    return NextResponse.json({ ok: true, id: lead.id });
  }

  // ไม่มีปลายทางไหนรับได้ — log ตัว lead เต็มๆ ไว้ให้กู้จาก Vercel logs ได้
  // และตอบ error ให้ลูกค้ารู้ ห้ามตอบ ok:true เด็ดขาด
  console.error(
    "[LEAD NOT PERSISTED]",
    JSON.stringify(lead),
    "| ปลายทางที่ล้มเหลว:",
    failures.length ? failures.join(" · ") : "ไม่ได้ตั้งปลายทางไว้เลย"
  );
  return NextResponse.json({ ok: false, error: FALLBACK_MSG }, { status: 503 });
}

/* รายชื่อ+เบอร์ลูกค้าเป็นข้อมูลส่วนบุคคล เดิม endpoint นี้เปิดให้ใครก็ดึงได้
   ตอนนี้ต้องมี LEADS_ADMIN_TOKEN และส่ง Authorization: Bearer <token> มา
   ถ้าไม่ได้ตั้ง token ไว้ จะตอบ 404 ไปเลย ไม่บอกใบ้ว่ามี endpoint นี้อยู่

   หมายเหตุ: อ่านได้แค่ไฟล์ตอน dev — ของจริงบน Supabase ต้องดูผ่านหลังบ้าน
   ที่ล็อกอินแล้ว เพราะ anon key อ่านตาราง leads ไม่ได้ตาม RLS */
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
