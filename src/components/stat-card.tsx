interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white" style={{
      borderRadius: "8px",
      padding: "24px",
      boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
    }}>
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "32px", fontWeight: 600, letterSpacing: "-1.28px", lineHeight: 1.25, color: "#171717" }}>
        {value}
      </div>
      <div style={{ fontSize: "14px", color: "#4d4d4d" }}>{label}</div>
    </div>
  );
}
