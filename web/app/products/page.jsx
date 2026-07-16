import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "สินค้าสีกันไฟ & วัสดุกันไฟครบวงจร | Infinite Material & Technology",
  description: "รวมสินค้าสีกันไฟ Neocoat สีรองพื้น ทินเนอร์ ซีเมนต์กันไฟ ผ้ากันไฟ Fiberglass และสีเซรามิคสะท้อนความร้อน ราคาโรงงาน",
};

export default function Page() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "app", "_content", "products.html"),
    "utf8"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
