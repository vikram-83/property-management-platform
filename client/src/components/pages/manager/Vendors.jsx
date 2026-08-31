import React, { useEffect, useState } from 'react';
import vendorService from '../../../services/vendorService';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorService.getVendors();
      setVendors(response.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      setError('Unable to load vendors right now.');
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendors</h1>
          <p className="text-slate-600">Manage approved service vendors for the property portfolio.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded border border-slate-200 bg-white p-6 text-slate-500">Loading vendors...</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Company</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Category</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                    No vendors found.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {vendor.user?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {vendor.companyName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {vendor.serviceCategory || 'General'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${vendor.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                        {vendor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Vendors;
