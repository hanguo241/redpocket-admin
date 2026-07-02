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
    <div className="bg-white" style={{
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px",
    }}>
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left"
                style={{
                  padding: "12px 16px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#808080",
                  borderBottom: "1px solid #ebebeb",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12" style={{ fontSize: "14px", color: "#808080" }}>
                暂无数据
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id || row.key || i}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer" : ""}
                style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fafafa"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${col.className || ""}`}
                    style={{ fontSize: "14px", color: "#4d4d4d" }}>
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
