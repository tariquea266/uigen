import { TableData } from "@/types";

const DEFAULT_COLUMNS = ["Name", "Value", "Status"];
const DEFAULT_ROWS    = [
  ["Item 1", "$100", "✅ Active"],
  ["Item 2", "$200", "⏳ Pending"],
  ["Item 3", "$150", "✅ Active"],
];

export default function TableWidget({ title, columns, rows }: TableData) {
  const cols = columns || DEFAULT_COLUMNS;
  const data = rows    || DEFAULT_ROWS;

  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
        <span style={{ color: "#2563eb", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>
          ⊞ {title || "Data Table"}
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {cols.map((col) => (
                <th key={col} style={{ padding: "10px 16px", textAlign: "left", color: "#6b7280", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 16px", color: "#374151", fontSize: 13, whiteSpace: "nowrap" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
