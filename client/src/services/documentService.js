import api from './api';

// Document APIs
export const getDocuments = async (params = {}) => {
  const res = await api.get('/documents', { params });
  return res.data;
};

export default {
  getDocuments,
};
