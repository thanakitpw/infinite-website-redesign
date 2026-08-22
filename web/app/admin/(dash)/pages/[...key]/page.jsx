import { notFound } from "next/navigation";
import { pageByKey, SHARED_FRAGMENTS } from "../../../../../lib/cms/pages";
import { readFragment } from "../../../../../lib/cms/render";
import { extractBlocks } from "../../../../../lib/cms/html";
import { overrideRows } from "../../../../../lib/cms/store";
import Editor from "../../../../../components/admin/editor";

export const dynamic = "force-dynamic";

export default async function EditorPage({ params }) {
  const key = (params.key || []).join("/");
  const page = pageByKey(key);
  if (!page) notFound();

  const rows = await overrideRows(page.fragments);

  /* สกัดบล็อกสดจากไฟล์ทุกครั้งที่เปิดหน้า ไม่ cache — ถ้านักพัฒนาแก้ HTML ทับ
     หลังบ้านต้องเห็นโครงใหม่ทันที ไม่ใช่โครงเก่าที่ค้างอยู่ */
  const fragments = page.fragments
    .map((frag) => ({
      frag,
      shared: SHARED_FRAGMENTS.has(frag),
      blocks: extractBlocks(readFragment(frag)).filter((b) => b.fields.length > 0),
    }))
    .filter((f) => f.blocks.length > 0);

  return <Editor page={page} fragments={fragments} rows={rows} />;
}
