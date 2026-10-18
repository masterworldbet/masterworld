"use client";

import { FormEvent, useState } from "react";

export default function AnalyticsLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }
      const requestedNext = new URLSearchParams(window.location.search).get("next");
      const safeNext = requestedNext && requestedNext.startsWith("/admin/") && !requestedNext.startsWith("//") ? requestedNext : "/admin/analytics";
      window.location.href = safeNext;
    } catch {
      setError("เชื่อมต่อไม่ได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="adminLoginPage">
      <form className="loginCard" onSubmit={submit}>
        <div className="loginMark">MW</div>
        <p className="eyebrow">MASTER WORLD CLASS</p>
        <h1>เข้าสู่ระบบผู้ดูแล</h1>
        <p className="loginDescription">พื้นที่สำหรับผู้ดูแลเว็บไซต์เท่านั้น</p>
        <label htmlFor="admin-password">รหัสผ่านผู้ดูแล</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          maxLength={300}
          placeholder="กรอกรหัสผ่าน"
        />
        {error ? <p className="loginError" role="alert">{error}</p> : null}
        <button type="submit" disabled={loading || !password}>
          {loading ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}
        </button>
      </form>
      <style jsx>{`
        .adminLoginPage { min-height: 100svh; display: grid; place-items: center; padding: 24px; box-sizing: border-box; background: radial-gradient(circle at 50% 0%, rgba(240,169,0,.13), transparent 35%), #070809; color: #f5f5f5; }
        .loginCard { width: min(100%, 420px); padding: 32px; box-sizing: border-box; border: 1px solid #282a2d; border-radius: 24px; background: #111315; box-shadow: 0 24px 80px #0008; }
        .loginMark { width: 52px; height: 52px; display: grid; place-items: center; border-radius: 16px; background: linear-gradient(135deg,#ffe08a,#e8a400); color: #211700; font-weight: 900; }
        .eyebrow { margin: 22px 0 8px; color: #e6b844; font-size: 11px; letter-spacing: .18em; font-weight: 800; }
        h1 { margin: 0; font-size: 26px; }
        .loginDescription { color: #969ba3; font-size: 14px; margin: 9px 0 26px; }
        label { display: block; margin-bottom: 8px; font-size: 13px; color: #d5d7da; }
        input { width: 100%; box-sizing: border-box; height: 48px; padding: 0 14px; color: #fff; background: #090a0b; border: 1px solid #34373b; border-radius: 11px; outline: none; }
        input:focus { border-color: #e8b83f; }
        button { width: 100%; height: 48px; margin-top: 16px; border: 0; border-radius: 11px; background: linear-gradient(180deg,#ffdc76,#e9a800); color: #211700; font-weight: 900; cursor: pointer; }
        button:disabled { opacity: .55; cursor: wait; }
        .loginError { color: #ff8f8f; font-size: 13px; margin: 12px 0 0; }
        @media (max-width: 480px) { .loginCard { padding: 25px 20px; } }
      `}</style>
    </main>
  );
}
