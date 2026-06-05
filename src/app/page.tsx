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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 rounded-xl p-8" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🧧</div>
          <h1 className="text-xl font-bold">管理后台</h1>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>RedPacket Admin</p>
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
            <p className="text-xs" style={{ color: "#EF4444" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white border-none cursor-pointer disabled:opacity-50 transition-colors"
            style={{ background: "#FF4D4F" }}
          >
            {busy ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
