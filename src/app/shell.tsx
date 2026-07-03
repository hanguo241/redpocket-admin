"use client";

import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div style={{ color: "#808080" }}>加载中...</div>
      </div>
    );
  }

  if (!user) {
    return <main className="flex-1 bg-white">{children}</main>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto p-8 bg-white">{children}</main>
    </div>
  );
}
