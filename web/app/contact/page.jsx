import { renderFragments } from "../../lib/cms/render";

export const metadata = {
  title: "ติดต่อเรา / ขอใบเสนอราคา | Infinite Material & Technology",
  description: "ติดต่อขอใบเสนอราคาสีกันไฟ Neocoat โทร 02-041-0119 · 086-339-4682 · LINE พร้อมทีมวิศวกรให้คำปรึกษา",
};

export default async function Page() {
  const html = await renderFragments(["contact.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
