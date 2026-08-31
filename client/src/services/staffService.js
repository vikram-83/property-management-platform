import API from "./api";

const staffService = {
  getDashboard: async () => {
    const { data } = await API.get("/staff/dashboard");
    return data;
  },
  getTasks: async (params = {}) => {
    const { data } = await API.get("/staff/tasks", { params });
    return data;
  },
  getTaskDetails: async (id) => {
    const { data } = await API.get(`/staff/tasks/${id}`);
    return data;
  },
  updateTaskStatus: async (id, status) => {
    const { data } = await API.put(`/staff/tasks/${id}/status`, { status });
    return data;
  },
  executeTaskAction: async (id, payload) => {
    const { data } = await API.put(`/staff/tasks/${id}/action`, payload);
    return data;
  },
  addNote: async (id, payload) => {
    const { data } = await API.post(`/staff/tasks/${id}/notes`, payload);
    return data;
  },
  getPerformance: async () => {
    const { data } = await API.get("/staff/performance");
    return data;
  },
  getSchedule: async (params = {}) => {
    const { data } = await API.get("/staff/schedule", { params });
    return data;
  },
};

export default staffService;
