import api from "./api";

// Get all units
export const getUnits = async (params = {}) => {
  const response = await api.get("/units", {
    params,
  });

  return response.data;
};

// Get single unit
export const getUnitById = async (unitId) => {
  const response = await api.get(`/units/${unitId}`);
  
  return response.data;
};

// Create new unit
export const createUnit = async (unitData) => {
  const response = await api.post("/units", unitData);

  return response.data;
};

// Update unit
export const updateUnit = async (unitId, unitData) => {
  const response = await api.put(`/units/${unitId}`, unitData);

  return response.data;
};

// Delete unit
export const deleteUnit = async (unitId) => {
  const response = await api.delete(`/units/${unitId}`);

  return response.data;
};

// Mark unit as vacant
export const markVacant = async (unitId) => {
  const response = await api.patch(`/units/${unitId}/vacant`);

  return response.data;
};

// Assign tenant to unit
export const assignTenant = async (unitId, tenantId) => {
  const response = await api.patch(`/units/${unitId}/assign-tenant`, {
    tenantId,
  });

  return response.data;
};

// Get units by building
export const getUnitsByBuilding = async (buildingId) => {
  const response = await api.get(`/units/building/${buildingId}`);

  return response.data;
};

// Get available/vacant units
export const getAvailableUnits = async () => {
  const response = await api.get("/units/status/vacant");

  return response.data;
};