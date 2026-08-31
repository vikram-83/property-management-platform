import API from './api';

const leaseService = {
  /**
   * Get all leases with optional filters
   * @param {Object} params - { property, tenant, status, startDate, endDate, page, limit }
   */
  getLeases: async (params = {}) => {
    const response = await API.get('/leases', { params });
    return response.data;
  },

  /**
   * Get single lease details by ID
   * @param {string} leaseId 
   */
  getLeaseById: async (leaseId) => {
    const response = await API.get(`/leases/${leaseId}`);
    return response.data;
  },

  /**
   * Create a new lease agreement
   * @param {Object} leaseData 
   */
  createLease: async (leaseData) => {
    const response = await API.post('/leases', leaseData);
    return response.data;
  },

  /**
   * Update an existing lease details
   * @param {string} leaseId 
   * @param {Object} updateData 
   */
  updateLease: async (leaseId, updateData) => {
    const response = await API.put(`/leases/${leaseId}`, updateData);
    return response.data;
  },

  /**
   * Renew an existing lease with new end date and rent amount
   * @param {string} leaseId 
   * @param {Object} renewalData - { newEndDate, newRentAmount, renewalTermMonths }
   */
  renewLease: async (leaseId, renewalData) => {
    const response = await API.post(`/leases/${leaseId}/renew`, renewalData);
    return response.data;
  },

  /**
   * Terminate or cancel a lease agreement early
   * @param {string} leaseId 
   * @param {Object} terminationData - { terminationDate, reason }
   */
  terminateLease: async (leaseId, terminationData) => {
    const response = await API.put(`/leases/${leaseId}/terminate`, terminationData);
    return response.data;
  },

  /**
   * Download Lease Agreement Document / PDF
   * @param {string} leaseId 
   */
  downloadLeaseDocument: async (leaseId) => {
    const response = await API.get(`/leases/${leaseId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Get overall lease statistics (Expiring soon, active, terminated count)
   */
  getLeaseStatistics: async () => {
    const response = await API.get('/leases/statistics');
    return response.data;
  }
};

export default leaseService;