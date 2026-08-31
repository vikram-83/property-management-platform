// src/components/Notifications.jsx
import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import { io } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL);

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (userId) {
      socket.emit('join_room', userId);

      socket.on('new_notification', (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => {
      socket.off('new_notification');
    };
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true, readAt: data.data.readAt } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TenantNavigation />
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🔔 Notifications ({unreadCount})</h2>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead}>Mark All as Read</button>
        )}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {notifications.map((n) => (
          <li
            key={n._id}
            style={{
              padding: '12px',
              marginBottom: '10px',
              borderRadius: '6px',
              borderLeft: n.type === 'MAINTENANCE' ? '5px solid #ff9800' : '5px solid #2196f3',
              backgroundColor: n.isRead ? '#f4f4f4' : '#e3f2fd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <small style={{ fontWeight: 'bold' }}>[{n.type}] • {new Date(n.createdAt).toLocaleString()}</small>
              <h4 style={{ margin: '5px 0' }}>{n.title}</h4>
              <p style={{ margin: 0 }}>{n.message}</p>
            </div>
            {!n.isRead && (
              <button onClick={() => handleMarkAsRead(n._id)} style={{ marginLeft: '10px' }}>
                Mark Read
              </button>
            )}
          </li>
        ))}
      </ul>
      </div>
      
    </>
  );
};

export default Notifications;