import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "บริการวิศวกรรม ออกแบบ ตรวจสอบ รับรองโครงสร้าง | Infinite Material",
  description:
    "บริการด้านวิชาชีพวิศวกรรมโยธา ตรวจสอบงานออกแบบ ตรวจรับรองอาคารและโรงงาน วิเคราะห์และออกแบบโครงสร้าง รับรองงานฐานราก และรับรองงานสีกันไฟ โดยวุฒิวิศวกร",
};

export default function Page() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "app", "_content", "services.html"),
    "utf8"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
