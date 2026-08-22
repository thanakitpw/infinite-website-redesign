import { renderFragments } from "../../lib/cms/render";

export const metadata = {
  title: "มาตรฐานการทดสอบ ISO 834 · ASTM E119 · กฎกระทรวง | Infinite Material",
  description:
    "สีกันไฟ Neocoat ผ่านการทดสอบ ISO 834 และ ASTM E119 โดยห้องปฏิบัติการที่ได้รับการรับรอง (FSRG · TÜV SÜD · จุฬาฯ) สอดคล้องกฎกระทรวงข้อ 30 พร้อมดาวน์โหลดผลทดสอบ",
};

export default async function Page() {
  const html = await renderFragments(["standards.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
