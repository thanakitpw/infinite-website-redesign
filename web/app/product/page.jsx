import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "สีกันไฟ Neocoat Intumescent Paint สูตรน้ำ/น้ำมัน | ราคาโรงงาน",
  description: "รายละเอียดสีกันไฟ Neocoat Intumescent Paint ทนไฟ 1–2 ชม. มาตรฐาน ISO 834 · ASTM E119 พร้อมสเปกและปริมาณการใช้งาน",
};

export default function Page() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "app", "_content", "product.html"),
    "utf8"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
