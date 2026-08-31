import api from './api';

export const getMaintenanceTickets = async (params = {}) => {
  const response = await api.get('/maintenance', { params });
  return response.data;
};

export const createMaintenanceTicket = async (ticketData) => {
  const response = await api.post('/maintenance', ticketData);
  return response.data;
};

export const updateMaintenanceTicket = async (id, updateData) => {
  const response = await api.put(`/maintenance/${id}`, updateData);
  return response.data;
};