import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "ติดต่อเรา / ขอใบเสนอราคา | Infinite Material & Technology",
  description: "ติดต่อขอใบเสนอราคาสีกันไฟ Neocoat โทร 02-041-0119 · 086-339-4682 · LINE พร้อมทีมวิศวกรให้คำปรึกษา",
};

export default function Page() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "app", "_content", "contact.html"),
    "utf8"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
