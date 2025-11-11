import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { fetchNotifications, markAsReadThunk } from '@/redux/slices/notificationSlice';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import {
  Bell,
  Check,
  Clock,
  Calendar,
  User,
  Wallet,
  Package,
  Flag,
  Star,
  MoreVertical,
  Briefcase,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { INotification } from '@/types/INotifications';

const NotificationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, totalPages, unreadCount } = useSelector(
    (state: RootState) => state.notifications
  );
  const userId = useSelector((s: RootState) => s.userAuth.user?._id);

  useNotificationSocket(userId || '');

  const [filter, setFilter] = useState<'all' | 'read' | 'unRead'>('all');
  const [showMenu, setShowMenu] = useState<string | null>(null);

  // Get link based on entity type
  const getNotificationLink = (n: INotification) => {
    switch (n.entityType) {
      case 'booking':
        return `/account/my-bookings/${n.bookingId?._id || n.bookingId}`;
      case 'package':
        return `/packages/${n.packageId}`;
      case 'wallet':
        return `/account/wallet`;
      case 'follow':
        return `/profile/${n.triggeredBy?.username}`;
           case 'customPackage':
        return `/account/my-custom-package/user`;
      default:
        return `/user/notifications`;
    }
  };

  // Get icon based on entity type
  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'booking':
        return <Calendar className="w-5 h-5" />;
      case 'package':
        return <Package className="w-5 h-5" />;
      case 'review':
        return <Star className="w-5 h-5" />;
      case 'wallet':
        return <Wallet className="w-5 h-5" />;
      case 'report':
        return <Flag className="w-5 h-5" />;
      case 'follow':
        return <User className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  // Get color scheme based on notification type
  const getTypeStyles = (type: string, isRead: boolean) => {
    if (isRead) {
      return {
        container: 'border-slate-200 bg-white hover:border-slate-300',
        icon: 'bg-slate-100 text-slate-600',
        badge: 'bg-slate-400',
      };
    }

    switch (type) {
      case 'success':
        return {
          container: 'border-green-200 bg-green-50/50 hover:border-green-300',
          icon: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
          badge: 'bg-green-500',
        };
      case 'error':
        return {
          container: 'border-red-200 bg-red-50/50 hover:border-red-300',
          icon: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
          badge: 'bg-red-500',
        };
      case 'warning':
        return {
          container: 'border-amber-200 bg-amber-50/50 hover:border-amber-300',
          icon: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white',
          badge: 'bg-amber-500',
        };
      case 'info':
      default:
        return {
          container: 'border-blue-200 bg-blue-50/50 hover:border-blue-300',
          icon: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
          badge: 'bg-blue-500',
        };
    }
  };

  // Get type indicator icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5" />;
    }
  };

  // Get time ago format
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now.getTime() - notifDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notifDate.toLocaleDateString();
  };

  // Fetch notifications
  useEffect(() => {
    dispatch(
      fetchNotifications({
        isAdmin: false,
        filters: {
          page: 1,
          limit: 5,
          status: filter === 'all' ? undefined : filter,
        },
      })
    );
  }, [dispatch, filter]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsReadThunk({ id, isAdmin: true }));
    setShowMenu(null);
  };

  const handleNotificationClick = (n: INotification) => {
    if (!n.isRead) {
      handleMarkAsRead(n._id);
    }
    navigate(getNotificationLink(n));
  };

  const markAllAsRead = () => {
    items.filter((n) => !n.isRead).forEach((n) => handleMarkAsRead(n._id));
  };

  // Group notifications by date
  const groupedNotifications = items.reduce(
    (acc, notif) => {
      const date = new Date(notif.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let key = 'Older';
      if (date.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else if (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        key = 'This Week';
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(notif);
      return acc;
    },
    {} as Record<string, INotification[]>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
                <p className="text-sm text-slate-500">Stay updated with your latest activities</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg shadow-red-500/30">
                  {unreadCount} New
                </div>
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Mark all read
                </button>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'unRead', 'read'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'read' ? 'Read' : 'Unread'}
                {f === 'unRead' && unreadCount > 0 && (
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Loading notifications...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No notifications yet</h3>
            <p className="text-slate-500">When you get notifications, they'll show up here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([dateGroup, notifications]) => (
              <div key={dateGroup}>
                <div className="flex items-center gap-3 mb-3 px-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    {dateGroup}
                  </h2>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                <div className="space-y-2">
                  {notifications.map((n) => {
                    const styles = getTypeStyles(n.type, n.isRead);
                    return (
                      <div
                        key={n._id}
                        className={`group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${styles.container}`}
                      >
                        <div className="flex items-start gap-4 p-4">
                          {/* Icon */}
                          <div
                            className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${styles.icon}`}
                          >
                            {getEntityIcon(n.entityType)}
                          </div>

                          {/* Content */}
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => handleNotificationClick(n)}
                          >
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <h3
                                className={`font-semibold text-base leading-tight ${n.isRead ? 'text-slate-700' : 'text-slate-900'}`}
                              >
                                {n.title}
                              </h3>
                              {!n.isRead && (
                                <div
                                  className={`w-2.5 h-2.5 ${styles.badge} rounded-full flex-shrink-0 mt-1.5 shadow-lg shadow-${n.type}-500/50`}
                                ></div>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-2 line-clamp-2">
                              {n.message}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{getTimeAgo(n.createdAt)}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <div className="flex items-center gap-1">
                                {getTypeIcon(n.type)}
                                <span className="capitalize">{n.type}</span>
                              </div>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span className="capitalize">{n.entityType}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex-shrink-0 relative">
                            <button
                              onClick={() => setShowMenu(showMenu === n._id ? null : n._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {showMenu === n._id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setShowMenu(null)}
                                ></div>
                                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-[160px] z-20">
                                  {!n.isRead && (
                                    <button
                                      onClick={() => handleMarkAsRead(n._id)}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                                    >
                                      <Check className="w-4 h-4" />
                                      Mark as read
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      navigate(getNotificationLink(n));
                                      setShowMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                                  >
                                    <Briefcase className="w-4 h-4" />
                                    View details
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() =>
                  dispatch(
                    fetchNotifications({
                      isAdmin: false,
                      filters: { page, limit: 5, status: filter },
                    })
                  )
                }
                className="w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
