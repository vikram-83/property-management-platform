import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCheck, Wrench, CreditCard, Calendar, Info } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'MAINTENANCE':
      return <Wrench className="w-4 h-4 text-amber-500" />;
    case 'PAYMENT':
      return <CreditCard className="w-4 h-4 text-emerald-500" />;
    case 'BOOKING':
      return <Calendar className="w-4 h-4 text-blue-500" />;
    default:
      return <Info className="w-4 h-4 text-indigo-500" />;
  }
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => {
        const target = prev.find((n) => n._id === id);
        if (target && !target.isRead) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return prev.filter((n) => n._id !== id);
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 focus:outline-none transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">No notifications available</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={`p-4 flex gap-3 hover:bg-gray-50 transition-colors ${
                    !item.isRead ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm h-fit">
                    {getNotificationIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.message}</p>
                    <div className="mt-2 flex items-center gap-3">
                      {!item.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(item._id)}
                          className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                        >
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;