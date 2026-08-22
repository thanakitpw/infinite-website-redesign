import { renderFragments } from "../../lib/cms/render";
/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/fire-blanket.html */

export const metadata = {
  title: "ผ้ากันไฟ ผ้ากันสะเก็ดไฟ Fiberglass Cloth | ทน 550°C–1000°C ตัดตามขนาด",
  description:
    "ผ้ากันไฟใยแก้ว Fiberglass Cloth ทอแบบซาติน อบ 2 ครั้ง ทนอุณหภูมิใช้งาน 550°C และ 1000°C สั่งตัดได้ยาวถึง 100 ม. พร้อมบริการเจาะรูตาไก่ ราคาโรงงาน พร้อมส่งทั่วไทย",
  // หน้ายิงแอด ไม่ต้องการให้แข่ง ranking กับหน้าสินค้าจริงใน organic
  robots: { index: false, follow: true },
};

export default async function LandingPage() {
  const html = await renderFragments(["_lp-head.html", "lp/fire-blanket.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
