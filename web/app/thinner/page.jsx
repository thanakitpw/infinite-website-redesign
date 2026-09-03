import { renderFragments } from "../../lib/cms/render";
/* Landing page ยิงแอด — โครง .lp และ CSS ใช้ร่วมกับ /neocoat ผ่าน _lp-head.html
   เนื้อหาของหน้านี้อยู่ที่ _content/lp/thinner.html */

export const metadata = {
  title: "ทินเนอร์ 3A · 2K · น้ำมันสน อินทนิล | ราคาโรงงาน ขายส่ง–ขายปลีก พร้อมส่ง",
  description:
    "ทินเนอร์ AAA (3A) ผสมสีอุตสาหกรรม ทินเนอร์ 2K งานสีพ่นรถยนต์ และน้ำมันสนเชียงใหม่ แบรนด์อินทนิล ขนาด 15 กก. ราคาโรงงาน ขายตรงไม่ผ่านคนกลาง สั่งได้ทั้งขายส่งและขายปลีก",
  /* เคยใส่ robots noindex ไว้กันไม่ให้แข่ง ranking กับหน้าสินค้าจริง แต่ Google Ads
     ตีตกหน้า noindex เป็น "ปลายทางใช้งานไม่ได้" ยิงแอดไม่ได้ทั้ง 7 หน้า
     canonical กันชนกันใน organic ได้เหมือนกันโดยที่หน้ายังยิงแอดได้ */
  alternates: { canonical: "/product/thinner-3a-intanin" },
};

export default async function LandingPage() {
  const html = await renderFragments(["_lp-head.html", "lp/thinner.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
