import { useState } from "react";
import type { IDateFilter, DateFilter } from "@/types/IDashboard";
import { CalendarDays } from "lucide-react";

export default function DateFilterControls({
  value,
  onChange,
}: {
  value: IDateFilter;
  onChange: (v: IDateFilter) => void;
}) {
  const [isCustomMode, setIsCustomMode] = useState(value.filter === "custom");
  const [customStart, setCustomStart] = useState<string>(value.startDate || "");
  const [customEnd, setCustomEnd] = useState<string>(value.endDate || "");

  const setQuick = (filter: DateFilter) => {
    setIsCustomMode(false);
    onChange({ filter, startDate: undefined, endDate: undefined });
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) {
      alert("Please select both start and end dates!");
      return;
    }
    onChange({ filter: "custom", startDate: customStart, endDate: customEnd });
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:items-end gap-3">
      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {(["today", "this_week", "this_month", "this_year"] as DateFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setQuick(f)}
            className={`px-3 py-2 rounded-2xl text-sm border transition ${
              value.filter === f
                ? "bg-black text-white border-black"
                : "bg-white hover:bg-gray-50 border-gray-300"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}

        {/* Custom Mode Toggle */}
        <button
          onClick={() => setIsCustomMode(true)}
          className={`px-3 py-2 rounded-2xl text-sm border transition ${
            isCustomMode
              ? "bg-black text-white border-black"
              : "bg-white hover:bg-gray-50 border-gray-300"
          }`}
        >
          Custom
        </button>
      </div>

      {/* Custom Date Pickers */}
      {isCustomMode && (
        <div className="flex flex-col md:flex-row items-start md:items-end gap-3 md:ml-auto">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <input
              type="date"
              className="px-3 py-2 rounded-xl border border-gray-300"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <input
              type="date"
              className="px-3 py-2 rounded-xl border border-gray-300"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApplyCustom}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
