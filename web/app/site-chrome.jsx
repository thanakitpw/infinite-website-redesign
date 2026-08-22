"use client";
import { usePathname } from "next/navigation";
import LineFab from "./line-fab";
import Enhance from "./enhance";

/* ปุ่มลอย LINE กับสคริปต์ enhance เป็นของเว็บหน้าบ้านเท่านั้น
   enhance ไล่ผูกลิงก์ให้ทุก <div>/<button> ที่ข้อความตรงกติกา ถ้าปล่อยให้รันบน
   หน้าจอหลังบ้าน ปุ่ม "ขอใบเสนอราคา" ในตัวอย่างเนื้อหาจะถูกลากไป /contact
   และปุ่มจริงของหลังบ้านจะโดน stopPropagation จนกดไม่ได้ */
export default function SiteChrome() {
  const pathname = usePathname() || "";
  /* ตัวอย่างเนื้อหาในหลังบ้านต้องได้สคริปต์ชุดเดียวกับเว็บจริง ไม่งั้นสไลด์
     กับเมนูจะนิ่งจนดูไม่ออกว่าของจริงหน้าตาเป็นยังไง */
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/preview")) return null;
  return (
    <>
      <LineFab />
      <Enhance />
    </>
  );
}
