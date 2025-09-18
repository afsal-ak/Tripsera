import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  fetchAdminNotification,
  markNotificationAsRead,
} from "@/services/admin/notificationsService";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import type { INotification } from "@/types/INotifications";
import { Bell, CheckCircle, Circle } from "lucide-react";
import { usePaginationButtons } from "@/hooks/usePaginationButtons";
import { useSearchParams } from "react-router-dom";

const NotificationPage = () => {
  const userId = useSelector((state: RootState) => state.adminAuth.admin?._id);

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [filter, setFilter] = useState<"all" | "read" | "unRead">("all");
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = 6;
  const { socketNotifications } = useNotificationSocket(userId!);
const page=currentPage
  // Fetch notifications
  const loadNotifications = async () => {
    if (!userId) return;
    try {
      const response = await fetchAdminNotification({
        page,limit,
        status: filter === "all" ? undefined : filter,
      });
      setNotifications(response.data || []);
        setTotalPages(response?.pagination?.totalPages);

    } catch (err) {
      console.error(err);
    }
  };

   useEffect(() => {
    if (socketNotifications.length > 0) {
      setNotifications((prev) => [...socketNotifications, ...prev]);
    }
  }, [socketNotifications]);

  useEffect(() => {
    loadNotifications();
  }, [filter,searchParams]);

const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-500" />
          Notifications
        </h2>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {(["all", "read", "unRead"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${
                filter === f
                  ? "bg-blue-500 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {f === "all" ? "All" : f === "read" ? "Read" : "Unread"}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Bell className="mx-auto mb-2 w-10 h-10 opacity-50" />
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-start justify-between border rounded-xl p-4 shadow-sm transition hover:shadow-md ${
                n.isRead ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex gap-3">
                {n.isRead ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                ) : (
                  <Circle className="w-5 h-5 text-blue-500 mt-1" />
                )}
                <div>
                  <p className="font-semibold text-gray-800">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n._id)}
                  className="text-xs text-blue-600 hover:underline ml-3"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        {paginationButtons}
      </div>
    </div>
  );
};

export default NotificationPage;
