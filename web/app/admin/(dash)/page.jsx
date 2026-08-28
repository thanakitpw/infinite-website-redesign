import Link from "next/link";
import Icon from "../../../components/admin/icons";
import { PAGES } from "../../../lib/cms/pages";
import { contentStats } from "../../../lib/cms/stats";
import { fragmentStatus, recentEdits } from "../../../lib/cms/store";
import { timeAgo } from "../../../lib/cms/format";

export const dynamic = "force-dynamic";

const PAGE_OF_FRAGMENT = (frag) => PAGES.find((p) => p.fragments.includes(frag));

export default async function Dashboard() {
  const stats = contentStats();
  const status = await fragmentStatus();
  const recent = await recentEdits(8);

  const dirty = Object.values(status).reduce((n, s) => n + s.dirty, 0);
  const dirtyPages = PAGES.filter((p) => p.fragments.some((f) => status[f]?.dirty)).length;

  const cards = [
    ["หน้าเว็บที่แก้ได้", stats.pages, "pages", "/admin/pages"],
    ["ข้อความที่แก้ได้", stats.text.toLocaleString("th-TH"), "file", null],
    ["รูปที่เปลี่ยนได้", stats.image.toLocaleString("th-TH"), "image", null],
    ["ร่างที่ยังไม่เผยแพร่", dirty, "clock", dirty ? "/admin/pages" : null],
  ];

  return (
    <div className="px-6 py-6 max-w-[1180px]">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">แดชบอร์ด</h1>
          <p className="text-[13.5px] text-ink-2 mt-0.5">
            {dirty > 0
              ? `มีร่างค้างอยู่ ${dirty} จุด ใน ${dirtyPages} หน้า`
              : "เนื้อหาทุกหน้าตรงกับที่เผยแพร่อยู่"}
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 h-9 px-3.5 rounded-lg border border-line bg-white text-[13.5px] hover:border-ink-3"
        >
          <Icon name="external" size={16} />
          ดูเว็บไซต์จริง
        </a>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map(([label, value, icon, href]) => {
          const inner = (
            <>
              <span className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-ink-2">{label}</span>
                <Icon name={icon} size={18} className="text-ink-3" />
              </span>
              <span className="mono block text-[26px] tracking-tight text-ink normal-case">{value}</span>
            </>
          );
          return href ? (
            <Link key={label} href={href} className="block bg-white border border-line rounded-card shadow-card p-5 hover:border-brand transition">
              {inner}
            </Link>
          ) : (
            <div key={label} className="bg-white border border-line rounded-card shadow-card p-5">{inner}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4 items-start">
        <div className="col-span-2 bg-white border border-line rounded-card shadow-card">
          <div className="px-5 py-4 border-b border-line">
            <h2 className="font-semibold text-[15px]">แก้ไขล่าสุด</h2>
          </div>
          {recent.length ? (
            <ul>
              {recent.map((r, i) => {
                const page = PAGE_OF_FRAGMENT(r.fragment);
                const pending = r.draft_value != null && r.draft_value !== r.published_value;
                const shown = r.draft_value ?? r.published_value ?? "";
                return (
                  <li key={`${r.fragment}-${r.field_key}-${i}`} className="flex items-center gap-3 px-5 py-3 border-b border-line last:border-0">
                    <Icon name={r.kind === "image" ? "image" : "file"} size={17} className="text-ink-3 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] truncate">{shown || "(ว่าง)"}</span>
                      <span className="meta block text-ink-3 truncate">
                        {page?.label || r.fragment} · {timeAgo(r.updated_at)}
                      </span>
                    </span>
                    {pending && (
                      <span className="meta shrink-0 px-2 py-0.5 rounded-full bg-amber-tint text-amber">ร่าง</span>
                    )}
                    {page && (
                      <Link href={`/admin/pages/${page.key}`} className="shrink-0 text-brand text-[13px] font-medium hover:underline">
                        แก้ไข
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-5 py-12 text-center text-[13.5px] text-ink-3">
              ยังไม่มีการแก้ไข — เริ่มที่ <Link href="/admin/pages" className="text-brand hover:underline">หน้าเว็บไซต์</Link>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-line rounded-card shadow-card p-5">
            <h2 className="font-semibold text-[15px] mb-3">เริ่มแก้ที่นี่</h2>
            <div className="space-y-1.5">
              {PAGES.slice(0, 5).map((p) => (
                <Link
                  key={p.key}
                  href={`/admin/pages/${p.key}`}
                  className="flex items-center gap-2 h-9 px-2.5 -mx-2.5 rounded-lg hover:bg-ground text-[13.5px]"
                >
                  <Icon name="pages" size={16} className="text-ink-3 shrink-0" />
                  <span className="truncate">{p.label}</span>
                  <span className="mono ml-auto text-ink-3 normal-case tracking-normal shrink-0">{p.url}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-brand-tint border border-brand/15 rounded-card p-5">
            <h2 className="font-semibold text-[14px] mb-2">เฟสนี้ทำอะไรได้บ้าง</h2>
            <p className="text-[13px] text-ink-2 leading-relaxed">
              แก้ข้อความและเปลี่ยนรูปได้ทุกหน้า พร้อมบันทึกร่างไว้ก่อนเผยแพร่
              และดูใบขอราคาที่ลูกค้าส่งเข้ามาพร้อมกดเปลี่ยนสถานะได้
              ส่วนการเพิ่ม/ลบสินค้าและบทความจะเปิดในเฟสถัดไป
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
