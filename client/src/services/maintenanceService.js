import API from './api';

const getTickets = async (params = {}) => {
  const response = await API.get('/maintenance', { params });
  return response.data;
};

const getTicketById = async (id) => {
  const response = await API.get(`/maintenance/${id}`);
  return response.data;
};

const createTicket = async (payload) => {
  const isFormData = payload instanceof FormData;
  const response = await API.post('/maintenance', payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return response.data;
};

const updateTicket = async (id, payload) => {
  const response = await API.put(`/maintenance/${id}`, payload);
  return response.data;
};

const addComment = async (id, payload) => {
  const response = await API.post(`/maintenance/${id}/comments`, payload);
  return response.data;
};

export default {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  addComment,
};
