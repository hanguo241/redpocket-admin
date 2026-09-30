"use client";

import { useEffect, useState } from "react";
import { formatAmount } from "@/lib/amount";
import { fetchDashboard, fetchPackets } from "@/lib/api";
import { StatCard, DataTable, StatusBadge, PageHeader } from "@/components";
import { useRouter } from "next/navigation";

interface DashboardData {
  total_packets: number;
  total_claimed_amount: string;
  total_projects: number;
  active_packets: number;
  total_claims: number;
  total_platform_fees_wei: string;
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

  if (error) return <div style={{ color: "#ff5b4f" }}>{error}</div>;
  if (!data) return <div className="text-center py-20" style={{ color: "#808080" }}>加载中...</div>;

  const cards = [
    { icon: "🧧", label: "总红包", value: data.total_packets },
    { icon: "💰", label: "总发放（AVAX）", value: formatAmount(data.total_claimed_amount) },
    { icon: "🏦", label: "平台费（AVAX）", value: formatAmount(data.total_platform_fees_wei || "0") },
    { icon: "👥", label: "项目方", value: data.total_projects },
  ];

  const columns = [
    { key: "id", label: "ID", render: (v: string) => <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "12px" }}>{v.slice(0, 8)}...</span> },
    { key: "chain", label: "链" },
    { key: "gross_amount", label: "总额（AVAX）", render: (v: string) => formatAmount(v) },
    { key: "platform_fee_wei", label: "平台费（AVAX）", render: (v: string) => formatAmount(v) },
    { key: "status", label: "状态", render: (v: string) => <StatusBadge status={v} /> },
    { key: "created_at", label: "时间", render: (v: string) => <span style={{ fontSize: "12px", color: "#808080" }}>{new Date(v).toLocaleString()}</span> },
  ];

  return (
    <div>
      <PageHeader title="📊 仪表盘" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>
      <div className="bg-white" style={{
        borderRadius: "8px",
        padding: "24px",
        boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
      }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#171717", letterSpacing: "-0.32px", marginBottom: "16px" }}>
          最近红包
        </h3>
        <DataTable columns={columns} data={packets} onRowClick={(row) => router.push(`/packets/${row.id}`)} />
      </div>
    </div>
  );
}
