import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "บทความ & ความรู้เรื่องสีกันไฟ | Infinite Material & Technology",
  description: "บทความให้ความรู้เรื่องสีกันไฟ วิธีเลือก วิธีคำนวณปริมาณ มาตรฐาน ISO 834 · ASTM E119 และการใช้งานวัสดุกันไฟ",
};

export default function Page() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "app", "_content", "articles.html"),
    "utf8"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
