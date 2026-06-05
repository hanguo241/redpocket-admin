interface StatusBadgeProps {
  status: string;
}

const STYLES: Record<string, { bg: string; color: string }> = {
  active:    { bg: "rgba(34,197,94,0.1)",  color: "#22C55E" },
  confirmed: { bg: "rgba(34,197,94,0.1)",  color: "#22C55E" },
  pending:   { bg: "rgba(234,179,8,0.1)",  color: "#EAB308" },
  expired:   { bg: "rgba(107,114,128,0.1)", color: "#6B7280" },
  refunded:  { bg: "rgba(107,114,128,0.1)", color: "#6B7280" },
  failed:    { bg: "rgba(239,68,68,0.1)",  color: "#EF4444" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STYLES[status] || { bg: "rgba(107,114,128,0.1)", color: "#6B7280" };
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {status}
    </span>
  );
}
