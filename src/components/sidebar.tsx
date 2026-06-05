"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "📊 仪表盘" },
  { href: "/projects", label: "👥 项目方" },
  { href: "/packets", label: "🧧 红包" },
  { href: "/claims", label: "📝 领取记录" },
  { href: "/chains", label: "⛓️ 链配置" },
  { href: "/settings", label: "⚙️ 设置" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 bg-[#0D0D0D] border-r border-white/5 flex flex-col shrink-0">
      <div className="p-4 border-b border-white/5">
        <Link href="/dashboard" className="text-lg font-bold" style={{ color: "#FF4D4F" }}>
          🧧 RedPacket
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "text-white font-medium"
                  : "text-[#94A3B8] hover:text-white"
              }`}
              style={active ? { background: "rgba(255,77,79,0.15)", color: "#FF4D4F" } : {}}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="text-xs text-[#94A3B8] mb-2">{user?.name}</div>
        <button
          onClick={logout}
          className="text-xs text-[#94A3B8] hover:text-red-500 transition-colors cursor-pointer"
        >
          退出登录
        </button>
      </div>
    </aside>
  );
}
