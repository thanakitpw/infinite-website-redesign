import { renderFragments } from "../../lib/cms/render";

export const metadata = {
  title: "สินค้าสีกันไฟ & วัสดุกันไฟครบวงจร | Infinite Material & Technology",
  description: "รวมสินค้าสีกันไฟ Neocoat สีรองพื้น ทินเนอร์ ซีเมนต์กันไฟ ผ้ากันไฟ Fiberglass และสีเซรามิคสะท้อนความร้อน ราคาโรงงาน",
};

export default async function Page() {
  const html = await renderFragments(["products.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
