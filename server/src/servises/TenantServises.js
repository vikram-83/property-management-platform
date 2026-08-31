import api from './api';

export const getTenants = async (params = {}) => {
  const response = await api.get('/tenants', { params });
  return response.data;
};

export const getTenantById = async (id) => {
  const response = await api.get(`/tenants/${id}`);
  return response.data;
};

export const createTenant = async (data) => {
  const response = await api.post('/tenants', data);
  return response.data;
};

export const updateTenant = async (id, data) => {
  const response = await api.put(`/tenants/${id}`, data);
  return response.data;
};

export const assignUnitToTenant = async (id, payload) => {
  const response = await api.put(`/tenants/${id}/assign-unit`, payload);
  return response.data;
};

export const deactivateTenant = async (id) => {
  const response = await api.put(`/tenants/${id}/deactivate`);
  return response.data;
};