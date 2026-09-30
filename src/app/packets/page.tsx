"use client";

import { useEffect, useState } from "react";
import { formatAmount } from "@/lib/amount";
import { fetchPackets } from "@/lib/api";
import { DataTable, StatusBadge, PageHeader } from "@/components";
import { useRouter } from "next/navigation";

export default function PacketsPage() {
  const [packets, setPackets] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchPackets()
      .then((d) => setPackets(d.packets))
      .catch((e) => setError(e.message));
  }, []);

  const columns = [
    { key: "id", label: "ID", render: (v: string) => <span className="font-mono text-xs">{v.slice(0, 8)}...</span> },
    { key: "chain", label: "链" },
    { key: "creator", label: "创建者", render: (v: string) => <span className="font-mono text-xs">{v.slice(0, 10)}...</span> },
    { key: "gross_amount", label: "总额（主单位）", render: (v: string) => formatAmount(v) },
    { key: "total_amount", label: "领取池（主单位）", render: (v: string) => formatAmount(v) },
    { key: "platform_fee_wei", label: "平台费（主单位）", render: (v: string) => formatAmount(v) },
    { key: "status", label: "状态", render: (v: string) => <StatusBadge status={v} /> },
    { key: "created_at", label: "时间", render: (v: string) => <span className="text-xs" style={{ color: "#94A3B8" }}>{new Date(v).toLocaleString()}</span> },
  ];

  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <PageHeader title="🧧 红包" />
      <p className="mb-4 text-sm text-gray-500">金额按 18 位精度换算为主单位（10¹⁸ wei = 1 AVAX）。</p>
      <DataTable columns={columns} data={packets} onRowClick={(row) => router.push(`/packets/${row.id}`)} />
    </div>
  );
}
