"use client";

import { useEffect, useState } from "react";
import { fetchSettings, fetchGasConfig, updateGasConfig } from "@/lib/api";
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

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [gasConfig, setGasConfig] = useState<GasConfig | null>(null);
  const [editGas, setEditGas] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchSettings().then(setSettings),
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

  if (error) return <div className="text-red-400">{error}</div>;
  if (!settings) return <div className="text-center py-20" style={{ color: "#94A3B8" }}>加载中...</div>;

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
          <div key={item.label} className="rounded-xl p-6" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-sm mb-1" style={{ color: "#94A3B8" }}>{item.label}</div>
            <div className="font-mono break-all">{String(item.value)}</div>
          </div>
        ))}
      </div>

      {/* Gas 配置 */}
      <div className="rounded-xl p-6" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-lg font-semibold text-white mb-4">⛽ Gas 配置</h3>
        {gasConfig ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: "#94A3B8" }}>每笔预估 Gas</label>
                <input
                  type="text"
                  value={editGas.gas_per_claim || ""}
                  onChange={(e) => setEditGas({ ...editGas, gas_per_claim: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-redpacket"
                  style={{ background: "#0f0f23", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
                <p className="text-xs mt-1" style={{ color: "#64748B" }}>单位: gas。默认 100000</p>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "#94A3B8" }}>Gas 估算倍数</label>
                <input
                  type="text"
                  value={editGas.gas_estimate_multiplier || ""}
                  onChange={(e) => setEditGas({ ...editGas, gas_estimate_multiplier: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-redpacket"
                  style={{ background: "#0f0f23", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
                <p className="text-xs mt-1" style={{ color: "#64748B" }}>默认 1.2 (20% 缓冲)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveGas}
                disabled={saving}
                className="rounded-full bg-redpacket px-6 py-2 text-sm font-semibold text-white hover:bg-redpacket-dark transition-colors disabled:opacity-50"
              >
                {saving ? "保存中..." : "保存"}
              </button>
              {saved && <span className="text-sm text-green-400">✅ 已保存</span>}
            </div>
          </div>
        ) : (
          <p style={{ color: "#94A3B8" }}>加载中...</p>
        )}
      </div>
    </div>
  );
}
