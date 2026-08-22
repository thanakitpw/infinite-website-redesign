import { NextResponse } from "next/server";
import { serverClient, currentCmsUser } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg" };

/* ชื่อไฟล์ใน storage ต้องเป็น ascii ล้วน ชื่อไทยจะพังตอนทำ URL
   เก็บชื่อเดิมไว้ในคอลัมน์ filename เพื่อให้ลูกค้ายังค้นเจอ */
const safeName = (name) =>
  name.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 60) || "image";

export async function POST(request) {
  const user = await currentCmsUser();
  if (!user) return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 401 });

  let form;
  try { form = await request.formData(); } catch { return NextResponse.json({ error: "อ่านไฟล์ไม่ได้" }, { status: 400 }); }

  const file = form.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });

  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "รองรับเฉพาะ JPG, PNG, WEBP, GIF, SVG" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "ไฟล์ใหญ่เกิน 5 MB" }, { status: 400 });

  const folder = String(form.get("folder") || "ทั่วไป").slice(0, 40);
  const alt = String(form.get("alt") || "").slice(0, 500);

  const base = safeName(file.name.replace(/\.[^.]+$/, ""));
  const path = `${new Date().getFullYear()}/${Date.now()}-${base}.${ext}`;

  const sb = serverClient();
  const { error: upErr } = await sb.storage
    .from("media")
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });

  if (upErr) {
    console.error("[cms] อัปโหลดไม่สำเร็จ:", upErr.message);
    return NextResponse.json({ error: "อัปโหลดไม่สำเร็จ — " + upErr.message }, { status: 500 });
  }

  const { data: pub } = sb.storage.from("media").getPublicUrl(path);

  const { data: row, error: dbErr } = await sb
    .from("media")
    .insert({
      path,
      url: pub.publicUrl,
      filename: file.name.slice(0, 200),
      mime: file.type,
      bytes: file.size,
      alt: alt || null,
      folder,
      created_by: user.id,
    })
    .select()
    .single();

  if (dbErr) {
    // ไฟล์ขึ้นไปแล้วแต่บันทึกทะเบียนไม่ได้ → ลบไฟล์ทิ้ง ไม่ให้เหลือขยะที่ไม่มีใครเห็น
    await sb.storage.from("media").remove([path]);
    console.error("[cms] บันทึกทะเบียนรูปไม่สำเร็จ:", dbErr.message);
    return NextResponse.json({ error: "บันทึกข้อมูลรูปไม่สำเร็จ" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, media: row });
}
