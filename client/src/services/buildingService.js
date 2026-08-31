import API from './api';

const getBuildings = async (params = {}) => {
  const response = await API.get('/buildings', { params });
  return response.data;
};

const getBuildingById = async (id) => {
  const response = await API.get(`/buildings/${id}`);
  return response.data;
};

const createBuilding = async (payload) => {
  const response = await API.post('/buildings', payload);
  return response.data;
};

const updateBuilding = async (id, payload) => {
  const response = await API.put(`/buildings/${id}`, payload);
  return response.data;
};

const deleteBuilding = async (id) => {
  const response = await API.delete(`/buildings/${id}`);
  return response.data;
};

export default {
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
};
