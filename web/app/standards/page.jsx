import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "มาตรฐานการทดสอบ ISO 834 · ASTM E119 · กฎกระทรวง | Infinite Material",
  description:
    "สีกันไฟ Neocoat ผ่านการทดสอบ ISO 834 และ ASTM E119 โดยห้องปฏิบัติการที่ได้รับการรับรอง (FSRG · TÜV SÜD · จุฬาฯ) สอดคล้องกฎกระทรวงข้อ 30 พร้อมดาวน์โหลดผลทดสอบ",
};

export default function Page() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "app", "_content", "standards.html"),
    "utf8"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
