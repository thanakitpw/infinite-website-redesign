import { renderFragments } from "../../lib/cms/render";
/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/four-plus.html */

export const metadata = {
  title: "สีน้ำพลาสติก Four Plus | ทาภายใน ภายนอก รองพื้นปูน อะคริลิก 100% ราคาโรงงาน",
  description:
    "สีน้ำพลาสติก Four Plus อะคริลิกอิมัลชั่น 100% ครบระบบ รองพื้นปูนกันด่าง สีทาภายใน และสีทาภายนอก ถัง 18.925 ลิตร ทาได้ 150 ตร.ม./เที่ยว ผลิตโดยโรงงาน ISO 9001:2015",
  // หน้ายิงแอด ไม่ต้องการให้แข่ง ranking กับหน้าสินค้าจริงใน organic
  robots: { index: false, follow: true },
};

export default async function LandingPage() {
  const html = await renderFragments(["_lp-head.html", "lp/four-plus.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
