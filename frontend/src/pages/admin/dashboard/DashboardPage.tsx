import React, { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboardPage = () => {
  const [filter, setFilter] = useState({
    category: "All",
    status: "All",
    dateRange: "30",
  });

  // Dummy data
  const metrics = {
    totalUsers: 250,
    newUsers: 25,
    totalBookings: 120,
    revenue: 450000,
  };

  const bookingStats = {
    confirmed: 90,
    pending: 20,
    cancelled: 10,
  };

  const revenueTrends = [30000, 40000, 50000, 60000, 70000, 80000];

  const topCategories = [
    { category: "Kerala Tour", bookings: 35 },
    { category: "Goa Beach Trip", bookings: 25 },
    { category: "Himalayan Trek", bookings: 15 },
  ];

  const topUsers = [
    { username: "Alice", bookings: 5 },
    { username: "Bob", bookings: 4 },
    { username: "Charlie", bookings: 3 },
  ];

  // Chart data
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: revenueTrends,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: ["Confirmed", "Pending", "Cancelled"],
    datasets: [
      {
        data: [bookingStats.confirmed, bookingStats.pending, bookingStats.cancelled],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="px-4 py-2 rounded border"
        >
          <option value="All">All Categories</option>
          <option value="Kerala Tour">Kerala Tour</option>
          <option value="Goa Beach Trip">Goa Beach Trip</option>
          <option value="Himalayan Trek">Himalayan Trek</option>
        </select>

        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="px-4 py-2 rounded border"
        >
          <option value="All">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={filter.dateRange}
          onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
          className="px-4 py-2 rounded border"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{metrics.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">New Users</h3>
          <p className="text-2xl font-bold">{metrics.newUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Bookings</h3>
          <p className="text-2xl font-bold">{metrics.totalBookings}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold">₹{metrics.revenue}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
          <Line data={lineChartData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Booking Status</h3>
          <Pie data={pieChartData} />
        </div>
      </div>

      {/* Top Categories Table */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Bookings</th>
            </tr>
          </thead>
          <tbody>
            {topCategories.map((cat, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{cat.category}</td>
                <td className="border px-4 py-2">{cat.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Users Table */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Top Users</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">User</th>
              <th className="border px-4 py-2 text-left">Bookings</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
