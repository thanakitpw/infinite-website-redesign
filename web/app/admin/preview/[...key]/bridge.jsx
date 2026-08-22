"use client";
import { useEffect } from "react";

/* สะพานระหว่างตัวอย่างใน iframe กับหน้าแก้ไขที่ครอบอยู่
   - คลิกที่บล็อกไหนในตัวอย่าง → บอกหน้าแก้ไขให้เปิดฟอร์มของบล็อกนั้น
   - หน้าแก้ไขเลือกบล็อก → เลื่อนมาที่บล็อกนั้นแล้วตีกรอบให้เห็น
   ลิงก์ทุกอันถูกกันไว้ไม่ให้พาออกจากตัวอย่าง ไม่งั้นกดทีเดียวหลุดไปทั้งหน้า */
export default function PreviewBridge() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      [data-cms-block]{position:relative;transition:outline-color .15s}
      [data-cms-block]{outline:2px solid transparent;outline-offset:-2px}
      [data-cms-block]:hover{outline-color:rgba(1,132,56,.35);cursor:pointer}
      [data-cms-block].cms-on{outline-color:#018438}
      [data-cms-block].cms-on::after{
        content:attr(data-cms-name);position:absolute;top:8px;left:8px;z-index:9999;
        background:#018438;color:#fff;font:500 12px/1 'IBM Plex Sans Thai',sans-serif;
        padding:7px 11px;border-radius:7px;pointer-events:none;white-space:nowrap}
    `;
    document.head.appendChild(style);

    const post = (msg) => window.parent?.postMessage({ source: "cms-preview", ...msg }, window.location.origin);

    const onClick = (e) => {
      const block = e.target.closest?.("[data-cms-block]");
      // กันทุกการนำทางในตัวอย่าง ไม่ว่าจะกดโดนลิงก์หรือไม่
      e.preventDefault();
      e.stopPropagation();
      if (block) post({ type: "select", id: block.dataset.cmsBlock });
    };
    document.addEventListener("click", onClick, true);

    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.data?.source !== "cms-editor") return;
      if (e.data.type !== "highlight") return;
      document.querySelectorAll("[data-cms-block].cms-on").forEach((el) => {
        el.classList.remove("cms-on");
        el.removeAttribute("data-cms-name");
      });
      const el = document.querySelector(`[data-cms-block="${CSS.escape(e.data.id)}"]`);
      if (!el) return;
      if (e.data.name) el.setAttribute("data-cms-name", "กำลังแก้ไข: " + e.data.name);
      el.classList.add("cms-on");
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("message", onMessage);

    post({ type: "ready" });

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMessage);
      style.remove();
    };
  }, []);

  return null;
}
