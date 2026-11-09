import "./globals.css";
import SiteChrome from "./site-chrome";
import { SITE_URL } from "./_data/site";

export const metadata = {
  /* ต้องมี ไม่งั้น alternates.canonical ของหน้า landing ที่เขียนเป็น path สั้น ๆ
     จะถูก resolve เป็น localhost ตอน build */
  metadataBase: new URL(SITE_URL),
  title: "Infinite Material & Technology",
  description: "ผู้เชี่ยวชาญสีกันไฟโครงสร้างเหล็ก Neocoat มาตรฐาน ISO 834 · ASTM E119",
  icons: { icon: "/images/logo.jpg" },
};

/* GTM_ID   = container เดิมของลูกค้า เก็บ Google Ads (AW-850421119) + conversion
   GA4_TAG  = Google tag ของ GA4 property ใหม่ (G-0T6Y3TF0TR) ที่ Google เสิร์ฟผ่าน
              gtm.js — config ของ GA4 อยู่ในตัว tag ไม่ต้องเรียก gtag('config')
   สองตัวใช้ dataLayer ร่วมกัน event ที่ enhance.jsx ส่งจึงถึงทั้งคู่ */
const GTM_ID = "GTM-W73HFKV";
const GA4_TAG = "GTM-WNRS2QXV";

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google tag (GA4) */}
        <script async src={`https://www.googletagmanager.com/gtm.js?id=${GA4_TAG}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`,
          }}
        />
        {/* End Google tag */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Anuphan:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
        <SiteChrome />
      </body>
    </html>
  );
}
