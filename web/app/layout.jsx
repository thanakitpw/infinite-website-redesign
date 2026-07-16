import "./globals.css";
import Enhance from "./enhance";

export const metadata = {
  title: "Infinite Material & Technology",
  description: "ผู้เชี่ยวชาญสีกันไฟโครงสร้างเหล็ก Neocoat มาตรฐาน ISO 834 · ASTM E119",
  icons: { icon: "/images/logo.jpg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Anuphan:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Enhance />
      </body>
    </html>
  );
}
