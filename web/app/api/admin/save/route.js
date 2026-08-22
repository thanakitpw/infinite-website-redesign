import { NextResponse } from "next/server";
import { serverClient, currentCmsUser } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

/* บันทึกร่าง — เขียนลง draft_* เท่านั้น ไม่แตะ published_* เว็บจริงจึงไม่ขยับ
   จนกว่าจะกดเผยแพร่ */
export async function POST(request) {
  const user = await currentCmsUser();
  if (!user) return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, { status: 400 }); }

  const { fragment, fields } = body || {};
  if (!fragment || !Array.isArray(fields) || !fields.length) {
    return NextResponse.json({ error: "ต้องระบุ fragment และ fields" }, { status: 400 });
  }
  if (fields.length > 500) {
    return NextResponse.json({ error: "ส่งมาทีเดียวเกิน 500 ช่อง" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const rows = [];
  for (const f of fields) {
    if (!f?.key || !f?.hash) continue;
    if (f.kind !== "text" && f.kind !== "image") continue;
    rows.push({
      fragment,
      field_key: String(f.key),
      kind: f.kind,
      source_hash: String(f.hash),
      draft_value: f.value == null ? null : String(f.value).slice(0, 20000),
      draft_alt: f.alt == null ? null : String(f.alt).slice(0, 500),
      updated_at: now,
      updated_by: user.id,
    });
  }
  if (!rows.length) return NextResponse.json({ error: "ไม่มีช่องที่บันทึกได้" }, { status: 400 });

  const sb = serverClient();
  const { error } = await sb
    .from("content_overrides")
    .upsert(rows, { onConflict: "fragment,field_key" });

  if (error) {
    console.error("[cms] บันทึกร่างไม่สำเร็จ:", error.message);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ — " + error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, saved: rows.length, at: now });
}
