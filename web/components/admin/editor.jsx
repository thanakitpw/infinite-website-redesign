"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "./icons";
import MediaPicker from "./media-picker";

const idOf = (frag, key) => `${frag}::${key}`;
const DEVICES = [
  ["desktop", "desktop", "100%"],
  ["tablet", "tablet", "834px"],
  ["mobile", "mobile", "390px"],
];

export default function Editor({ page, fragments, rows }) {
  const router = useRouter();
  const iframeRef = useRef(null);

  /* ── ค่าตั้งต้นของทุกช่อง ────────────────────────────────────────────────
     ลำดับที่ใช้: ร่างที่ค้างอยู่ → ค่าที่เผยแพร่แล้ว → ข้อความจริงในไฟล์ HTML
     เก็บ published ไว้ต่างหากด้วย เพื่อบอกได้ว่าช่องไหน "ต่างจากที่ขึ้นเว็บอยู่" */
  const { initial, published, meta } = useMemo(() => {
    const initial = {}, published = {}, meta = {};
    for (const f of fragments) {
      for (const b of f.blocks) {
        for (const fd of b.fields) {
          const id = idOf(f.frag, fd.key);
          const row = rows?.[f.frag]?.[fd.key];
          const pub = row?.published_value ?? fd.value;
          published[id] = { value: pub, alt: row?.published_alt ?? fd.alt ?? "" };
          initial[id] = {
            value: row?.draft_value ?? pub,
            alt: (row?.draft_value != null ? row?.draft_alt : row?.published_alt) ?? fd.alt ?? "",
          };
          meta[id] = { fragment: f.frag, key: fd.key, kind: fd.kind, hash: fd.hash, original: fd.value };
        }
      }
    }
    return { initial, published, meta };
  }, [fragments, rows]);

  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState(() => new Set());
  const [selected, setSelected] = useState(`${fragments[0]?.frag}::0`);
  const [device, setDevice] = useState("desktop");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState(null);
  const [previewNonce, setPreviewNonce] = useState(0);

  const blockList = useMemo(
    () =>
      fragments.flatMap((f) =>
        f.blocks.map((b, i) => ({
          id: `${f.frag}::${i}`,
          fragment: f.frag,
          shared: f.shared,
          name: b.name,
          fields: b.fields,
          textCount: b.fields.filter((x) => x.kind === "text").length,
          imageCount: b.fields.filter((x) => x.kind === "image").length,
        }))
      ),
    [fragments]
  );

  const current = blockList.find((b) => b.id === selected) || blockList[0];

  // ช่องที่ต่างจากที่เผยแพร่อยู่ = สิ่งที่จะเปลี่ยนบนเว็บจริงถ้ากดเผยแพร่ตอนนี้
  const dirtyIds = useMemo(() => {
    const s = new Set();
    for (const id of Object.keys(values)) {
      const v = values[id], p = published[id];
      if (!p) continue;
      if (v.value !== p.value || (v.alt || "") !== (p.alt || "")) s.add(id);
    }
    return s;
  }, [values, published]);

  const dirtyByBlock = useMemo(() => {
    const m = {};
    for (const b of blockList) {
      m[b.id] = b.fields.reduce((n, fd) => n + (dirtyIds.has(idOf(b.fragment, fd.key)) ? 1 : 0), 0);
    }
    return m;
  }, [blockList, dirtyIds]);

  const setField = (id, patch) => {
    setValues((v) => ({ ...v, [id]: { ...v[id], ...patch } }));
    setTouched((t) => (t.has(id) ? t : new Set(t).add(id)));
    setError("");
  };

  /* ── คุยกับตัวอย่างใน iframe ─────────────────────────────────────────────── */
  const highlight = useCallback(
    (blockId) => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      const b = blockList.find((x) => x.id === blockId);
      win.postMessage({ source: "cms-editor", type: "highlight", id: blockId, name: b?.name }, window.location.origin);
    },
    [blockList]
  );

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.data?.source !== "cms-preview") return;
      if (e.data.type === "ready") highlight(selected);
      if (e.data.type === "select") setSelected(e.data.id);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [highlight, selected]);

  useEffect(() => { highlight(selected); }, [selected, highlight]);

  /* ── บันทึกร่าง ─────────────────────────────────────────────────────────── */
  const save = async () => {
    if (!touched.size || saving) return true;
    setSaving(true);
    setError("");

    const byFragment = {};
    for (const id of touched) {
      const m = meta[id];
      if (!m) continue;
      (byFragment[m.fragment] ||= []).push({
        key: m.key, kind: m.kind, hash: m.hash,
        value: values[id].value, alt: values[id].alt,
      });
    }

    try {
      for (const [fragment, fields] of Object.entries(byFragment)) {
        const res = await fetch("/api/admin/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fragment, fields }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "บันทึกไม่สำเร็จ");
      }
      setTouched(new Set());
      setSavedAt(new Date());
      setPreviewNonce((n) => n + 1);
      return true;
    } catch (e) {
      setError(e.message || "บันทึกไม่สำเร็จ");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (publishing) return;
    setPublishing(true);
    setError("");
    try {
      if (!(await save())) return;
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fragments: fragments.map((f) => f.frag) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "เผยแพร่ไม่สำเร็จ");
      router.refresh();
    } catch (e) {
      setError(e.message || "เผยแพร่ไม่สำเร็จ");
    } finally {
      setPublishing(false);
    }
  };

  // เตือนก่อนปิดแท็บถ้ายังมีของที่ยังไม่บันทึก
  useEffect(() => {
    if (!touched.size) return;
    const onLeave = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [touched.size]);

  const deviceWidth = DEVICES.find((d) => d[0] === device)[2];

  return (
    <div className="flex flex-col h-screen">
      {/* ── แถบบน ───────────────────────────────────────────────────────── */}
      <header className="shrink-0 h-16 bg-white border-b border-line flex items-center gap-4 px-4">
        <Link href="/admin/pages" className="flex items-center gap-2 text-[13.5px] text-ink-2 hover:text-ink shrink-0">
          <Icon name="back" size={18} />
          กลับไปหน้ารายการ
        </Link>
        <span className="w-px h-6 bg-line" />
        <span className="min-w-0 flex items-baseline gap-2">
          <span className="font-semibold text-[15px] truncate">{page.label}</span>
          <span className="mono text-ink-3 normal-case tracking-normal shrink-0">{page.url}</span>
        </span>

        {dirtyIds.size > 0 && (
          <span className="mx-auto shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-tint text-amber text-[13px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
            ยังไม่ได้เผยแพร่ {dirtyIds.size} จุด
          </span>
        )}

        <div className={`flex items-center gap-2 shrink-0 ${dirtyIds.size > 0 ? "" : "ml-auto"}`}>
          <a
            href={page.url}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 h-9 px-3.5 rounded-lg border border-line text-[13.5px] hover:border-ink-3"
          >
            <Icon name="external" size={16} />
            ดูเว็บไซต์จริง
          </a>
          <button
            onClick={publish}
            disabled={publishing || !dirtyIds.size}
            className="h-9 px-4 rounded-lg bg-brand text-white font-medium text-[14px] hover:bg-brand-dark disabled:opacity-40 disabled:hover:bg-brand"
          >
            {publishing ? "กำลังเผยแพร่…" : "เผยแพร่"}
          </button>
        </div>
      </header>

      {error && (
        <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-danger-tint text-[13px] text-[#93000a]">
          <Icon name="warn" size={16} />
          {error}
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* ── ซ้าย: รายการบล็อก ─────────────────────────────────────────── */}
        <aside className="w-[300px] shrink-0 bg-white border-r border-line flex flex-col">
          <div className="px-4 h-12 flex items-center justify-between border-b border-line shrink-0">
            <span className="font-semibold text-[14px]">บล็อกในหน้านี้</span>
            <span className="meta text-ink-3">{blockList.length} บล็อก</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {fragments.map((f) => (
              <div key={f.frag}>
                {fragments.length > 1 && (
                  <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                    <span className="mono uppercase text-ink-3 truncate">{f.frag}</span>
                    {f.shared && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded bg-brand-tint text-brand text-[10.5px] font-medium">
                        ใช้ร่วมทุกหน้าสินค้า
                      </span>
                    )}
                  </div>
                )}
                {blockList
                  .filter((b) => b.fragment === f.frag)
                  .map((b) => {
                    const on = b.id === selected;
                    const n = dirtyByBlock[b.id];
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelected(b.id)}
                        className={`w-full text-left flex items-center gap-2.5 pl-3 pr-3 py-2.5 border-l-[3px] ${
                          on ? "bg-brand-tint border-brand" : "border-transparent hover:bg-[#F7FAF7]"
                        }`}
                      >
                        <Icon name="grip" size={16} className="text-ink-3 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className={`block text-[13.5px] leading-snug truncate ${on ? "font-semibold" : ""}`}>
                            {b.name}
                          </span>
                          <span className="meta text-ink-3">
                            {b.textCount} ข้อความ · {b.imageCount} รูป
                          </span>
                        </span>
                        {n > 0 && <span className="shrink-0 w-2 h-2 rounded-full bg-amber" title={`มีร่าง ${n} จุด`} />}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </aside>

        {/* ── กลาง: ตัวอย่างหน้าเว็บจริง ────────────────────────────────── */}
        <section className="flex-1 min-w-0 bg-ground flex flex-col">
          <div className="h-12 shrink-0 flex items-center justify-center gap-3 border-b border-line bg-white">
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#EFF3EE]">
              {DEVICES.map(([id, icon]) => (
                <button
                  key={id}
                  onClick={() => setDevice(id)}
                  aria-label={id}
                  className={`grid place-items-center w-9 h-7 rounded-md ${
                    device === id ? "bg-white text-brand shadow-card" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  <Icon name={icon} size={17} />
                </button>
              ))}
            </div>
            <span className="mono text-ink-3">{deviceWidth}</span>
            <button
              onClick={() => setPreviewNonce((n) => n + 1)}
              className="meta text-ink-3 hover:text-brand ml-2"
              title="โหลดตัวอย่างใหม่"
            >
              รีเฟรช
            </button>
          </div>
          <div className="flex-1 overflow-auto p-5">
            <div
              className="mx-auto h-full bg-white rounded-card border border-line overflow-hidden shadow-card transition-[width]"
              style={{ width: deviceWidth, maxWidth: "100%" }}
            >
              <iframe
                key={previewNonce}
                ref={iframeRef}
                src={`/admin/preview/${page.key}`}
                title="ตัวอย่างหน้าเว็บ"
                className="w-full h-full block border-0"
                onLoad={() => highlight(selected)}
              />
            </div>
          </div>
        </section>

        {/* ── ขวา: ฟอร์มแก้ไขของบล็อกที่เลือก ──────────────────────────── */}
        <aside className="w-[400px] shrink-0 bg-white border-l border-line flex flex-col">
          <div className="px-4 h-12 flex items-center justify-between border-b border-line shrink-0">
            <span className="min-w-0">
              <span className="block font-semibold text-[14px] truncate">{current?.name}</span>
            </span>
            {dirtyByBlock[current?.id] > 0 && (
              <span className="meta shrink-0 text-amber">ร่าง {dirtyByBlock[current.id]}</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {current?.fields.map((fd) => {
              const id = idOf(current.fragment, fd.key);
              const v = values[id] || { value: "", alt: "" };
              const changed = dirtyIds.has(id);
              return fd.kind === "text" ? (
                <TextField
                  key={id}
                  field={fd}
                  value={v.value}
                  changed={changed}
                  onChange={(value) => setField(id, { value })}
                  onReset={() => setField(id, { value: published[id]?.value ?? fd.value })}
                />
              ) : (
                <ImageField
                  key={id}
                  field={fd}
                  value={v.value}
                  alt={v.alt}
                  changed={changed}
                  onPick={() => setPicker({ id, field: fd })}
                  onAlt={(alt) => setField(id, { alt })}
                  onReset={() => setField(id, { value: published[id]?.value ?? fd.value, alt: published[id]?.alt ?? fd.alt ?? "" })}
                />
              );
            })}
            {!current?.fields.length && (
              <p className="text-[13.5px] text-ink-3 py-10 text-center">บล็อกนี้ไม่มีข้อความหรือรูปให้แก้</p>
            )}
          </div>

          <div className="shrink-0 border-t border-line p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="meta text-ink-3">
                {touched.size > 0
                  ? `ยังไม่ได้บันทึก ${touched.size} ช่อง`
                  : savedAt
                  ? `บันทึกแล้วเมื่อ ${savedAt.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}`
                  : "ยังไม่มีการแก้ไข"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setValues(initial); setTouched(new Set()); }}
                disabled={!touched.size}
                className="flex-1 h-10 rounded-lg border border-line text-[14px] hover:border-ink-3 disabled:opacity-40"
              >
                ยกเลิก
              </button>
              <button
                onClick={save}
                disabled={!touched.size || saving}
                className="flex-[1.4] h-10 rounded-lg bg-brand text-white font-medium text-[14px] hover:bg-brand-dark disabled:opacity-40 disabled:hover:bg-brand"
              >
                {saving ? "กำลังบันทึก…" : "บันทึกร่าง"}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {picker && (
        <MediaPicker
          current={values[picker.id]?.value}
          alt={values[picker.id]?.alt}
          onClose={() => setPicker(null)}
          onSelect={({ url, alt }) => {
            setField(picker.id, alt != null ? { value: url, alt } : { value: url });
            setPicker(null);
          }}
        />
      )}
    </div>
  );
}

/* ── ช่องข้อความ ───────────────────────────────────────────────────────────
   ข้อความยาวใช้ textarea ที่สูงตามเนื้อหา ข้อความสั้นใช้ input บรรทัดเดียว
   ตัดสินจากความยาวของ *ต้นฉบับ* ไม่ใช่ค่าปัจจุบัน ไม่งั้นช่องจะเด้งสลับชนิด
   กลางคันตอนลูกค้าพิมพ์ */
function TextField({ field, value, changed, onChange, onReset }) {
  const long = field.value.length > 60;
  const base =
    "w-full px-3 py-2 rounded-lg border bg-white text-[14px] leading-relaxed outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 " +
    (changed ? "border-amber/50 bg-[#FFFDF7]" : "border-line");

  return (
    <label className="block">
      <span className="flex items-center gap-2 mb-1.5">
        <span className="text-[12.5px] font-medium text-ink-2">{field.label}</span>
        {changed && (
          <button type="button" onClick={onReset} className="meta text-amber hover:underline">
            คืนค่าเดิม
          </button>
        )}
        <span className="ml-auto mono text-ink-3 normal-case tracking-normal">{value.length}</span>
      </span>
      {long ? (
        <textarea
          className={base}
          rows={Math.min(8, Math.max(2, Math.ceil(value.length / 46)))}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className={base} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

/* ── ช่องรูป ─────────────────────────────────────────────────────────────── */
function ImageField({ field, value, alt, changed, onPick, onAlt, onReset }) {
  return (
    <div className={`rounded-lg border p-3 ${changed ? "border-amber/50 bg-[#FFFDF7]" : "border-line"}`}>
      <span className="flex items-center gap-2 mb-2">
        <span className="text-[12.5px] font-medium text-ink-2">{field.label}</span>
        {changed && (
          <button type="button" onClick={onReset} className="meta text-amber hover:underline">
            คืนค่าเดิม
          </button>
        )}
      </span>
      <div className="flex gap-3">
        <span
          className="shrink-0 w-[104px] h-[68px] rounded-md border border-line bg-[#F2F6F1] bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${value}')` }}
        />
        <span className="min-w-0 flex-1">
          <span className="mono block text-ink-3 normal-case tracking-normal truncate mb-2" title={value}>
            {value.split("/").pop()}
          </span>
          <button
            type="button"
            onClick={onPick}
            className="h-8 px-3 rounded-md border border-line text-[13px] hover:border-brand hover:text-brand"
          >
            เปลี่ยนรูป
          </button>
        </span>
      </div>
      {field.key.endsWith("@img") && (
        <label className="block mt-3">
          <span className="block text-[12px] text-ink-2 mb-1">ข้อความ ALT (สำหรับ SEO)</span>
          <input
            className="w-full h-9 px-2.5 rounded-md border border-line text-[13px] outline-none focus:border-brand"
            value={alt || ""}
            onChange={(e) => onAlt(e.target.value)}
            placeholder="อธิบายภาพสั้นๆ"
          />
        </label>
      )}
    </div>
  );
}
