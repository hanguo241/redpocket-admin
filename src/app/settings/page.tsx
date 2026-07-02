"use client";

import { useEffect, useState } from "react";
import { fetchSettings, fetchGasConfig, prepareFeeWithdrawTransaction, updateGasConfig } from "@/lib/api";
import { PageHeader } from "@/components";

interface Settings {
  signer_address: string;
  relayer_address: string;
  default_fee_bps: number;
  share_url_host: string;
}

interface GasConfig {
  gas_per_claim: string;
  gas_estimate_multiplier: string;
  [key: string]: string;
}

interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [gasConfig, setGasConfig] = useState<GasConfig | null>(null);
  const [editGas, setEditGas] = useState<Record<string, string>>({});
  const [withdrawChain, setWithdrawChain] = useState("ETH");
  const [withdrawToken, setWithdrawToken] = useState("native");
  const [withdrawTo, setWithdrawTo] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawTx, setWithdrawTx] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchSettings().then((s) => {
        setSettings(s);
        setWithdrawTo(s.signer_address);
      }),
      fetchGasConfig().then((d) => {
        setGasConfig(d.config as GasConfig);
        setEditGas(d.config as Record<string, string>);
      }),
    ]).catch((e) => setError(e.message));
  }, []);

  async function handleSaveGas() {
    setSaving(true);
    setSaved(false);
    try {
      await updateGasConfig(editGas);
      setGasConfig(editGas as GasConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleWithdrawFees() {
    setWithdrawing(true);
    setWithdrawTx("");
    setError("");
    try {
      const res = await prepareFeeWithdrawTransaction({
        chain: withdrawChain,
        token: withdrawToken,
        to: withdrawTo,
        amount: withdrawAmount,
      });

      const provider = (window as Window & { ethereum?: EthereumProvider }).ethereum;
      if (!provider) throw new Error("No Ethereum provider found");

      const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [{
          from: accounts[0],
          to: res.transaction.to,
          data: res.transaction.data,
          value: "0x0",
        }],
      }) as string;

      setWithdrawTx(txHash);
    } catch (e: any) {
      setError(e.message || "手续费提现交易失败");
    } finally {
      setWithdrawing(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
  };

  if (error) return <div style={{ color: "#ff5b4f" }}>{error}</div>;
  if (!settings) return <div className="text-center py-20" style={{ color: "#808080" }}>加载中...</div>;

  const items = [
    { label: "签名者地址", value: settings.signer_address },
    { label: "代领钱包", value: settings.relayer_address },
    { label: "默认手续费 (bps)", value: settings.default_fee_bps },
    { label: "分享链接域名", value: settings.share_url_host },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="⚙️ 平台设置" />

      {/* 基本信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label} style={cardStyle}>
            <div style={{ fontSize: "12px", color: "#808080", marginBottom: "4px" }}>{item.label}</div>
            <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "14px", color: "#171717", wordBreak: "break-all" }}>
              {String(item.value)}
            </div>
          </div>
        ))}
      </div>

      {/* 平台手续费提现 */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.32px", color: "#171717", marginBottom: "16px" }}>
          平台手续费提现
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#808080", marginBottom: "4px" }}>链</label>
            <input type="text" value={withdrawChain} onChange={(e) => setWithdrawChain(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#808080", marginBottom: "4px" }}>Token</label>
            <input type="text" value={withdrawToken} onChange={(e) => setWithdrawToken(e.target.value)} placeholder="native 或 ERC20 地址" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#808080", marginBottom: "4px" }}>收款地址</label>
            <input type="text" value={withdrawTo} onChange={(e) => setWithdrawTo(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#808080", marginBottom: "4px" }}>金额 (wei)</label>
            <input type="text" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleWithdrawFees}
            disabled={withdrawing || !withdrawAmount || !withdrawTo}
            className="btn-primary"
          >
            {withdrawing ? "发送中..." : "准备并发送交易"}
          </button>
          {withdrawTx && <span style={{ fontSize: "13px", color: "#171717", fontFamily: "var(--font-geist-mono), monospace" }}>Tx: {withdrawTx.slice(0, 12)}...</span>}
        </div>
      </div>

      {/* Gas 配置 */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.32px", color: "#171717", marginBottom: "16px" }}>
          ⛽ Gas 配置
        </h3>
        {gasConfig ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#808080", marginBottom: "4px" }}>每笔预估 Gas</label>
                <input
                  type="text"
                  value={editGas.gas_per_claim || ""}
                  onChange={(e) => setEditGas({ ...editGas, gas_per_claim: e.target.value })}
                />
                <p style={{ fontSize: "12px", color: "#808080", marginTop: "4px" }}>单位: gas。默认 100000</p>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#808080", marginBottom: "4px" }}>Gas 估算倍数</label>
                <input
                  type="text"
                  value={editGas.gas_estimate_multiplier || ""}
                  onChange={(e) => setEditGas({ ...editGas, gas_estimate_multiplier: e.target.value })}
                />
                <p style={{ fontSize: "12px", color: "#808080", marginTop: "4px" }}>默认 1.2 (20% 缓冲)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleSaveGas} disabled={saving} className="btn-primary">
                {saving ? "保存中..." : "保存"}
              </button>
              {saved && <span style={{ fontSize: "13px", color: "#171717" }}>✅ 已保存</span>}
            </div>
          </div>
        ) : (
          <p style={{ color: "#808080" }}>加载中...</p>
        )}
      </div>
    </div>
  );
}
