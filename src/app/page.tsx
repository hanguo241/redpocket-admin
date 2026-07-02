"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@redpacket.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "登录失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white" style={{
        width: "384px",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
      }}>
        <div className="text-center mb-8">
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🧧</div>
          <h1 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.96px", color: "#171717" }}>
            管理后台
          </h1>
          <p style={{ fontSize: "14px", color: "#808080", marginTop: "4px" }}>RedPacket Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p style={{ fontSize: "12px", color: "#ff5b4f" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full cursor-pointer disabled:opacity-50 transition-opacity hover:opacity-80"
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.43,
              background: "#171717",
              color: "#fff",
              border: "none",
            }}
          >
            {busy ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
