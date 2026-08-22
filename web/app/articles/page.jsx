import { renderFragments } from "../../lib/cms/render";

export const metadata = {
  title: "บทความ & ความรู้เรื่องสีกันไฟ | Infinite Material & Technology",
  description: "บทความให้ความรู้เรื่องสีกันไฟ วิธีเลือก วิธีคำนวณปริมาณ มาตรฐาน ISO 834 · ASTM E119 และการใช้งานวัสดุกันไฟ",
};

export default async function Page() {
  const html = await renderFragments(["articles.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
