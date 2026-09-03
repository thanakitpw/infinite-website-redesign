import { SITE_URL } from "./_data/site";

/* เดิมไม่มีไฟล์นี้เลย /robots.txt ตอบ 404 ซึ่ง crawler ตีความว่า "เข้าได้ทุกหน้า"
   ก็จริง แต่เวลา appeal เรื่องแอดกับ Google ข้อแรกที่เขาให้เช็คคือ robots.txt
   มีไฟล์จริงไว้ตอบดีกว่า */
export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
      /* AdsBot ไม่อ่านกลุ่ม * ต้องเรียกชื่อตรง ๆ ไม่งั้นถือว่าไม่มีกฎให้มัน
         และ Google Ads จะตีตกเป็น "ปลายทางใช้งานไม่ได้" */
      { userAgent: "AdsBot-Google", allow: "/" },
      { userAgent: "AdsBot-Google-Mobile", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
