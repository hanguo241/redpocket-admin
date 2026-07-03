"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchTokens, createToken, updateToken, deleteToken, fetchChains, type TokenConfig } from "@/lib/api";
import { DataTable, PageHeader } from "@/components";

const TOKEN_TYPES = [
  { value: "native", label: "Native" },
  { value: "erc20", label: "ERC-20" },
  { value: "spl-token", label: "SPL Token" },
  { value: "spl-token-2022", label: "SPL Token 2022" },
  { value: "trc20", label: "TRC-20" },
];

const TOKEN_TYPE_BADGES: Record<string, { color: string; label: string }> = {
  native:    { color: "bg-purple-500/10 text-purple-400", label: "Native" },
  erc20:     { color: "bg-blue-500/10 text-blue-400",    label: "ERC-20" },
  "spl-token":     { color: "bg-green-500/10 text-green-400", label: "SPL" },
  "spl-token-2022":{ color: "bg-teal-500/10 text-teal-400",   label: "SPL-2022" },
  trc20:     { color: "bg-red-500/10 text-red-400",      label: "TRC-20" },
};

function TokenTypeBadge({ type }: { type: string }) {
  const info = TOKEN_TYPE_BADGES[type] || { color: "bg-gray-500/10 text-gray-400", label: type };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-mono ${info.color}`}>
      {info.label}
    </span>
  );
}

// ── 新建/编辑 弹窗 ──
function TokenFormModal({
  title,
  initial,
  chains,
  onSave,
  onClose,
}: {
  title: string;
  initial: Partial<TokenConfig>;
  chains: { chain: string }[];
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    chain: initial.chain || "",
    token_address: initial.token_address || "native",
    symbol: initial.symbol || "",
    name: initial.name || "",
    decimals: initial.decimals ?? 18,
    is_native: initial.is_native ?? false,
    token_type: initial.token_type || "erc20",
    logo_url: initial.logo_url || "",
    sort_order: initial.sort_order ?? 0,
    is_active: initial.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  function set(field: string, value: any) {
    const upd: any = { ...form, [field]: value };
    if (field === "token_type") {
      upd.is_native = value === "native";
      if (value === "native") upd.token_address = "native";
    }
    setForm(upd);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e: any) {
      alert("操作失败: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50, backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          background: "#fff", borderRadius: "12px", padding: 0,
          width: 500, maxHeight: "85vh", overflow: "hidden",
          boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.12) 0px 24px 48px -12px",
        }}
      >
        {/* 标题栏 */}
        <div
          style={{
            padding: "20px 24px 0",
            fontSize: 16, fontWeight: 600, letterSpacing: "-0.32px",
            color: "#171717",
          }}
        >
          {title}
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "16px 24px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 链 + 标准 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>链 *</label>
                {initial.chain ? (
                  <div style={{ ...inputStyle, background: "#fafafa", color: "#808080", cursor: "default" }}>
                    {form.chain}
                  </div>
                ) : (
                  <select
                    style={inputStyle}
                    value={form.chain}
                    onChange={(e) => set("chain", e.target.value)}
                    required
                  >
                    <option value="">选择链</option>
                    {chains.map((c) => (
                      <option key={c.chain} value={c.chain}>{c.chain}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label style={labelStyle}>标准 *</label>
                <select style={inputStyle} value={form.token_type}
                  onChange={(e) => set("token_type", e.target.value)} required>
                  {TOKEN_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Symbol + Name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Symbol *</label>
                <input style={{ ...inputStyle, fontFamily: "var(--font-geist-mono), monospace" }}
                  value={form.symbol} onChange={(e) => set("symbol", e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} value={form.name}
                  onChange={(e) => set("name", e.target.value)} required />
              </div>
            </div>

            {/* 合约地址 */}
            <div>
              <label style={labelStyle}>
                合约地址 / Mint 地址
                {form.token_type === "native" &&
                  <span style={{ color: "#808080", marginLeft: 4, fontWeight: 400 }}>(原生币自动为 native)</span>}
              </label>
              <input style={{ ...inputStyle, fontFamily: "var(--font-geist-mono), monospace" }}
                value={form.token_address} onChange={(e) => set("token_address", e.target.value)}
                disabled={form.token_type === "native"} />
            </div>

            {/* 精度 + 排序 + 启用 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>精度</label>
                <input style={{ ...inputStyle, fontFamily: "var(--font-geist-mono), monospace" }}
                  type="number" min={0} max={18} value={form.decimals}
                  onChange={(e) => set("decimals", Number(e.target.value))} />
              </div>
              <div>
                <label style={labelStyle}>排序</label>
                <input style={{ ...inputStyle, fontFamily: "var(--font-geist-mono), monospace" }}
                  type="number" min={0} value={form.sort_order}
                  onChange={(e) => set("sort_order", Number(e.target.value))} />
              </div>
              <div>
                <label style={labelStyle}>启用</label>
                <div style={{ display: "flex", alignItems: "center", height: 40 }}>
                  <input type="checkbox" checked={form.is_active}
                    onChange={(e) => set("is_active", e.target.checked)}
                    style={{ width: 16, height: 16, cursor: "pointer" }} />
                </div>
              </div>
            </div>

            {/* Logo URL */}
            <div>
              <label style={labelStyle}>Logo URL</label>
              <input style={{ ...inputStyle, fontFamily: "var(--font-geist-mono), monospace" }}
                value={form.logo_url} onChange={(e) => set("logo_url", e.target.value)}
                placeholder="https://..." />
            </div>
          </div>

          {/* 按钮 */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
            <button type="button"
              style={{
                padding: "8px 16px", borderRadius: 6, fontSize: 14,
                background: "#fff", color: "#171717", border: "none",
                cursor: "pointer", fontWeight: 500,
                boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px",
              }}
              className="hover:opacity-80"
              onClick={onClose}>
              取消
            </button>
            <button type="submit" disabled={saving}
              style={{
                padding: "8px 16px", borderRadius: 6, fontSize: 14,
                background: "#171717", color: "#fff", border: "none",
                cursor: saving ? "not-allowed" : "pointer", fontWeight: 500,
                opacity: saving ? 0.5 : 1,
              }}>
              {saving ? "保存中…" : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, color: "#808080", marginBottom: 4, fontWeight: 400,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px", fontSize: 14, lineHeight: "1.43",
  background: "#fff", color: "#171717", border: "none", borderRadius: 6,
  outline: "none", boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px",
  boxSizing: "border-box",
};

// ── 主页面 ──
export default function TokensPage() {
  const [tokens, setTokens] = useState<TokenConfig[]>([]);
  const [chains, setChains] = useState<{ chain: string }[]>([]);
  const [filterChain, setFilterChain] = useState("");
  const [error, setError] = useState("");

  // 弹窗状态
  const [modal, setModal] = useState<{ mode: "create" | "edit"; initial: Partial<TokenConfig> } | null>(null);

  const load = useCallback(async () => {
    try {
      const chainParam = filterChain || undefined;
      const [tokenRes, chainRes] = await Promise.all([
        fetchTokens(chainParam),
        fetchChains(),
      ]);
      setTokens(tokenRes.tokens);
      setChains(chainRes.chains);
    } catch (e: any) {
      setError(e.message);
    }
  }, [filterChain]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(data: any) {
    await createToken(data);
    load();
  }

  async function handleUpdate(data: any) {
    if (!modal?.initial.id) return;
    await updateToken(modal.initial.id, {
      symbol: data.symbol,
      name: data.name,
      decimals: data.decimals,
      token_type: data.token_type,
      logo_url: data.logo_url || undefined,
      sort_order: data.sort_order,
      is_active: data.is_active,
    });
    load();
  }

  async function handleDelete(id: number, symbol: string) {
    if (!confirm(`确定删除 ${symbol}？此操作不可恢复。`)) return;
    try {
      await deleteToken(id);
      load();
    } catch (e: any) {
      alert("删除失败: " + e.message);
    }
  }

  if (error) return <div className="text-red-400">{error}</div>;

  const columns = [
    { key: "chain", label: "链",
      render: (v: string) => <span className="font-semibold text-xs">{v}</span> },
    { key: "symbol", label: "代币",
      render: (v: string, row: any) => (
        <span><span className="font-mono text-sm">{v}</span>
          <span className="text-gray-400 ml-1.5 text-xs">{row.name}</span></span>
      ) },
    { key: "token_address", label: "地址",
      render: (v: string) => (
        <span className="font-mono text-xs truncate block max-w-[160px]" title={v}>
          {v === "native" ? "—" : v}
        </span>
      ) },
    { key: "decimals", label: "精度",
      render: (v: number) => <span className="font-mono text-xs">{v}</span> },
    { key: "token_type", label: "标准",
      render: (v: string) => <TokenTypeBadge type={v} /> },
    { key: "is_active", label: "状态",
      render: (v: boolean) => (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
          v ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-400"
        }`}>{v ? "启用" : "禁用"}</span>
      ) },
    { key: "sort_order", label: "排序",
      render: (v: number) => <span className="font-mono text-xs">{v}</span> },
    { key: "id", label: "操作",
      render: (_: number, row: any) => (
        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{ fontSize: 13, color: "#0072f5", border: "none", background: "none", cursor: "pointer", padding: 0 }}
            className="hover:opacity-70"
            onClick={() => setModal({ mode: "edit", initial: row })}>编辑</button>
          <button
            style={{ fontSize: 13, color: "#e00", border: "none", background: "none", cursor: "pointer", padding: 0 }}
            className="hover:opacity-70"
            onClick={() => handleDelete(row.id, row.symbol)}>删除</button>
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader title="🪙 代币管理" />

      {/* 工具栏 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: 13, color: "#808080" }}>链筛选:</label>
          <select
            style={{ width: "auto", padding: "6px 10px", fontSize: 13 }}
            value={filterChain} onChange={(e) => setFilterChain(e.target.value)}>
            <option value="">全部链</option>
            {chains.map((c) => (
              <option key={c.chain} value={c.chain}>{c.chain}</option>
            ))}
          </select>
          <span style={{ fontSize: 12, color: "#808080" }}>共 {tokens.length} 个代币</span>
        </div>
        <button
          style={{
            padding: "8px 16px", borderRadius: 6, fontSize: 14, fontWeight: 500,
            background: "#171717", color: "#fff", border: "none", cursor: "pointer",
          }}
          className="hover:opacity-80"
          onClick={() => setModal({ mode: "create", initial: {} })}>
          + 新增代币
        </button>
      </div>

      <DataTable columns={columns} data={tokens} />

      {/* 弹窗 */}
      {modal && (
        <TokenFormModal
          title={modal.mode === "create" ? "新增代币" : "编辑代币"}
          initial={modal.initial}
          chains={chains}
          onSave={modal.mode === "create" ? handleCreate : handleUpdate}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
