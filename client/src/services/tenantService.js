import api from './api';

export const getTenants = async (params = {}) => {
  const res = await api.get('/tenants', { params });
  return res.data;
};

export const getTenantById = async (id) => {
  const res = await api.get(`/tenants/${id}`);
  return res.data;
};

export const createTenant = async (payload) => {
  const res = await api.post('/tenants', payload);
  return res.data;
};

export const updateTenant = async (id, payload) => {
  const res = await api.put(`/tenants/${id}`, payload);
  return res.data;
};

export const assignUnitToTenant = async (id, payload) => {
  const res = await api.put(`/tenants/${id}/assign-unit`, payload);
  return res.data;
};

export const deactivateTenant = async (id) => {
  const res = await api.put(`/tenants/${id}/deactivate`);
  return res.data;
};

export default {
  getTenants,
  getTenantById,
  createTenant,
  updateTenant,
  assignUnitToTenant,
  deactivateTenant,
};
