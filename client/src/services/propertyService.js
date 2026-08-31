import api from "./api";

const getAll = async (params = {}) => {
  const res = await api.get("/properties", { params });
  return res.data;
};

const getById = async (id) => {
  const res = await api.get(`/properties/${id}`);
  return res.data;
};

const create = async (data) => {
  const res = await api.post("/properties", data);
  return res.data;
};

const update = async (id, data) => {
  const res = await api.put(`/properties/${id}`, data);
  return res.data;
};

const remove = async (id) => {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
};

export default { getAll, getById, create, update, remove };
