"use client";
import { useMemo, useState } from "react";
import Icon from "./icons";
import { STATUSES, statusOf, LEAD_FIELDS } from "../../lib/leads/status";
import { timeAgo } from "../../lib/cms/format";

const telHref = (phone) => "tel:" + String(phone || "").replace(/[^\d+]/g, "");
const emailIn = (s) => (String(s || "").match(/[^\s@]+@[^\s@]+\.[^\s@]+/) || [])[0];

const fullDate = (iso) =>
  new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  });

export default function LeadsBoard({ initial }) {
  const [leads, setLeads] = useState(initial || []);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const c = { all: leads.length };
    for (const s of STATUSES) c[s.key] = 0;
    for (const l of leads) c[l.status] = (c[l.status] || 0) + 1;
    return c;
  }, [leads]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (tab !== "all" && l.status !== tab) return false;
      if (!needle) return true;
      return [l.name, l.phone, l.company, l.contact, l.job_type, l.detail]
        .some((v) => String(v || "").toLowerCase().includes(needle));
    });
  }, [leads, tab, q]);

  /* แก้ในหน้าให้เห็นผลทันที แล้วค่อยยิงไปหลังบ้าน ถ้าพลาดค่อยย้อนคืน —
     ทีมขายกดเปลี่ยนสถานะรัวๆ ตอนโทรตามลูกค้า รอ round-trip ทุกครั้งจะสะดุด */
  const patch = async (id, fields) => {
    const before = leads.find((l) => l.id === id);
    setBusyId(id);
    setError("");
    setLeads((rows) => rows.map((l) => (l.id === id ? { ...l, ...fields } : l)));
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...fields }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "บันทึกไม่สำเร็จ");
    } catch (e) {
      setLeads((rows) => rows.map((l) => (l.id === id ? before : l)));
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const reload = async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/leads");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "โหลดไม่สำเร็จ");
      setLeads(json.leads || []);
    } catch (e) {
      setError(e.message);
    }
  };

  const tabs = [{ key: "all", label: "ทั้งหมด" }, ...STATUSES];

  return (
    <div className="px-6 py-6 max-w-[1180px]">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">ใบขอราคา</h1>
          <p className="text-[13.5px] text-ink-2 mt-0.5">
            {counts.new > 0
              ? `มีใบใหม่ ${counts.new} ใบที่ยังไม่ได้ติดต่อกลับ`
              : leads.length
              ? "ติดต่อกลับครบทุกใบแล้ว"
              : "ยังไม่มีใบขอราคาเข้ามา"}
          </p>
        </div>
        <button
          onClick={reload}
          className="flex items-center gap-2 h-9 px-3.5 rounded-lg border border-line bg-white text-[13.5px] hover:border-ink-3"
        >
          <Icon name="clock" size={16} />
          โหลดใหม่
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-card border border-danger/25 bg-danger-tint px-4 py-3 text-[13.5px] text-danger">
          <Icon name="warn" size={17} className="shrink-0 mt-px" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {tabs.map((t) => {
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`h-8 px-3 rounded-lg text-[13.5px] border transition ${
                on ? "bg-brand text-white border-brand" : "bg-white border-line text-ink-2 hover:border-ink-3"
              }`}
            >
              {t.label}
              <span className={`mono ml-1.5 normal-case tracking-normal ${on ? "text-white/70" : "text-ink-3"}`}>
                {counts[t.key] || 0}
              </span>
            </button>
          );
        })}
        <label className="relative ml-auto">
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นชื่อ เบอร์ บริษัท…"
            className="h-8 w-[230px] pl-9 pr-3 rounded-lg border border-line bg-white text-[13.5px] outline-none focus:border-brand"
          />
        </label>
      </div>

      <div className="bg-white border border-line rounded-card shadow-card overflow-hidden">
        {shown.length ? (
          <ul>
            {shown.map((l) => {
              const open = openId === l.id;
              const st = statusOf(l.status);
              const mail = emailIn(l.contact);
              return (
                <li key={l.id} className="border-b border-line last:border-0">
                  <button
                    onClick={() => setOpenId(open ? null : l.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-ground transition ${
                      open ? "bg-ground" : ""
                    }`}
                  >
                    <Icon
                      name="chevron"
                      size={16}
                      className={`shrink-0 text-ink-3 transition-transform ${open ? "rotate-90" : ""}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium truncate">
                        {l.name}
                        {l.company && <span className="text-ink-2 font-normal"> · {l.company}</span>}
                      </span>
                      <span className="meta block text-ink-3 truncate">
                        {[l.job_type, l.area && `${l.area} ตร.ม.`].filter(Boolean).join(" · ") || "ไม่ระบุประเภทงาน"}
                      </span>
                    </span>
                    <span className="mono shrink-0 text-ink-2 normal-case tracking-normal hidden sm:block">
                      {l.phone}
                    </span>
                    <span className="meta shrink-0 text-ink-3 w-[92px] text-right">{timeAgo(l.created_at)}</span>
                    <span className={`meta shrink-0 px-2 py-0.5 rounded-full ${st.chip}`}>{st.label}</span>
                  </button>

                  {open && (
                    <div className="px-5 pb-5 pt-1 bg-ground border-t border-line">
                      <div className="grid grid-cols-3 gap-5">
                        <div className="col-span-2 space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={telHref(l.phone)}
                              className="flex items-center gap-2 h-9 px-3.5 rounded-lg bg-brand text-white text-[13.5px] font-medium hover:bg-brand-dark"
                            >
                              โทร {l.phone}
                            </a>
                            {mail && (
                              <a
                                href={`mailto:${mail}`}
                                className="flex items-center gap-2 h-9 px-3.5 rounded-lg border border-line bg-white text-[13.5px] hover:border-ink-3"
                              >
                                <Icon name="external" size={15} />
                                {mail}
                              </a>
                            )}
                          </div>

                          <dl className="bg-white border border-line rounded-card divide-y divide-line">
                            {LEAD_FIELDS.filter(([, k]) => l[k]).map(([label, k]) => (
                              <div key={k} className="flex gap-4 px-4 py-2.5">
                                <dt className="meta text-ink-3 w-[130px] shrink-0 pt-0.5">{label}</dt>
                                <dd className="text-[13.5px] whitespace-pre-wrap min-w-0">{l[k]}</dd>
                              </div>
                            ))}
                            <div className="flex gap-4 px-4 py-2.5">
                              <dt className="meta text-ink-3 w-[130px] shrink-0 pt-0.5">ส่งเข้ามาเมื่อ</dt>
                              <dd className="text-[13.5px]">
                                {fullDate(l.created_at)}
                                <span className="mono text-ink-3 ml-2 normal-case tracking-normal">
                                  {l.source} · #{l.id}
                                </span>
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="meta text-ink-3 mb-2">สถานะ</div>
                            <div className="flex flex-wrap gap-1.5">
                              {STATUSES.map((s) => (
                                <button
                                  key={s.key}
                                  disabled={busyId === l.id}
                                  onClick={() => patch(l.id, { status: s.key })}
                                  className={`h-8 px-2.5 rounded-lg text-[13px] border transition disabled:opacity-50 ${
                                    l.status === s.key
                                      ? "bg-brand text-white border-brand"
                                      : "bg-white border-line text-ink-2 hover:border-ink-3"
                                  }`}
                                >
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <NoteBox lead={l} busy={busyId === l.id} onSave={(note) => patch(l.id, { note })} />
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-5 py-16 text-center text-[13.5px] text-ink-3">
            {leads.length
              ? "ไม่มีใบที่ตรงกับเงื่อนไขนี้"
              : "ยังไม่มีใบขอราคา — เมื่อมีลูกค้ากรอกฟอร์มบนเว็บ รายการจะขึ้นที่นี่ทันที"}
          </p>
        )}
      </div>
    </div>
  );
}

/* โน้ตแยกเป็น component ของตัวเองเพื่อให้แต่ละใบมี state ร่างของตัวเอง
   ถ้าเก็บรวมไว้ข้างบน การพิมพ์ในใบหนึ่งจะ re-render ทั้งรายการทุกตัวอักษร */
function NoteBox({ lead, busy, onSave }) {
  const [text, setText] = useState(lead.note || "");
  const dirty = text !== (lead.note || "");
  return (
    <div>
      <div className="meta text-ink-3 mb-2">โน้ตภายใน</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="คุยอะไรกับลูกค้าไปแล้วบ้าง…"
        className="w-full px-3 py-2 rounded-lg border border-line bg-white text-[13.5px] outline-none focus:border-brand resize-y"
      />
      <button
        disabled={!dirty || busy}
        onClick={() => onSave(text)}
        className="mt-2 h-8 px-3 rounded-lg bg-brand text-white text-[13px] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-dark"
      >
        {dirty ? "บันทึกโน้ต" : "บันทึกแล้ว"}
      </button>
    </div>
  );
}
