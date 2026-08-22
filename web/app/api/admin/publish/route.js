import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { serverClient, currentCmsUser } from "../../../../lib/supabase/server";
import { revalidateContent } from "../../../../lib/cms/store";
import { PAGES } from "../../../../lib/cms/pages";

export const dynamic = "force-dynamic";

/* เผยแพร่ — ย้ายค่าจาก draft_* ไป published_* แล้วล้าง cache ของหน้าที่เกี่ยวข้อง
   เก็บลง content_revisions ทุกครั้งเพื่อให้ย้อนกลับได้ในเฟสถัดไป */
export async function POST(request) {
  const user = await currentCmsUser();
  if (!user) return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, { status: 400 }); }

  const fragments = Array.isArray(body?.fragments) ? body.fragments.filter(Boolean) : [];
  if (!fragments.length) return NextResponse.json({ error: "ต้องระบุ fragments" }, { status: 400 });

  const sb = serverClient();
  const { data: rows, error: readErr } = await sb
    .from("content_overrides")
    .select("fragment, field_key, kind, source_hash, draft_value, draft_alt, published_value")
    .in("fragment", fragments);

  if (readErr) {
    console.error("[cms] อ่านร่างก่อนเผยแพร่ไม่สำเร็จ:", readErr.message);
    return NextResponse.json({ error: "อ่านข้อมูลไม่สำเร็จ" }, { status: 500 });
  }

  const pending = (rows || []).filter(
    (r) => r.draft_value != null && r.draft_value !== r.published_value
  );
  if (!pending.length) return NextResponse.json({ ok: true, published: 0 });

  const now = new Date().toISOString();

  const { error: upErr } = await sb.from("content_overrides").upsert(
    pending.map((r) => ({
      fragment: r.fragment,
      field_key: r.field_key,
      kind: r.kind,
      source_hash: r.source_hash,
      draft_value: r.draft_value,
      draft_alt: r.draft_alt,
      published_value: r.draft_value,
      published_alt: r.draft_alt,
      published_at: now,
      published_by: user.id,
      updated_at: now,
      updated_by: user.id,
    })),
    { onConflict: "fragment,field_key" }
  );

  if (upErr) {
    console.error("[cms] เผยแพร่ไม่สำเร็จ:", upErr.message);
    return NextResponse.json({ error: "เผยแพร่ไม่สำเร็จ — " + upErr.message }, { status: 500 });
  }

  /* ประวัติเก็บแบบ best-effort — ถ้าเขียนไม่ผ่านก็ไม่ควรทำให้การเผยแพร่ที่สำเร็จ
     ไปแล้วกลายเป็น error ในสายตาลูกค้า */
  const { error: revErr } = await sb.from("content_revisions").insert(
    pending.map((r) => ({
      fragment: r.fragment,
      field_key: r.field_key,
      value: r.draft_value,
      alt: r.draft_alt,
      created_by: user.id,
    }))
  );
  if (revErr) console.error("[cms] บันทึกประวัติไม่สำเร็จ:", revErr.message);

  revalidateContent();
  const touched = PAGES.filter((p) => p.fragments.some((f) => fragments.includes(f)));
  for (const p of touched) {
    try { revalidatePath(p.url); } catch (e) { console.error("[cms] revalidate", p.url, e?.message); }
  }

  return NextResponse.json({ ok: true, published: pending.length, pages: touched.length, at: now });
}
