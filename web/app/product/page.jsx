import { redirect } from "next/navigation";

/* /product เป็น URL เดิมสมัยที่ทั้งเว็บมีหน้าสินค้าหน้าเดียว ตอนนี้สินค้าแต่ละตัว
   มีหน้าของตัวเองที่ /product/<slug> แล้ว จึงส่งต่อไปหน้า Neocoat-S ซึ่งเป็นตัว
   ขายดี เพื่อไม่ให้เหลือหน้าเนื้อหาซ้ำกันสองหน้า */
export default function Page() {
  redirect("/product/neocoat-intumescent-paint-s");
}
