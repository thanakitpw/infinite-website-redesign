/* ส่งอีเมลแจ้งทีมขายเมื่อมีคนกรอกฟอร์มขอใบเสนอราคา

   ยิง REST ของ Resend ตรงๆ ไม่ลง package `resend` เพิ่ม — เรียกอยู่จุดเดียว
   และ payload มีแค่ 5 ฟิลด์ การลง dependency เพื่อ wrapper บางๆ ไม่คุ้ม
   (โปรเจคนี้ตั้งใจคุม dependency ให้น้อยตามที่เขียนไว้ใน route เดิม)

   เมลเป็น "ตัวปลุก" ไม่ใช่ที่เก็บข้อมูล — ที่เก็บจริงคือตาราง leads ใน Supabase
   ฟังก์ชันนี้จึงห้าม throw ออกไปทำให้ฟอร์มพัง คืน {ok,error} ให้ผู้เรียกตัดสินใจ */

const API = "https://api.resend.com/emails";
const KEY = process.env.RESEND_API_KEY;

// ยังไม่ได้ verify โดเมนใน Resend ก็ยังส่งได้ด้วย onboarding@resend.dev
// แต่จะส่งได้เฉพาะเข้าอีเมลเจ้าของบัญชี Resend เท่านั้น (ข้อจำกัดของ Resend เอง)
const FROM = process.env.LEAD_EMAIL_FROM || "Infinite Material <onboarding@resend.dev>";
const TO = (process.env.LEAD_EMAIL_TO || "imatthailand@gmail.com")
  .split(",").map((s) => s.trim()).filter(Boolean);

const esc = (v) =>
  String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const FIELDS = [
  ["ชื่อผู้ติดต่อ", "name"],
  ["เบอร์โทร", "phone"],
  ["บริษัท/หน่วยงาน", "company"],
  ["LINE ID / อีเมล", "contact"],
  ["ประเภทงาน", "jobType"],
  ["พื้นที่โดยประมาณ", "area"],
  ["ชั่วโมงกันไฟ", "hours"],
  ["รายละเอียดเพิ่มเติม", "detail"],
];

/* ลูกค้าอาจกรอกอีเมลมาในช่อง "LINE ID / อีเมล" ถ้าใช่ก็ตั้งเป็น reply-to
   ให้ทีมขายกด reply ตอบกลับได้ทันทีโดยไม่ต้องก๊อปอีเมลออกมา */
const emailIn = (s) => (String(s || "").match(/[^\s@]+@[^\s@]+\.[^\s@]+/) || [])[0];

function html(lead) {
  const rows = FIELDS
    .filter(([, k]) => lead[k])
    .map(
      ([label, k]) =>
        `<tr><td style="padding:9px 14px;background:#f6f8f6;color:#5c6b62;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>` +
        `<td style="padding:9px 14px;color:#0e1a14;font-size:14px;font-weight:600">${esc(lead[k]).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");

  const tel = esc(String(lead.phone).replace(/[^\d+]/g, ""));
  return `<div style="font-family:'IBM Plex Sans Thai',-apple-system,Segoe UI,sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#018438;color:#fff;padding:20px 24px;border-radius:14px 14px 0 0">
    <div style="font-size:12px;opacity:.85;letter-spacing:.4px">INFINITE MATERIAL &amp; TECHNOLOGY</div>
    <div style="font-size:20px;font-weight:700;margin-top:4px">มีคำขอใบเสนอราคาใหม่</div>
  </div>
  <div style="border:1px solid #e4eae5;border-top:none;border-radius:0 0 14px 14px;padding:20px 24px">
    <table style="width:100%;border-collapse:separate;border-spacing:0 6px">${rows}</table>
    <div style="margin-top:18px;padding-top:16px;border-top:1px solid #eef1ec;font-size:12.5px;color:#8a978d">
      ส่งจากฟอร์ม <strong>${esc(lead.source || "web")}</strong> เมื่อ ${esc(
        new Date(lead.receivedAt || Date.now()).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })
      )}${lead.id ? ` · lead #${esc(lead.id)}` : ""}
    </div>
    <a href="tel:${tel}" style="display:inline-block;margin-top:16px;background:#018438;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14.5px">โทรกลับ ${esc(lead.phone)}</a>
  </div>
</div>`;
}

function text(lead) {
  return (
    "มีคำขอใบเสนอราคาใหม่\n\n" +
    FIELDS.filter(([, k]) => lead[k]).map(([label, k]) => `${label}: ${lead[k]}`).join("\n") +
    `\n\nส่งจากฟอร์ม ${lead.source || "web"} เมื่อ ` +
    new Date(lead.receivedAt || Date.now()).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })
  );
}

export const canEmail = () => Boolean(KEY && TO.length);

export async function emailLead(lead) {
  if (!canEmail()) return { ok: false, error: "ยังไม่ได้ตั้ง RESEND_API_KEY หรือ LEAD_EMAIL_TO" };

  const replyTo = emailIn(lead.contact);
  const body = {
    from: FROM,
    to: TO,
    subject: `[ขอใบเสนอราคา] ${lead.name}${lead.company ? ` · ${lead.company}` : ""} · ${lead.phone}`,
    html: html(lead),
    text: text(lead),
  };
  if (replyTo) body.reply_to = replyTo;

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // เมลค้างต้องไม่ลากให้ฟอร์มค้างตาม ลูกค้ารอเกินนี้ก็คิดว่าเว็บเสียแล้ว
      signal: AbortSignal.timeout(8000),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: out.message || `Resend ตอบ ${res.status}` };
    return { ok: true, id: out.id };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
}
