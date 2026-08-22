"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./icons";

const kb = (n) => (!n ? "—" : n > 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + " MB" : Math.round(n / 1024) + " KB");

export default function MediaPicker({ current, alt, onClose, onSelect }) {
  const [tab, setTab] = useState("library");
  const [items, setItems] = useState(null);
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("ทั้งหมด");
  const [picked, setPicked] = useState(current || null);
  const [pickedAlt, setPickedAlt] = useState(alt || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "โหลดคลังรูปไม่สำเร็จ");
      setItems([...(json.uploaded || []), ...(json.local || [])]);
    } catch (e) {
      setError(e.message);
      setItems([]);
    }
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const folders = useMemo(() => {
    const s = new Set(["ทั้งหมด"]);
    (items || []).forEach((m) => s.add(m.folder || "ทั่วไป"));
    return [...s];
  }, [items]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (items || []).filter((m) => {
      if (folder !== "ทั้งหมด" && (m.folder || "ทั่วไป") !== folder) return false;
      return !needle || m.filename.toLowerCase().includes(needle) || m.url.toLowerCase().includes(needle);
    });
  }, [items, q, folder]);

  const selectedItem = (items || []).find((m) => m.url === picked);

  const upload = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "อัปโหลดไม่สำเร็จ");
        setPicked(json.media.url);
      }
      await load();
      setTab("library");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-6" onMouseDown={onClose}>
      <div
        className="w-full max-w-[1000px] h-[min(680px,88vh)] bg-white rounded-2xl shadow-pop flex flex-col overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="เลือกรูปภาพ"
      >
        <div className="shrink-0 flex items-center justify-between px-5 h-14 border-b border-line">
          <h2 className="font-semibold text-[16px]">เลือกรูปภาพ</h2>
          <button onClick={onClose} className="p-2 rounded-md text-ink-3 hover:text-ink hover:bg-ground" aria-label="ปิด">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="shrink-0 flex gap-1 px-5 border-b border-line">
          {[["library", "คลังรูปภาพ"], ["upload", "อัปโหลดรูปใหม่"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`h-11 px-4 text-[14px] border-b-2 -mb-px ${
                tab === id ? "border-brand text-brand font-medium" : "border-transparent text-ink-2 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-danger-tint text-[13px] text-[#93000a]">
            <Icon name="warn" size={16} /> {error}
          </div>
        )}

        {tab === "library" ? (
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="shrink-0 flex items-center gap-2 px-5 py-3 border-b border-line">
                <label className="relative">
                  <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="ค้นหาชื่อไฟล์"
                    className="h-8 w-[200px] pl-9 pr-3 rounded-full border border-line text-[13px] outline-none focus:border-brand"
                  />
                </label>
                <select
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className="h-8 px-2.5 rounded-full border border-line text-[13px] bg-white outline-none focus:border-brand"
                >
                  {folders.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <span className="meta ml-auto text-ink-3">{shown.length} รูป</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {items === null ? (
                  <p className="text-center text-[13.5px] text-ink-3 py-16">กำลังโหลดคลังรูป…</p>
                ) : !shown.length ? (
                  <p className="text-center text-[13.5px] text-ink-3 py-16">ไม่พบรูปที่ตรงกับที่ค้นหา</p>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {shown.map((m) => {
                      const on = m.url === picked;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setPicked(m.url)}
                          onDoubleClick={() => onSelect({ url: m.url, alt: pickedAlt })}
                          className={`text-left rounded-lg border overflow-hidden transition ${
                            on ? "border-brand ring-2 ring-brand/20" : "border-line hover:border-ink-3"
                          }`}
                        >
                          <span
                            className="block aspect-square bg-[#F2F6F1] bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: `url('${m.url}')` }}
                          />
                          <span className="block px-2 py-1.5 border-t border-line">
                            <span className="mono block truncate normal-case tracking-normal" title={m.filename}>
                              {m.filename}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="w-[280px] shrink-0 border-l border-line p-4 overflow-y-auto">
              {picked ? (
                <>
                  <span
                    className="block w-full aspect-[4/3] rounded-lg border border-line bg-[#F2F6F1] bg-contain bg-center bg-no-repeat mb-3"
                    style={{ backgroundImage: `url('${picked}')` }}
                  />
                  <p className="mono break-all normal-case tracking-normal text-ink-2 mb-1">{picked}</p>
                  {selectedItem && (
                    <p className="meta text-ink-3 mb-4">
                      {kb(selectedItem.bytes)}
                      {selectedItem.readOnly ? " · รูปเดิมของเว็บ" : " · อัปโหลดผ่านหลังบ้าน"}
                    </p>
                  )}
                  <label className="block">
                    <span className="block text-[12.5px] font-medium text-ink-2 mb-1">ข้อความ ALT (สำหรับ SEO)</span>
                    <input
                      value={pickedAlt}
                      onChange={(e) => setPickedAlt(e.target.value)}
                      placeholder="อธิบายภาพสั้นๆ"
                      className="w-full h-9 px-2.5 rounded-md border border-line text-[13px] outline-none focus:border-brand"
                    />
                    <span className="block text-[11.5px] text-ink-3 mt-1 leading-relaxed">
                      ช่วยให้ Google เข้าใจรูป และให้คนที่ใช้โปรแกรมอ่านหน้าจอเข้าถึงได้
                    </span>
                  </label>
                </>
              ) : (
                <p className="text-[13px] text-ink-3 text-center py-10">เลือกรูปทางซ้ายเพื่อดูรายละเอียด</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 p-6 overflow-y-auto">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); upload([...e.dataTransfer.files]); }}
              className="h-full min-h-[300px] rounded-xl border-2 border-dashed border-line grid place-items-center text-center p-8"
            >
              <div>
                <Icon name="upload" size={38} className="text-ink-3 mx-auto mb-4" />
                <p className="text-[15px] font-medium mb-1">
                  ลากไฟล์มาวางที่นี่ หรือ{" "}
                  <button onClick={() => fileRef.current?.click()} className="text-brand underline">
                    เลือกไฟล์จากเครื่อง
                  </button>
                </p>
                <p className="text-[13px] text-ink-2">รองรับ JPG, PNG, WEBP, GIF, SVG ขนาดไม่เกิน 5 MB</p>
                {busy && <p className="text-[13px] text-brand mt-4">กำลังอัปโหลด…</p>}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => upload([...e.target.files])}
                />
              </div>
            </div>
          </div>
        )}

        <div className="shrink-0 flex items-center gap-2 px-5 h-14 border-t border-line">
          <span className="meta text-ink-3">{picked ? "เลือกแล้ว 1 รูป" : "ยังไม่ได้เลือก"}</span>
          <button onClick={onClose} className="ml-auto h-9 px-4 rounded-lg border border-line text-[14px] hover:border-ink-3">
            ยกเลิก
          </button>
          <button
            onClick={() => onSelect({ url: picked, alt: pickedAlt })}
            disabled={!picked}
            className="h-9 px-4 rounded-lg bg-brand text-white font-medium text-[14px] hover:bg-brand-dark disabled:opacity-40"
          >
            ใช้รูปนี้
          </button>
        </div>
      </div>
    </div>
  );
}
