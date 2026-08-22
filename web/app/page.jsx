import { renderFragments } from "../lib/cms/render";

export const metadata = {
  title: "สีกันไฟ Neocoat มาตรฐาน ISO 834 | ราคาโรงงาน รับรองโดยวิศวกร",
  description: "สีกันไฟโครงสร้างเหล็ก Neocoat Intumescent Paint สูตรน้ำ/น้ำมัน ทนไฟ 1–3 ชม. มาตรฐาน ISO 834 · ASTM E119 รับรองโดยวิศวกรโยธา",
};

export default async function Page() {
  const html = await renderFragments(["home.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
