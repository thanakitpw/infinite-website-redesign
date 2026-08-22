/* ขึ้นเมื่อยังไม่ได้ตั้งค่า Supabase — บอกวิธีทำต่อ ดีกว่าจอขาวหรือ error ดิบๆ */
export default function SetupNotice() {
  const steps = [
    ["สร้างโปรเจค Supabase", "supabase.com → New project เลือก region Singapore ให้ใกล้ผู้ใช้ไทยที่สุด"],
    ["รัน migration", "เปิด SQL Editor แล้ววางไฟล์ supabase/migrations/0001_cms.sql ทั้งไฟล์ กด Run"],
    ["ตั้งค่า environment variables", "คัดลอกจาก Project Settings → API ใส่ใน .env.local และใน Vercel"],
    ["สร้างผู้ใช้คนแรก", "Authentication → Users → Add user แล้วเพิ่มแถวใน cms_users ด้วย id เดียวกัน"],
  ];
  return (
    <div className="adm min-h-screen bg-ground grid place-items-center p-6">
      <div className="w-full max-w-xl bg-white border border-line rounded-card shadow-card p-8">
        <p className="mono uppercase text-brand mb-3">ระบบจัดการเนื้อหา</p>
        <h1 className="text-[22px] font-semibold mb-2">ยังไม่ได้เชื่อมต่อ Supabase</h1>
        <p className="text-[14px] text-ink-2 mb-6 leading-relaxed">
          เว็บไซต์หน้าบ้านทำงานปกติทุกหน้า — ส่วนนี้เป็นระบบหลังบ้านที่ต้องต่อฐานข้อมูลก่อนถึงจะใช้ได้
        </p>
        <ol className="space-y-4">
          {steps.map(([title, detail], i) => (
            <li key={title} className="flex gap-3">
              <span className="mono shrink-0 grid place-items-center w-6 h-6 rounded-md bg-brand-tint text-brand">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium">{title}</span>
                <span className="block text-[13px] text-ink-2 leading-relaxed">{detail}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mono mt-6 pt-5 border-t border-line text-ink-3 normal-case tracking-normal text-[11px] leading-relaxed">
          NEXT_PUBLIC_SUPABASE_URL
          <br />
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </p>
      </div>
    </div>
  );
}
