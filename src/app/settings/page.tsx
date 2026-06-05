"use client";

import { useEffect, useState } from "react";
import { fetchSettings } from "@/lib/api";
import { PageHeader } from "@/components";

interface Settings {
  signer_address: string;
  relayer_address: string;
  default_fee_bps: number;
  share_url_host: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings()
      .then((d) => setSettings(d))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="text-red-400">{error}</div>;
  if (!settings) return <div className="text-center py-20" style={{ color: "#94A3B8" }}>加载中...</div>;

  const items = [
    { label: "签名者地址", value: settings.signer_address },
    { label: "代领钱包", value: settings.relayer_address },
    { label: "默认手续费 (bps)", value: settings.default_fee_bps },
    { label: "分享链接域名", value: settings.share_url_host },
  ];

  return (
    <div>
      <PageHeader title="⚙️ 平台设置" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl p-6" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-sm mb-1" style={{ color: "#94A3B8" }}>{item.label}</div>
            <div className="font-mono break-all">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
