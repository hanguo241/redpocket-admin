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

  if (error) return <div style={{ color: "#ff5b4f" }}>{error}</div>;
  if (!packet) return <div className="text-center py-20" style={{ color: "#808080" }}>加载中...</div>;

  const fields: [string, string | number][] = [
    ["链", packet.chain],
    ["合约地址", packet.contract],
    ["创建者", packet.creator],
    ["Token", packet.token],
    ["总额 (wei)", (+(packet.gross_amount || packet.total_amount)).toLocaleString()],
    ["领取池 (wei)", (+packet.total_amount).toLocaleString()],
    ["平台费 (wei)", (+(packet.platform_fee_wei || "0")).toLocaleString()],
    ["状态", packet.status],
    ["人数", packet.head_count],
    ["Gas 模式", packet.claim_mode],
    ["链上 ID", packet.onchain_packet_id ?? "—"],
    ["过期时间", new Date((packet.end_time as number) * 1000).toLocaleString()],
  ];

  const claimColumns = [
    { key: "recipient", label: "领取人", render: (v: string) => <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "12px" }}>{v.slice(0, 10)}...</span> },
    { key: "amount", label: "金额 (ETH)", render: (v: string) => (+v / 1e18).toFixed(6) },
    { key: "status", label: "状态", render: (v: string) => <StatusBadge status={v} /> },
    { key: "tx_hash", label: "TxHash", render: (v: string) => <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "12px" }}>{(v || "—").slice(0, 12)}...</span> },
    { key: "created_at", label: "时间", render: (v: string) => <span style={{ fontSize: "12px", color: "#808080" }}>{new Date(v).toLocaleString()}</span> },
  ];

  return (
    <div>
      <Link href="/packets" style={{ display: "inline-block", marginBottom: "16px", fontSize: "14px", color: "#666666", textDecoration: "none" }}
        className="hover:text-[#171717]">
        ← 返回
      </Link>
      <h1 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.96px", color: "#171717", marginBottom: "24px" }}>
        🧧 红包详情
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {fields.map(([k, v]) => (
          <div key={k as string} className="bg-white" style={{
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px",
          }}>
            <div style={{ fontSize: "12px", color: "#808080", marginBottom: "4px" }}>{k}</div>
            <div style={{ fontSize: "14px", fontFamily: "var(--font-geist-mono), monospace", wordBreak: "break-all", color: "#171717" }}>
              {v}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.32px", color: "#171717", marginBottom: "16px" }}>
        领取记录 ({claims.length})
      </h3>
      <DataTable columns={claimColumns} data={claims} />
    </div>
  );
}
