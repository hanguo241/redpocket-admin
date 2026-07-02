interface StatusBadgeProps {
  status: string;
}

const STYLES: Record<string, { bg: string; color: string }> = {
  active:    { bg: "#ebf5ff", color: "#0068d6" },
  confirmed: { bg: "#ebf5ff", color: "#0068d6" },
  pending:   { bg: "#fafafa", color: "#808080" },
  expired:   { bg: "#fafafa", color: "#808080" },
  refunded:  { bg: "#fafafa", color: "#808080" },
  failed:    { bg: "#fafafa", color: "#808080" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STYLES[status] || { bg: "#fafafa", color: "#808080" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0px 10px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: "24px",
        background: style.bg,
        color: style.color,
      }}
    >
      {status}
    </span>
  );
}
