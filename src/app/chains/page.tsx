"use client";

import { useEffect, useState } from "react";
import { fetchChains, updateChain } from "@/lib/api";
import { DataTable, PageHeader } from "@/components";

export default function ChainsPage() {
  const [chains, setChains] = useState<any[]>([]);
  const [error, setError] = useState("");

  const load = () => {
    fetchChains()
      .then((d) => setChains(d.chains))
      .catch((e) => setError(e.message));
  };

  useEffect(() => { load(); }, []);

  const handleEdit = async (chain: any) => {
    const rpc = prompt(`RPC URL (${chain.chain}):`, chain.rpc_url || "");
    if (rpc === null) return;
    const contract = prompt("合约地址:", chain.contract_address || "");
    if (contract === null) return;
    try {
      await updateChain(chain.chain, { rpc_url: rpc, contract_address: contract, is_active: chain.is_active });
      load();
    } catch (e: any) {
      alert("失败: " + e.message);
    }
  };

  const columns = [
    { key: "chain", label: "链", render: (v: string) => <span className="font-semibold">{v}</span> },
    { key: "chain_id", label: "Chain ID" },
    { key: "rpc_url", label: "RPC URL", render: (v: string) => <span className="font-mono text-xs truncate block max-w-[200px]">{v || "—"}</span> },
    { key: "contract_address", label: "合约地址", render: (v: string) => <span className="font-mono text-xs truncate block max-w-[150px]">{v || "—"}</span> },
    {
      key: "is_active", label: "状态",
      render: (v: boolean) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${v ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-400"}`}>
          {v ? "启用" : "禁用"}
        </span>
      ),
    },
    {
      key: "chain", label: "操作",
      render: (_: string, row: any) => (
        <button className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer" onClick={() => handleEdit(row)}>
          编辑
        </button>
      ),
    },
  ];

  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <PageHeader title="⛓️ 链配置" />
      <DataTable columns={columns} data={chains} />
    </div>
  );
}
