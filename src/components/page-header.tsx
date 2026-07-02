interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 style={{
        fontSize: "24px",
        fontWeight: 600,
        letterSpacing: "-0.96px",
        lineHeight: 1.33,
        color: "#171717",
      }}>
        {title}
      </h1>
      {action && <div>{action}</div>}
    </div>
  );
}
