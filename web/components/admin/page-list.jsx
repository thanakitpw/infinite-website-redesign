"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "./icons";
import { timeAgo } from "../../lib/cms/format";

export default function PageList({ rows, groups }) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [onlyDirty, setOnlyDirty] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (group !== "all" && r.group !== group) return false;
      if (onlyDirty && !r.dirty) return false;
      if (!needle) return true;
      return r.label.toLowerCase().includes(needle) || r.url.toLowerCase().includes(needle);
    });
  }, [rows, q, group, onlyDirty]);

  const dirtyTotal = rows.reduce((n, r) => n + r.dirty, 0);
  const counts = { all: rows.length };
  for (const g of groups) counts[g.id] = rows.filter((r) => r.group === g.id).length;

  const pill = (on) =>
    `h-8 px-3.5 rounded-full text-[13px] border transition ${
      on ? "bg-brand text-white border-brand" : "bg-white border-line text-ink-2 hover:border-ink-3"
    }`;

  return (
    <div className="px-6 py-6 max-w-[1180px]">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">หน้าเว็บไซต์</h1>
          <p className="text-[13.5px] text-ink-2 mt-0.5">
            {rows.length} หน้า
            {dirtyTotal > 0 && (
              <>
                {" · "}
                <span className="text-amber font-medium">มีร่างที่ยังไม่เผยแพร่ {dirtyTotal} จุด</span>
              </>
            )}
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

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <label className="relative">
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาหน้าเว็บ"
            className="h-8 w-[220px] pl-9 pr-3 rounded-full border border-line bg-white text-[13px] outline-none focus:border-brand"
          />
        </label>
        <button className={pill(group === "all")} onClick={() => setGroup("all")}>
          ทั้งหมด ({counts.all})
        </button>
        {groups.map((g) => (
          <button key={g.id} className={pill(group === g.id)} onClick={() => setGroup(g.id)}>
            {g.label} ({counts[g.id]})
          </button>
        ))}
        <button className={pill(onlyDirty) + " ml-auto"} onClick={() => setOnlyDirty((v) => !v)}>
          เฉพาะที่มีร่างค้าง
        </button>
      </div>

      <div className="bg-white border border-line rounded-card shadow-card overflow-hidden">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="bg-[#F2F6F1]">
              <th className="meta text-ink-3 font-medium text-left px-5 py-2.5">ชื่อหน้า</th>
              <th className="meta text-ink-3 font-medium text-left px-5 py-2.5 w-[140px]">ประเภท</th>
              <th className="meta text-ink-3 font-medium text-left px-5 py-2.5 w-[150px]">แก้ไขล่าสุด</th>
              <th className="meta text-ink-3 font-medium text-left px-5 py-2.5 w-[170px]">สถานะ</th>
              <th className="w-[90px]" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.key} className="border-t border-line hover:bg-[#FAFCFA]">
                <td className="px-5 py-3">
                  <Link href={`/admin/pages/${r.key}`} className="block">
                    <span className="block font-medium leading-snug">{r.label}</span>
                    <span className="mono text-ink-3 normal-case tracking-normal">{r.url}</span>
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-block px-2 py-0.5 rounded-full border border-line text-[12px] text-ink-2">
                    {r.groupLabel}
                  </span>
                </td>
                <td className="px-5 py-3 text-[13px] text-ink-2">{timeAgo(r.updatedAt)}</td>
                <td className="px-5 py-3">
                  {r.dirty > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-tint text-amber text-[12.5px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                      มีร่าง {r.dirty} จุด
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-tint text-brand text-[12.5px] font-medium">
                      <Icon name="check" size={13} strokeWidth={2.4} />
                      เผยแพร่แล้ว
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/pages/${r.key}`} className="text-brand font-medium text-[13.5px] hover:underline">
                    แก้ไข
                  </Link>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[14px] text-ink-3">
                  ไม่พบหน้าที่ตรงกับที่ค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
