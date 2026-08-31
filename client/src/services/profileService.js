import api from './api';

// Profile APIs
export const getProfile = async () => {
  const res = await api.get('/profile');
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await api.put('/profile', payload);
  return res.data;
};

export const updateProfilePreferences = async (payload) => {
  const res = await api.put('/profile/preferences', payload);
  return res.data;
};

export const changePassword = async (payload) => {
  const res = await api.put('/profile/change-password', payload);
  return res.data;
};

export default {
  getProfile,
  updateProfile,
  updateProfilePreferences,
  changePassword,
};
