import { NextResponse } from "next/server";
import { serverClient, currentCmsUser } from "../../../../lib/supabase/server";
import { STATUS_KEYS } from "../../../../lib/leads/status";
import { listLeads } from "../../../../lib/leads/store";

export const dynamic = "force-dynamic";

/* รายการใบขอราคา — หน้าเสิร์ฟข้อมูลชุดแรกมาให้แล้ว endpoint นี้ไว้ให้กด
   "โหลดใหม่" หรือหลังแก้สถานะเสร็จ ไม่ต้อง reload ทั้งหน้า */
export async function GET() {
  const user = await currentCmsUser();
  if (!user) return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 401 });

  const leads = await listLeads();
  return NextResponse.json({ leads }, { headers: { "Cache-Control": "no-store" } });
}

/* แก้สถานะหรือบันทึกโน้ตของใบเดียว

   ทีมขายเป็นคนกดเปลี่ยน จึงตรวจ currentCmsUser() ก่อน แล้วเขียนผ่าน
   serverClient() ให้ RLS ตรวจซ้ำอีกชั้น — สองด่านนี้ตั้งใจให้ซ้อนกัน
   ถ้าวันหน้าโค้ดตรงนี้พลาด RLS ยังกันไว้อยู่ */
export async function PATCH(request) {
  const user = await currentCmsUser();
  if (!user) return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const id = Number(body?.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ต้องระบุ id ของใบขอราคา" }, { status: 400 });
  }

  const patch = {};
  if (body.status !== undefined) {
    if (!STATUS_KEYS.includes(body.status)) {
      return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }
    patch.status = body.status;
  }
  if (body.note !== undefined) {
    patch.note = body.note == null ? null : String(body.note).slice(0, 2000);
  }
  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "ไม่มีอะไรให้แก้" }, { status: 400 });
  }

  const sb = serverClient();
  const { data, error } = await sb
    .from("leads")
    .update(patch)
    .eq("id", id)
    .select("id, status, note")
    .maybeSingle();

  if (error) {
    console.error("[leads] แก้ไขไม่สำเร็จ:", error.message);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ — " + error.message }, { status: 500 });
  }
  // RLS ปฏิเสธเงียบๆ จะได้ 0 แถวกลับมา ไม่ใช่ error — ต้องดักเองไม่งั้นหน้าบ้าน
  // จะขึ้นว่าบันทึกสำเร็จทั้งที่ไม่มีอะไรเปลี่ยน
  if (!data) {
    return NextResponse.json({ error: "ไม่พบใบขอราคานี้ หรือไม่มีสิทธิ์แก้ไข" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead: data });
}
