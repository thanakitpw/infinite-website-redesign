import { notFound } from "next/navigation";
import { renderPreview } from "../../../../lib/cms/render";
import { pageByKey } from "../../../../lib/cms/pages";
import PreviewBridge from "./bridge";

export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

/* หน้าเว็บจริงพร้อมร่างที่ยังไม่เผยแพร่ ใช้เป็นเนื้อใน iframe ของหน้าแก้ไข
   คนนอกเข้าไม่ได้ — middleware กัน /admin/* ไว้ทั้งชั้นแล้ว */
export default async function PreviewPage({ params }) {
  const key = (params.key || []).join("/");
  if (!pageByKey(key)) notFound();

  const html = await renderPreview(key);
  if (html == null) notFound();

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <PreviewBridge />
    </>
  );
}
