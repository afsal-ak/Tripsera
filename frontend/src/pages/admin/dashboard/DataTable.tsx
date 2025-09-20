import React from "react";

interface DataTableProps<T> {
  title: string;
  columns: { key: keyof T; label: string; width?: string }[];
  rows: T[] | null | undefined;
  emptyText?: string;
}

function DataTable<T>({
  title,
  columns,
  rows,
  emptyText = "No data",
}: DataTableProps<T>) {
  //  Always ensure we have safe defaults
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* ----- Header ----- */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {/* ----- Table ----- */}
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  className={`py-2 pr-4 font-medium ${c.width ?? ""}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* ----- Empty State ----- */}
            {safeRows.length === 0 && (
              <tr>
                <td
                  className="py-6 text-gray-500 text-center"
                  colSpan={safeColumns.length}
                >
                  {emptyText}
                </td>
              </tr>
            )}

            {/* ----- Data Rows ----- */}
            {rows!.map((r, idx) => (
              <tr key={idx} className="border-t">
                {safeColumns.map((c) => {
                  const value = r[c.key];

                  return (
                    <td key={String(c.key)} className="py-3 pr-4">
                      {value !== null && value !== undefined
                        ? typeof value === "object"
                          ? JSON.stringify(value) // ✅ Avoid crashing on objects
                          : String(value)
                        : "-"} {/* ✅ Show a dash instead of crashing */}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
