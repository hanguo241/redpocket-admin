import { formatUnits } from "viem";

/** Format base-unit integers without losing precision through Number. */
export function formatAmount(value: string | undefined | null, decimals = 18): string {
  if (value == null || value === "") return "—";
  try {
    const [whole, fraction] = formatUnits(BigInt(value), decimals).split(".");
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fraction ? `${grouped}.${fraction}` : grouped;
  } catch {
    return "—";
  }
}

export function nativeSymbol(chain: string): string {
  const symbols: Record<string, string> = {
    "AVAX-FUJI": "AVAX", AVAX: "AVAX", ETH: "ETH", BSC: "BNB",
    LOCAL: "ETH", SEPOLIA: "ETH", POLYGON: "POL", SOL: "SOL", SUI: "SUI",
  };
  return symbols[chain?.toUpperCase()] || "主单位";
}
