import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { serverClient, currentCmsUser } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const IMG = /\.(jpe?g|png|webp|gif|svg|avif)$/i;

/* รูปเดิมของเว็บที่อยู่ใน public/images — ลูกค้าต้องเลือกใช้ซ้ำได้ ไม่ใช่เห็นแค่
   รูปที่อัปโหลดใหม่ผ่านหลังบ้าน ไฟล์พวกนี้แก้ไม่ได้ (อยู่ใน repo) จึงส่ง
   readOnly ไปด้วยให้ฝั่งหน้าจอไม่ต้องโชว์ปุ่มลบ */
function localImages() {
  const base = path.join(process.cwd(), "public", "images");
  const out = [];
  const walk = (dir, prefix) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { walk(full, `${prefix}${e.name}/`); continue; }
      if (!IMG.test(e.name)) continue;
      let bytes = 0;
      try { bytes = fs.statSync(full).size; } catch {}
      out.push({
        id: `local:${prefix}${e.name}`,
        url: `/images/${prefix}${e.name}`,
        filename: e.name,
        folder: prefix ? prefix.replace(/\/$/, "") : "รูปเดิมของเว็บ",
        bytes,
        readOnly: true,
      });
    }
  };
  walk(base, "");
  return out.sort((a, b) => a.filename.localeCompare(b.filename));
}

export async function GET(request) {
  const user = await currentCmsUser();
  if (!user) return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 401 });

  const sb = serverClient();
  const { data, error } = await sb
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) console.error("[cms] อ่านคลังรูปไม่สำเร็จ:", error.message);

  const uploaded = (data || []).map((m) => ({ ...m, readOnly: false }));
  return NextResponse.json({ ok: true, uploaded, local: localImages() });
}
