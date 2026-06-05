"use client";

import { useEffect, useState } from "react";
import { fetchDashboard, fetchPackets } from "@/lib/api";
import { StatCard, DataTable, StatusBadge, PageHeader } from "@/components";
import { useRouter } from "next/navigation";

interface DashboardData {
  total_packets: number;
  total_claimed_amount: string;
  total_projects: number;
  active_packets: number;
  total_claims: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [packets, setPackets] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchPackets()])
      .then(([d, p]) => { setData(d); setPackets(p.packets.slice(0, 10)); })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="text-red-400">{error}</div>;
  if (!data) return <div className="text-center py-20" style={{ color: "#94A3B8" }}>加载中...</div>;

  const cards = [
    { icon: "🧧", label: "总红包", value: data.total_packets },
    { icon: "💰", label: "总发放 (wei)", value: (+data.total_claimed_amount).toLocaleString() },
    { icon: "👥", label: "项目方", value: data.total_projects },
    { icon: "📝", label: "领取次数", value: data.total_claims },
  ];

  const columns = [
    { key: "id", label: "ID", render: (v: string) => <span className="font-mono text-xs">{v.slice(0, 8)}...</span> },
    { key: "chain", label: "链" },
    { key: "total_amount", label: "金额 (ETH)", render: (v: string) => (+v / 1e18).toFixed(4) },
    { key: "status", label: "状态", render: (v: string) => <StatusBadge status={v} /> },
    { key: "created_at", label: "时间", render: (v: string) => <span className="text-xs" style={{ color: "#94A3B8" }}>{new Date(v).toLocaleString()}</span> },
  ];

  return (
    <div>
      <PageHeader title="📊 仪表盘" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>
      <div className="rounded-xl p-6" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="font-semibold mb-4">最近红包</h3>
        <DataTable columns={columns} data={packets} onRowClick={(row) => router.push(`/packets/${row.id}`)} />
      </div>
    </div>
  );
}
