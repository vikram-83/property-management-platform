import API from './api';

const getAmenities = async (params = {}) => {
  const response = await API.get('/amenities', { params });
  return response.data;
};

const getAmenityById = async (id) => {
  const response = await API.get(`/amenities/${id}`);
  return response.data;
};

const createAmenity = async (payload) => {
  const response = await API.post('/amenities', payload);
  return response.data;
};

const updateAmenity = async (id, payload) => {
  const response = await API.put(`/amenities/${id}`, payload);
  return response.data;
};

const deleteAmenity = async (id) => {
  const response = await API.delete(`/amenities/${id}`);
  return response.data;
};

export default {
  getAmenities,
  getAmenityById,
  createAmenity,
  updateAmenity,
  deleteAmenity,
};
