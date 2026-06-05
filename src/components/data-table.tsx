interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export function DataTable({ columns, data, onRowClick }: DataTableProps) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}>
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-sm font-medium"
                style={{ color: "#94A3B8", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-sm" style={{ color: "#94A3B8" }}>
                暂无数据
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id || row.key || i}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer" : ""}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-sm ${col.className || ""}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
