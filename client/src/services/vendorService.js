import API from './api';

const getVendors = async (params = {}) => {
  const response = await API.get('/vendors', { params });
  return response.data;
};

const getVendorById = async (id) => {
  const response = await API.get(`/vendors/${id}`);
  return response.data;
};

const createVendor = async (payload) => {
  const response = await API.post('/vendors', payload);
  return response.data;
};

const updateVendor = async (id, payload) => {
  const response = await API.put(`/vendors/${id}`, payload);
  return response.data;
};

const deleteVendor = async (id) => {
  const response = await API.delete(`/vendors/${id}`);
  return response.data;
};

export default {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
};
