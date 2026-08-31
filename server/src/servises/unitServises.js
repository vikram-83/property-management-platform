import api from './api';

export const getUnits = async (params = {}) => {
  const response = await api.get('/units', { params });
  return response.data;
};

export const getUnitById = async (id) => {
  const response = await api.get(`/units/${id}`);
  return response.data;
};

export const createUnit = async (data) => {
  const response = await api.post('/units', data);
  return response.data;
};

export const updateUnit = async (id, data) => {
  const response = await api.put(`/units/${id}`, data);
  return response.data;
};

export const assignTenant = async (id, payload) => {
  const response = await api.put(`/units/${id}/assign-tenant`, payload);
  return response.data;
};

export const markVacant = async (id) => {
  const response = await api.put(`/units/${id}/mark-vacant`);
  return response.data;
};