import API from './api';

const getPayments = async (params = {}) => {
  const response = await API.get('/payments', { params });
  return response.data;
};

const getPaymentById = async (id) => {
  const response = await API.get(`/payments/${id}`);
  return response.data;
};

const createPayment = async (payload) => {
  const response = await API.post('/payments', payload);
  return response.data;
};

const updatePayment = async (id, payload) => {
  const response = await API.put(`/payments/${id}`, payload);
  return response.data;
};

const deletePayment = async (id) => {
  const response = await API.delete(`/payments/${id}`);
  return response.data;
};

export default {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
