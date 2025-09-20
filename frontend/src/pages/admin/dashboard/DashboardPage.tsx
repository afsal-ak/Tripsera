
import { useEffect, useState, useCallback } from "react";
import {
  Package,
  Users,
  ClipboardList,
  FileText,
  Layers,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import {
  handleSummary,
  handleTopPackage,
  handleTopCategory,
  handleBookingChart,
} from "@/services/admin/dashboardService";

import BookingsChart from "./BookingsChart";
import DateFilterControls from "./DateFilterControls";
import StatCard from "./StatCard";
import DataTable from "./DataTable";
import { useDashboardParams } from "@/hooks/useDashboardParams";

import type {
  ITopPackage,
  ITopCategory,
   IDashboardSummary,
  IBookingsChartPoint,
} from "@/types/IDashboard";

export default function TravelAdminDashboard() {
  const { params, updateParams } = useDashboardParams();

  const [summary, setSummary] = useState<IDashboardSummary | null>(null);
  const [topPackages, setTopPackages] = useState<ITopPackage[]>([]);
  const [topCategories, setTopCategories] = useState<ITopCategory[]>([]);
  const [chartData, setChartData] = useState<IBookingsChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //  Fetch dashboard data 
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, packagesRes, categoriesRes, chartRes] = await Promise.all([
        handleSummary(params),
        handleTopPackage(params),
        handleTopCategory(params),
        handleBookingChart(params),
      ]);

      setSummary(summaryRes.data);
      setTopPackages(packagesRes.data);
      setTopCategories(categoriesRes.data);
      console.log(chartRes,'res')
      setChartData(chartRes.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch dashboard data");
      toast.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [params]);
console.log(summary,'sum')
  //  Fetch only when params change
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
console.log(chartData,'chart')
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* ---------- Header ---------- */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-3">
          <BarChart3 size={28} className="text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Travel Admin Dashboard
          </h1>
        </div>
        {error && (
          <span className="md:ml-auto text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
            {error}
          </span>
        )}
      </div>

      {/* ---------- Filters ---------- */}
      <div className="mb-6">
        <DateFilterControls value={params} onChange={updateParams} />
      </div>

      {/* ---------- Summary Cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={loading ? "…" : summary?.totalUsers ?? "—"}
        />
        <StatCard
          icon={Package}
          label="Total Packages"
          value={loading ? "…" : summary?.totalPackages ?? "—"}
        />
        <StatCard
          icon={ClipboardList}
          label="Total Bookings"
          value={loading ? "…" : summary?.totalBookings ?? "—"}
        />
        <StatCard
          icon={Layers}
          label="Custom Plans"
          value={loading ? "…" : summary?.totalCustomPlans ?? "—"}
        />
        <StatCard
          icon={FileText}
          label="Total Blogs"
          value={loading ? "…" : summary?.totalBlogs ?? "—"}
        />
      </div>

      {/* ---------- Main Grid ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- Booking Chart ---------- */}
        <div className="lg:col-span-2">
             <BookingsChart data={chartData || []} type="line" />
         </div>

        {/* ---------- Top Packages & Categories ---------- */}
        <div className="space-y-6">
             <DataTable<ITopPackage>
              title="Top Booked Packages"
              columns={[
                { key: "packageName", label: "Package" },
                { key: "totalBookings", label: "Bookings", width: "w-24" },
                { key: "totalRevenue", label: "Revenue", width: "w-24" },
              ]}
              rows={topPackages}
              emptyText="No packages in this range"
            />
 
             <DataTable<ITopCategory>
              title="Top Categories"
              columns={[
                { key: "name", label: "Category" },
                { key: "totalBookings", label: "Bookings", width: "w-24" },
              ]}
              rows={topCategories}
              emptyText="No categories in this range"
            />
         </div>
      </div>
    </div>
  );
}
