import { useState, useEffect, useRef } from 'react';

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = (userId: number | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log('useNotifications effect triggered, userId:', userId, 'type:', typeof userId);
    if (!userId) {
      console.log('useNotifications: userId is null/undefined, skipping API call');
      return;
    }

    // Fetch existing notifications
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching notifications with token:', token ? 'present' : 'missing');
        const response = await fetch('http://localhost:8000/api/notifications/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        console.log('Notifications response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Notifications data:', data);
          setNotifications(data);
          setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
        } else {
          console.error('Failed to fetch notifications, status:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    console.log('useNotifications: calling fetchNotifications for userId:', userId);
    fetchNotifications();

    // WebSocket connection will be implemented later
    // For now, we'll poll for updates every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/notifications/${notificationId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.is_read);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};