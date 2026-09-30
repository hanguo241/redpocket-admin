"use client";

import { useEffect, useState } from "react";
import { formatAmount } from "@/lib/amount";
import { fetchClaims } from "@/lib/api";
import { DataTable, StatusBadge, PageHeader } from "@/components";

export default function ClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClaims()
      .then((d) => setClaims(d.claims))
      .catch((e) => setError(e.message));
  }, []);

  const columns = [
    { key: "packet_id", label: "红包 ID", render: (v: string) => <span className="font-mono text-xs">{v.slice(0, 8)}...</span> },
    { key: "recipient", label: "领取人", render: (v: string) => <span className="font-mono text-xs">{v.slice(0, 10)}...</span> },
    { key: "amount", label: "金额（AVAX）", render: (v: string) => formatAmount(v) },
    { key: "status", label: "状态", render: (v: string) => <StatusBadge status={v} /> },
    { key: "tx_hash", label: "TxHash", render: (v: string) => <span className="font-mono text-xs">{(v || "—").slice(0, 12)}...</span> },
    { key: "chain", label: "链" },
    { key: "created_at", label: "时间", render: (v: string) => <span className="text-xs" style={{ color: "#94A3B8" }}>{new Date(v).toLocaleString()}</span> },
  ];

  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <PageHeader title="📝 领取记录" />
      <DataTable columns={columns} data={claims} />
    </div>
  );
}
