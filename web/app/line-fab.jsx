/* ปุ่มติดต่อลอยมุมขวาล่าง — แสดงทุกหน้าเพราะ render จาก layout.jsx
   ปุ่มกลม กดเปิด/ปิด ข้างในมีเบอร์โทรและปุ่มแอดไลน์

   ใช้ <details>/<summary> แทนปุ่ม + state ของ React ตั้งใจ:
   - ได้พฤติกรรมกดเปิด/ปิดมาฟรี ไม่ต้องเป็น client component
   - ใช้ได้บนจอสัมผัส (ถ้าพึ่ง :hover อย่างเดียวมือถือจะเปิดเมนูไม่ได้)
   - ลิงก์ยังกดได้แม้ JS ไม่ทำงาน

   สไตล์ทั้งหมด (.cfab / .line-badge) อยู่ใน globals.css โดย .line-badge ใช้ร่วม
   กับแถบ .line-badges ที่ฝังอยู่ในเนื้อหาหน้าต่างๆ แก้ที่เดียวเปลี่ยนพร้อมกัน */

/* เบอร์ชุดเดียวกับที่ footer ใช้อยู่ (ตัด 02 ออกตามที่ลูกค้าสั่งรอบก่อน) */
const PHONES = [
  { label: "086-339-4682", tel: "0863394682" },
  { label: "061-421-5422", tel: "0614215422" },
];

/* @imat = LINE OA ลิงก์ lin.ee ที่ลูกค้าส่งมาล่าสุด
   อีกสองตัวเป็น LINE ส่วนบุคคล ใช้ลิงก์ ti/p/~<id> ตามที่หน้าอื่นใช้อยู่แล้ว */
export const LINE_ACCOUNTS = [
  { id: "@imat", url: "https://lin.ee/5Icpta4o" },
  { id: "imat999", url: "https://line.me/ti/p/~imat999" },
  { id: "blue999", url: "https://line.me/ti/p/~blue999" },
];

/* โลโก้ LINE ตัวจริง — ฟองคำพูดกับตัวอักษร LINE อยู่ใน path เดียว ตัวอักษรถูกเจาะ
   ทะลุด้วย fill-rule="evenodd" ระบายสีขาวบนพื้นเขียว = เวอร์ชันขาวของแบรนด์
   ตัวเดียวกับที่ LINE กำหนดให้ใช้กับปุ่มแอดเพื่อน
   markup ชุดเดียวกันนี้ฝังอยู่ใน _content/*.html ด้วย ถ้าแก้ path ต้องแก้ทั้งสองที่ */
function LineMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

export default function LineFab() {
  return (
    <details className="cfab">
      <summary aria-label="ช่องทางติดต่อ" title="ช่องทางติดต่อ">
        <svg className="cfab-ico cfab-ico-open" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
             aria-hidden="true">
          <path d="M21 11.6a8.1 8.1 0 0 1-8.7 8.1 9.3 9.3 0 0 1-2.6-.4L4.5 21l1.7-4.1A7.9 7.9 0 0 1 3 11.6 8.1 8.1 0 0 1 11.7 3.5 8.1 8.1 0 0 1 21 11.6z" />
          <path d="M8.6 11.6h.01M12 11.6h.01M15.4 11.6h.01" />
        </svg>
        <svg className="cfab-ico cfab-ico-close" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"
             aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </summary>

      <div className="cfab-menu">
        <div>
          <div className="cfab-label">โทรหาเรา</div>
          {PHONES.map((p) => (
            <a key={p.tel} className="cfab-tel" href={`tel:${p.tel}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.5 16.9v2.6a1.7 1.7 0 0 1-1.9 1.7 17.3 17.3 0 0 1-7.5-2.7 17 17 0 0 1-5.2-5.2A17.3 17.3 0 0 1 4.2 5.8 1.7 1.7 0 0 1 5.9 4h2.6a1.7 1.7 0 0 1 1.7 1.5c.1.8.3 1.7.6 2.5a1.7 1.7 0 0 1-.4 1.8l-1.1 1.1a14 14 0 0 0 5.2 5.2l1.1-1.1a1.7 1.7 0 0 1 1.8-.4c.8.3 1.6.5 2.5.6a1.7 1.7 0 0 1 1.5 1.7z" />
              </svg>
              {/* data-enhc กัน linkifyContacts() ใน enhance.jsx ห่อ <a> ซ้อนอีกชั้น
                  (มันจับรูปแบบเบอร์โทรทั้งเว็บมาทำเป็นลิงก์ tel: ให้อัตโนมัติ) */}
              <span data-enhc="1">{p.label}</span>
            </a>
          ))}
        </div>

        <div>
          <div className="cfab-label">แอดไลน์</div>
          <div className="line-badges">
            {LINE_ACCOUNTS.map((l) => (
              <a
                key={l.id}
                className="line-badge"
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="line-badge-ico">
                  <LineMark />
                </span>
                {/* เหตุผลเดียวกับข้างบน — กันไม่ให้ imat999/blue999 ถูกทำเป็นลิงก์ซ้อน */}
                <span data-enhc="1">{l.id}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}
