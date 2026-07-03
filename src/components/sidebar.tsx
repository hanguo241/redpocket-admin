"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "📊 仪表盘" },
  { href: "/projects", label: "👥 项目方" },
  { href: "/packets", label: "🧧 红包" },
  { href: "/claims", label: "📝 领取记录" },
  { href: "/tokens", label: "🪙 代币管理" },
  { href: "/chains", label: "⛓️ 链配置" },
  { href: "/settings", label: "⚙️ 设置" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 bg-white flex flex-col shrink-0 min-h-screen"
      style={{ boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px" }}>
      <div className="p-4" style={{ boxShadow: "rgba(0, 0, 0, 0.08) 0px -1px 0px 0px inset" }}>
        <Link href="/dashboard" className="flex items-center gap-2"
          style={{ fontSize: "16px", fontWeight: 600, color: "#171717", letterSpacing: "-0.32px" }}>
          <span>🧧</span> RedPacket
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: active ? 500 : 400,
                color: active ? "#171717" : "#666666",
                background: active ? "#fafafa" : "transparent",
                transition: "all 0.15s ease",
                textDecoration: "none",
              }}
              className="hover:text-[#171717]"
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4" style={{ boxShadow: "rgba(0, 0, 0, 0.08) 0px -1px 0px 0px" }}>
        <div style={{ fontSize: "12px", color: "#808080", marginBottom: "8px" }}>{user?.name}</div>
        <button
          onClick={logout}
          className="cursor-pointer transition-colors hover:text-[#171717]"
          style={{ fontSize: "12px", color: "#808080", border: "none", background: "none", padding: 0 }}
        >
          退出登录
        </button>
      </div>
    </aside>
  );
}
