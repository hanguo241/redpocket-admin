interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-xl p-6" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm" style={{ color: "#94A3B8" }}>{label}</div>
    </div>
  );
}
