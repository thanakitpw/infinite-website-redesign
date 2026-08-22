"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "./icons";
import { browserClient } from "../../lib/supabase/browser";

/* เมนูหลังบ้าน — เฟสนี้เปิดใช้จริงแค่สามอันแรก ที่เหลือโชว์ไว้ให้เห็นแผนแต่กดไม่ได้
   ตั้งใจไม่ซ่อน เพราะลูกค้าจะได้เห็นว่าระบบกำลังจะมีอะไรบ้าง ไม่ใช่คิดว่าทำได้แค่นี้ */
const NAV = [
  { href: "/admin", icon: "dashboard", label: "แดชบอร์ด", exact: true },
  { href: "/admin/pages", icon: "pages", label: "หน้าเว็บไซต์" },
  { href: "/admin/media", icon: "image", label: "คลังรูปภาพ" },
  { href: "/admin/products", icon: "box", label: "สินค้า", soon: true },
  { href: "/admin/articles", icon: "file", label: "บทความ", soon: true },
  { href: "/admin/leads", icon: "inbox", label: "ใบขอราคา", soon: true },
  { href: "/admin/settings", icon: "gear", label: "ตั้งค่าเว็บไซต์", soon: true },
];

export default function Shell({ user, children }) {
  const pathname = usePathname() || "";
  const router = useRouter();

  // หน้าแก้ไขเนื้อหาใช้พื้นที่ทั้งจอ เมนูย่อเหลือแถบไอคอน 64px ตามดีไซน์
  const rail = /^\/admin\/pages\/.+/.test(pathname);

  const signOut = async () => {
    const sb = browserClient();
    if (sb) await sb.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const isOn = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="adm flex min-h-screen bg-ground">
      <aside
        className={`${rail ? "w-16" : "w-[260px]"} shrink-0 bg-brand-deep text-white flex flex-col sticky top-0 h-screen transition-[width] duration-200`}
      >
        <Link
          href="/admin"
          className={`flex items-center gap-3 h-16 shrink-0 ${rail ? "justify-center" : "px-5"}`}
        >
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-white/10 font-semibold text-[13px] tracking-tight shrink-0">
            IM
          </span>
          {!rail && (
            <span className="leading-tight min-w-0">
              <span className="block font-semibold text-[13px] tracking-tight truncate">INFINITE MATERIAL</span>
              <span className="mono block text-white/45 uppercase">content system</span>
            </span>
          )}
        </Link>

        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map((item) => {
            const on = isOn(item);
            const cls = `relative flex items-center gap-3 mx-2 rounded-lg h-10 ${
              rail ? "justify-center px-0" : "px-3"
            } ${
              item.soon
                ? "text-white/30 cursor-not-allowed"
                : on
                ? "bg-white/[0.14] text-white font-medium"
                : "text-white/70 hover:bg-white/[0.07] hover:text-white"
            }`;
            const body = (
              <>
                {on && !item.soon && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#71dd85]" />
                )}
                <Icon name={item.icon} />
                {!rail && <span className="text-[14px] truncate">{item.label}</span>}
                {!rail && item.soon && <span className="meta ml-auto text-white/25 shrink-0">เร็วๆ นี้</span>}
              </>
            );
            return item.soon ? (
              <div key={item.href} className={cls} title={`${item.label} — ยังไม่เปิดในเฟสนี้`}>
                {body}
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={cls} title={rail ? item.label : undefined}>
                {body}
              </Link>
            );
          })}
        </nav>

        <div className={`shrink-0 border-t border-white/10 ${rail ? "py-3" : "p-3"}`}>
          <div className={`flex items-center gap-3 ${rail ? "justify-center" : ""}`}>
            <span className="grid place-items-center w-8 h-8 rounded-full bg-[#71dd85] text-brand-deep font-semibold text-[13px] shrink-0">
              {(user?.display_name || user?.email || "?").trim().charAt(0).toUpperCase()}
            </span>
            {!rail && (
              <>
                <span className="min-w-0 leading-tight">
                  <span className="block text-[13px] font-medium truncate">
                    {user?.display_name || user?.email || "ผู้ดูแลระบบ"}
                  </span>
                  <span className="mono block text-white/40 uppercase">
                    {user?.role === "admin" ? "admin" : "editor"}
                  </span>
                </span>
                <button
                  onClick={signOut}
                  title="ออกจากระบบ"
                  className="ml-auto shrink-0 text-white/50 hover:text-white p-1.5 rounded-md hover:bg-white/10"
                >
                  <Icon name="logout" size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
