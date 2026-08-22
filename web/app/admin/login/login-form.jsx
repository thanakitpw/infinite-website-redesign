"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "../../../components/admin/icons";
import { browserClient } from "../../../lib/supabase/browser";

export default function LoginForm({ next, reason }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(
    reason === "no-access"
      ? "บัญชีนี้ยังไม่มีสิทธิ์เข้าระบบหลังบ้าน ติดต่อผู้ดูแลเพื่อเพิ่มสิทธิ์"
      : ""
  );

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const sb = browserClient();
    const { error: err } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (err) {
      setBusy(false);
      setError(
        err.message === "Invalid login credentials"
          ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
          : "เข้าสู่ระบบไม่สำเร็จ — " + err.message
      );
      return;
    }
    router.replace(next && next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  };

  const field =
    "w-full h-11 px-3 rounded-lg border border-line bg-white text-[15px] focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none transition";

  return (
    <form onSubmit={submit} className="w-full max-w-[380px]">
      <h2 className="text-[26px] font-semibold mb-1">เข้าสู่ระบบ</h2>
      <p className="text-[14px] text-ink-2 mb-7">จัดการเนื้อหาเว็บไซต์ Infinite Material</p>

      {error && (
        <div className="flex gap-2.5 mb-5 p-3 rounded-lg bg-danger-tint text-[13px] leading-relaxed text-[#93000a]">
          <Icon name="warn" size={18} className="shrink-0 mt-px" />
          <span>{error}</span>
        </div>
      )}

      <label className="block mb-4">
        <span className="block text-[13px] font-medium mb-1.5">อีเมล</span>
        <input
          className={field}
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
        />
      </label>

      <label className="block mb-5">
        <span className="block text-[13px] font-medium mb-1.5">รหัสผ่าน</span>
        <span className="relative block">
          <input
            className={field + " pr-11"}
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-ink-3 hover:text-ink rounded-md"
          >
            <Icon name="eye" size={18} />
          </button>
        </span>
      </label>

      <button
        type="submit"
        disabled={busy}
        className="w-full h-11 rounded-lg bg-brand text-white font-medium text-[15px] hover:bg-brand-dark disabled:opacity-60 transition"
      >
        {busy ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </button>

      <p className="text-[12.5px] text-ink-3 mt-6 text-center leading-relaxed">
        มีปัญหาการเข้าใช้งาน ติดต่อผู้ดูแลระบบ
        <br />
        <a href="tel:020410119" className="text-brand font-medium">02-041-0119</a>
      </p>
    </form>
  );
}
