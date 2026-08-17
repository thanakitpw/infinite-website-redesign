import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "สีกันไฟโครงสร้างเหล็ก Neocoat | ทนไฟ 1–3 ชม. ตามกฎกระทรวง 2566 — ประเมินราคาฟรี",
  description:
    "สีกันไฟ Neocoat Intumescent Paint สูตรน้ำมัน/สูตรน้ำ Low VOC ผ่านทดสอบ ISO 834 · ASTM E119 จาก FSRG · TÜV SÜD · จุฬาฯ วิศวกรโยธาคำนวณความหนาและออกเอกสารรับรองให้ ปรึกษาฟรี",
  // หน้ายิงแอด ไม่ต้องการให้แข่ง ranking กับหน้าสินค้าจริงใน organic
  robots: { index: false, follow: true },
};

export default function LandingPage() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "app", "_content", "neocoat.html"),
    "utf8"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
