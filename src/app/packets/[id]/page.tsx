"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchPacket } from "@/lib/api";
import { DataTable, StatusBadge } from "@/components";

export default function PacketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [packet, setPacket] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchPacket(id)
      .then((d) => { setPacket(d.packet); setClaims(d.claims); })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="text-red-400">{error}</div>;
  if (!packet) return <div className="text-center py-20" style={{ color: "#94A3B8" }}>加载中...</div>;

  const fields = [
    ["链", packet.chain],
    ["合约地址", packet.contract],
    ["创建者", packet.creator],
    ["Token", packet.token],
    ["金额 (wei)", (+packet.total_amount).toLocaleString()],
    ["状态", packet.status],
    ["人数", packet.head_count],
    ["Gas 模式", packet.claim_mode],
    ["链上 ID", packet.onchain_packet_id ?? "—"],
    ["过期时间", new Date((packet.end_time as number) * 1000).toLocaleString()],
  ];

  const claimColumns = [
    { key: "recipient", label: "领取人", render: (v: string) => <span className="font-mono text-xs">{v.slice(0, 10)}...</span> },
    { key: "amount", label: "金额 (ETH)", render: (v: string) => (+v / 1e18).toFixed(6) },
    { key: "status", label: "状态", render: (v: string) => <StatusBadge status={v} /> },
    { key: "tx_hash", label: "TxHash", render: (v: string) => <span className="font-mono text-xs">{(v || "—").slice(0, 12)}...</span> },
    { key: "created_at", label: "时间", render: (v: string) => <span className="text-xs" style={{ color: "#94A3B8" }}>{new Date(v).toLocaleString()}</span> },
  ];

  return (
    <div>
      <Link href="/packets" className="inline-block mb-4 text-sm" style={{ color: "#94A3B8" }}>← 返回</Link>
      <h1 className="text-2xl font-bold mb-6">🧧 红包详情</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {fields.map(([k, v]) => (
          <div key={k as string} className="rounded-xl p-4" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs mb-1" style={{ color: "#94A3B8" }}>{k}</div>
            <div className="text-sm font-mono break-all">{v as string}</div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold mb-4">领取记录 ({claims.length})</h3>
      <DataTable columns={claimColumns} data={claims} />
    </div>
  );
}
