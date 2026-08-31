import api from './api';

// Inspection APIs
export const getInspection = async () => {
  const res = await api.get('/tenant-features/inspection');
  return res.data;
};

export const updateInspectionRoom = async (payload) => {
  const res = await api.post('/tenant-features/inspection/room', payload);
  return res.data;
};

// Move-Out APIs
export const getMoveOutRequest = async () => {
  const res = await api.get('/tenant-features/move-out');
  return res.data;
};

export const createMoveOutRequest = async (payload) => {
  const res = await api.post('/tenant-features/move-out', payload);
  return res.data;
};

// Utilities APIs
export const getUtilities = async () => {
  const res = await api.get('/tenant-features/utilities');
  return res.data;
};

export default {
  getInspection,
  updateInspectionRoom,
  getMoveOutRequest,
  createMoveOutRequest,
  getUtilities,
};
