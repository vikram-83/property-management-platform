import api from "./api";

const getManagerDashboard = async () => {
  const response = await api.get("/dashboard/manager");
  return response.data;
};

export default {
  getManagerDashboard,
};