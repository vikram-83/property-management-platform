import API from "./api";

export const notificationService = {
  getNotifications: async () => {
    const { data } = await API.get("/notifications");
    return data;
  },
  markAsRead: async (id) => {
    const { data } = await API.patch(`/notifications/${id}/read`);
    return data;
  },
  markAllAsRead: async () => {
    const { data } = await API.patch("/notifications/read-all");
    return data;
  },
  deleteNotification: async (id) => {
    const { data } = await API.delete(`/notifications/${id}`);
    return data;
  },
};

export default notificationService;
