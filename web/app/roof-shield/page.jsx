import fs from "node:fs";
import path from "node:path";

/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/roof-shield.html */
const read = (...seg) =>
  fs.readFileSync(path.join(process.cwd(), "app", "_content", ...seg), "utf8");

export const metadata = {
  title: "สีเซรามิคสะท้อนความร้อน Roof Shield | ลดร้อน 93% ประหยัดไฟ 30% ราคาโรงงาน",
  description:
    "สีเซรามิคโค๊ตติ้ง Roof Shield White อะคริลิคสูตรน้ำ สะท้อนรังสีอินฟราเรด ลดความร้อนสูงสุด 93% ลดอุณหภูมิผิวหลังคากว่า 10 องศา ประหยัดค่าไฟกว่า 30% ปรึกษาฟรี",
  // หน้ายิงแอด ไม่ต้องการให้แข่ง ranking กับหน้าสินค้าจริงใน organic
  robots: { index: false, follow: true },
};

export default function LandingPage() {
  const html = read("_lp-head.html") + read("lp", "roof-shield.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
