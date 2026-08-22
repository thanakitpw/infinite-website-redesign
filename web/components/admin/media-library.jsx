"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./icons";

const kb = (n) => (!n ? "—" : n > 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + " MB" : Math.round(n / 1024) + " KB");

export default function MediaLibrary() {
  const [data, setData] = useState(null);
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("ทั้งหมด");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "โหลดคลังรูปไม่สำเร็จ");
      setData([...(json.uploaded || []), ...(json.local || [])]);
    } catch (e) {
      setError(e.message);
      setData([]);
    }
  };
  useEffect(() => { load(); }, []);

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
      }
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const folders = useMemo(() => {
    const s = new Set(["ทั้งหมด"]);
    (data || []).forEach((m) => s.add(m.folder || "ทั่วไป"));
    return [...s];
  }, [data]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data || []).filter((m) => {
      if (folder !== "ทั้งหมด" && (m.folder || "ทั่วไป") !== folder) return false;
      return !needle || m.filename.toLowerCase().includes(needle);
    });
  }, [data, q, folder]);

  const uploadedCount = (data || []).filter((m) => !m.readOnly).length;

  return (
    <div className="px-6 py-6 max-w-[1180px]">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">คลังรูปภาพ</h1>
          <p className="text-[13.5px] text-ink-2 mt-0.5">
            {data ? `${data.length} รูป · อัปโหลดผ่านหลังบ้าน ${uploadedCount} รูป` : "กำลังโหลด…"}
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-brand text-white font-medium text-[13.5px] hover:bg-brand-dark disabled:opacity-50"
        >
          <Icon name="upload" size={16} />
          {busy ? "กำลังอัปโหลด…" : "อัปโหลดรูปภาพ"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload([...e.target.files])} />
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-lg bg-danger-tint text-[13px] text-[#93000a]">
          <Icon name="warn" size={16} /> {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <label className="relative">
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อไฟล์"
            className="h-8 w-[220px] pl-9 pr-3 rounded-full border border-line bg-white text-[13px] outline-none focus:border-brand"
          />
        </label>
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`h-8 px-3.5 rounded-full text-[13px] border transition ${
              folder === f ? "bg-brand text-white border-brand" : "bg-white border-line text-ink-2 hover:border-ink-3"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {data === null ? (
        <p className="text-center text-[13.5px] text-ink-3 py-20">กำลังโหลดคลังรูป…</p>
      ) : (
        <div className="grid grid-cols-6 gap-3">
          {shown.map((m) => (
            <div key={m.id} className="bg-white border border-line rounded-lg overflow-hidden">
              <span
                className="block aspect-square bg-[#F2F6F1] bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${m.url}')` }}
              />
              <span className="block px-2 py-2 border-t border-line">
                <span className="mono block truncate normal-case tracking-normal" title={m.filename}>
                  {m.filename}
                </span>
                <span className="meta block text-ink-3">
                  {kb(m.bytes)}
                  {m.readOnly ? "" : " · ใหม่"}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
