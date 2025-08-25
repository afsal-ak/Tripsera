// import { handleBookingChart } from "@/services/admin/dashboardService";
// import type{ IBookingsChartPoint } from "@/types/IDashboard";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Legend,
// } from "recharts";
// import {TrendingUp} from "lucide-react";

// interface BookingsChartProps {
//   data: IBookingsChartPoint[];
//   type?: "line" | "bar";
// }
// function formatLabel(item: any): string {
//   if (typeof item._id === "string") return item._id;

//   // When _id is an object { day, month, year }
//   const { day, month, year } = item._id;
//   if (day && month && year) {
//     // Example: 1 -> "01 Aug"
//     return `${String(day).padStart(2, "0")} ${new Date(year, month - 1).toLocaleString("default", { month: "short" })}`;
//   } else if (month && year) {
//     // Example: Aug 2025
//     return `${new Date(year, month - 1).toLocaleString("default", { month: "short" })} ${year}`;
//   } else {
//     // Example: Year only
//     return `${year}`;
//   }
// }

//   function BookingsChart({ data, type = "line" }: BookingsChartProps) {
//   // Format data for chart display
//   const formattedData = data.map((item) => ({
//     ...item,
//     label: formatLabel(item),
//   }));

//   return (
//     <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold flex items-center gap-2">
//           <TrendingUp className="w-5 h-5" /> Bookings Trend
//         </h3>
//       </div>
//       <div className="h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           {type === "line" ? (
//             <LineChart data={formattedData} margin={{ left: 10, right: 10, bottom: 10 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="label" interval={0} tick={{ fontSize: 12 }} />
//               <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="bookingCount"
//                 stroke="#2563eb"
//                 strokeWidth={2}
//                 dot={false}
//                 name="Bookings"
//               />
//               <Line
//                 type="monotone"
//                 dataKey="totalRevenue"
//                 stroke="#22c55e"
//                 strokeWidth={2}
//                 dot={false}
//                 name="Revenue"
//               />
//             </LineChart>
//           ) : (
//             <BarChart data={formattedData} margin={{ left: 10, right: 10, bottom: 10 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="label" interval={0} tick={{ fontSize: 12 }} />
//               <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="bookingCount" fill="#2563eb" name="Bookings" />
//               <Bar dataKey="totalRevenue" fill="#22c55e" name="Revenue" />
//             </BarChart>
//           )}
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
// export default BookingsChart

import type { IBookingsChartPoint } from "@/types/IDashboard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface BookingsChartProps {
  data: IBookingsChartPoint[];
  type?: "line" | "bar";
}

// Safe formatter
function formatLabel(item: any): string {
  if (!item || !item._id) return "N/A";

  if (typeof item._id === "string") return item._id;

  const { day, month, year } = item._id;

  if (day && month && year) {
    return `${String(day).padStart(2, "0")} ${new Date(year, month - 1).toLocaleString("default", {
      month: "short",
    })}`;
  } else if (month && year) {
    return `${new Date(year, month - 1).toLocaleString("default", {
      month: "short",
    })} ${year}`;
  } else if (year) {
    return `${year}`;
  }
  return "Unknown";
}

export default function BookingsChart({ data, type = "bar" }: BookingsChartProps) {
    //  Format safely
  const formattedData = data.map((item) => ({
    ...item,
    label: formatLabel(item),
    totalBookings: Number(item.totalBookings) || 0,
    totalRevenue: Number(item.totalRevenue) || 0,
  }));

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Bookings Trend
        </h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <LineChart data={formattedData} margin={{ left: 10, right: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={0} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalBookings"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                name="Bookings"
              />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Revenue"
              />
            </LineChart>
          ) : (
            <BarChart data={formattedData} margin={{ left: 10, right: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={0} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalBookings" fill="#2563eb" name="Bookings" />
              <Bar dataKey="totalRevenue" fill="#22c55e" name="Revenue" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
