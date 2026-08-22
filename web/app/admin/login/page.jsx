import LoginForm from "./login-form";
import { isCmsEnabled } from "../../../lib/supabase/config";
import SetupNotice from "../../../components/admin/setup-notice";

export const dynamic = "force-dynamic";

export default function LoginPage({ searchParams }) {
  if (!isCmsEnabled()) return <SetupNotice />;

  return (
    <div className="adm min-h-screen flex bg-white">
      {/* ครึ่งซ้าย: เขียวเข้มชุดเดียวกับ sidebar ให้จำได้ว่านี่คือ "ของหลังบ้าน" */}
      <div className="hidden md:flex w-[55%] bg-brand-deep text-white flex-col justify-between p-12 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.15] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-fire-protection.webp')" }}
        />
        <div className="relative flex items-center gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-lg bg-white/10 font-semibold text-[14px]">IM</span>
          <span className="font-semibold text-[14px] tracking-tight">INFINITE MATERIAL &amp; TECHNOLOGY</span>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-[34px] leading-tight font-semibold mb-4">ระบบจัดการเนื้อหาเว็บไซต์</h1>
          <p className="text-[15px] leading-relaxed text-white/70">
            แก้ข้อความและรูปภาพได้เองทุกหน้า ไม่ต้องรอโปรแกรมเมอร์
          </p>
        </div>
        <p className="meta relative text-white/35">ใช้ภายในบริษัทเท่านั้น</p>
      </div>

      <div className="flex-1 grid place-items-center p-6">
        <LoginForm next={searchParams?.next} reason={searchParams?.reason} />
      </div>
    </div>
  );
}
