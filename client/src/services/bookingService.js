import API from './api';

const getBookings = async (params = {}) => {
  const response = await API.get('/bookings', { params });
  return response.data;
};

const getBookingById = async (id) => {
  const response = await API.get(`/bookings/${id}`);
  return response.data;
};

const createBooking = async (payload) => {
  const response = await API.post('/bookings', payload);
  return response.data;
};

const updateBookingStatus = async (id, status) => {
  const response = await API.put(`/bookings/${id}/status`, { status });
  return response.data;
};

export default {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
};
