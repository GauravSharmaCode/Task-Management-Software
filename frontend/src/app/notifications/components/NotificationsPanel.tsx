"use client";
import { useEffect, useState } from "react";
import { getNotifications, api } from "@/core/api";

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data.results || res.data);
    } catch {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/`, { is_read: true });
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    } catch {
      setError("Failed to mark as read");
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-900 rounded shadow-lg p-4 mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <span className="bg-red-600 text-white rounded-full px-2 py-0.5 text-xs">{unreadCount} unread</span>
        )}
        <button className="text-blue-600 underline ml-2" onClick={fetchNotifications}>Refresh</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-500">No notifications.</div>
      ) : (
        <ul className="divide-y divide-gray-400 dark:divide-gray-700">
          {notifications.map((n) => (
            <li key={n.id} className={`flex items-center justify-between py-2 ${n.is_read ? "opacity-60" : ""}`}>
              <span>{n.message}</span>
              {!n.is_read && (
                <button className="ml-4 text-xs bg-blue-600 text-white rounded px-2 py-1" onClick={() => markAsRead(n.id)}>
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
