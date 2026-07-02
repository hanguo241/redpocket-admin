const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export async function api<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new ApiError(res.status, body?.error?.message || res.statusText);
  }
  return res.json();
}

// 认证
export function login(email: string, password: string) {
  return api<{ token: string; admin_id: string; name: string; role: string }>(
    "/api/v1/admin/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

// Dashboard
export function fetchDashboard() {
  return api<{
    total_packets: number;
    total_claimed_amount: string;
    total_projects: number;
    active_packets: number;
    total_claims: number;
    total_platform_fees_wei: string;
  }>("/api/v1/admin/dashboard");
}

// 项目方
export function fetchProjects() {
  return api<{ projects: any[] }>("/api/v1/admin/projects");
}
export function createProject(name: string) {
  return api("/api/v1/admin/projects", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// 红包
export function fetchPackets() {
  return api<{ packets: any[] }>("/api/v1/admin/packets");
}
export function fetchPacket(id: string) {
  return api<{ packet: any; claims: any[] }>(`/api/v1/admin/packets/${id}`);
}

// 领取记录
export function fetchClaims() {
  return api<{ claims: any[] }>("/api/v1/admin/claims");
}

// 链配置
export function fetchChains() {
  return api<{ chains: any[] }>("/api/v1/admin/chains");
}
export function updateChain(chain: string, data: any) {
  return api(`/api/v1/admin/chains/${chain}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// 设置
export function fetchSettings() {
  return api<{
    signer_address: string;
    relayer_address: string;
    default_fee_bps: number;
    share_url_host: string;
  }>("/api/v1/admin/settings");
}

// Gas 配置
export function fetchGasConfig() {
  return api<{ config: Record<string, string> }>("/api/v1/admin/gas-config");
}

export function updateGasConfig(config: Record<string, string>) {
  return api("/api/v1/admin/gas-config", {
    method: "PUT",
    body: JSON.stringify({ config }),
  });
}

// 平台手续费
export function prepareFeeWithdrawTransaction(data: {
  chain: string;
  token: string;
  to: string;
  amount: string;
}) {
  return api<{
    transaction: { to: string; data: string; value: string };
    chain: string;
    chain_id: number;
    token: string;
    amount: string;
    recipient: string;
  }>("/api/v1/admin/fees/withdraw-transaction", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
