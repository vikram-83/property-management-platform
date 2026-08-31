import api from './api';

// Support Ticket APIs
export const getSupportTickets = async () => {
  const res = await api.get('/support');
  return res.data;
};

export const createSupportTicket = async (payload) => {
  const res = await api.post('/support', payload);
  return res.data;
};

export const addTicketMessage = async (ticketId, payload) => {
  const res = await api.post(`/support/${ticketId}/message`, payload);
  return res.data;
};

export default {
  getSupportTickets,
  createSupportTicket,
  addTicketMessage,
};
