import { renderFragments } from "../../lib/cms/render";

export const metadata = {
  title: "บริการวิศวกรรม ออกแบบ ตรวจสอบ รับรองโครงสร้าง | Infinite Material",
  description:
    "บริการด้านวิชาชีพวิศวกรรมโยธา ตรวจสอบงานออกแบบ ตรวจรับรองอาคารและโรงงาน วิเคราะห์และออกแบบโครงสร้าง รับรองงานฐานราก และรับรองงานสีกันไฟ โดยวุฒิวิศวกร",
};

export default async function Page() {
  const html = await renderFragments(["services.html"]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
