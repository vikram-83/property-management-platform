import React, { useState, useEffect } from 'react';
import PageDropdownNav from '../../common/PageDropdownNav';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  UserPlus, 
  Edit, 
  Trash2, 
  ShieldAlert, 
  KeyRound, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Eye, 
  X, 
  MoreVertical 
} from 'lucide-react';


const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    role: 'admin',
    status: 'active',
    registrationDate: '2025-01-15',
    lastActive: '2 mins ago',
    activityLog: [
      { action: 'Password updated', date: '2026-08-10 10:30 AM' },
      { action: 'Created new maintenance ticket', date: '2026-08-12 02:15 PM' }
    ]
  },
  {
    id: 'USR-002',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+91 98123 45678',
    role: 'manager',
    status: 'active',
    registrationDate: '2025-03-20',
    lastActive: '1 hour ago',
    activityLog: [
      { action: 'Assigned vendor to Unit 202', date: '2026-08-16 11:00 AM' }
    ]
  },
  {
    id: 'USR-003',
    name: 'Amit Patel',
    email: 'amit.p@example.com',
    phone: '+91 97111 22233',
    role: 'tenant',
    status: 'pending',
    registrationDate: '2026-08-01',
    lastActive: '1 day ago',
    activityLog: [
      { action: 'Submitted lease application', date: '2026-08-01 04:00 PM' }
    ]
  },
  {
    id: 'USR-004',
    name: 'Suresh Verma',
    email: 'suresh.v@example.com',
    phone: '+91 99887 76655',
    role: 'vendor',
    status: 'inactive',
    registrationDate: '2025-06-10',
    lastActive: '5 days ago',
    activityLog: [
      { action: 'Completed plumbing job #402', date: '2026-08-05 03:20 PM' }
    ]
  },
  {
    id: 'USR-005',
    name: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 94555 66778',
    role: 'staff',
    status: 'blocked',
    registrationDate: '2025-11-05',
    lastActive: '2 weeks ago',
    activityLog: [
      { action: 'Account flagged by admin', date: '2026-08-02 09:10 AM' }
    ]
  }
];

const Users = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [filteredUsers, setFilteredUsers] = useState(INITIAL_USERS);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [registrationDateFilter, setRegistrationDateFilter] = useState('');

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'tenant',
    status: 'active'
  });

  // Filter execution
  useEffect(() => {
    let result = users;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          u.id.toLowerCase().includes(q)
      );
    }

    if (selectedRole !== 'all') {
      result = result.filter((u) => u.role === selectedRole);
    }

    if (selectedStatus !== 'all') {
      result = result.filter((u) => u.status === selectedStatus);
    }

    if (registrationDateFilter) {
      result = result.filter((u) => u.registrationDate === registrationDateFilter);
    }

    setFilteredUsers(result);
  }, [searchQuery, selectedRole, selectedStatus, registrationDateFilter, users]);

  // Actions handlers
  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setFormData({ name: '', email: '', phone: '', role: 'tenant', status: 'active' });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setIsAddEditModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (selectedUser) {
      // Edit User
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, ...formData } : u
        )
      );
    } else {
      // Add User
      const newUser = {
        id: `USR-00${users.length + 1}`,
        ...formData,
        registrationDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just now',
        activityLog: [{ action: 'User registered by Admin', date: new Date().toLocaleString() }]
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    setIsAddEditModalOpen(false);
  };

  const handleToggleStatus = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const handleResetPassword = (user) => {
    alert(`Password reset link sent to ${user.email}`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      blocked: 'bg-rose-100 text-rose-800 border-rose-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || styles.inactive}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="admin" currentFileName="Notification.jsx" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon className="w-7 h-7 text-indigo-600" /> User Management
          </h1>
          <p className="text-sm text-gray-500">View, search, filter, and manage platform user roles and statuses.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Add New User
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Role */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="tenant">Tenant</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Registration Date Filter */}
          <div>
            <input
              type="date"
              value={registrationDateFilter}
              onChange={(e) => setRegistrationDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">User Details</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Registered On</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email} • {user.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-transparent text-xs font-semibold text-indigo-700 uppercase focus:outline-none cursor-pointer"
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                        <option value="tenant">Tenant</option>
                        <option value="vendor">Vendor</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4 text-gray-600">{user.registrationDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedUser(user); setIsDetailsModalOpen(true); }}
                          title="View Details"
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(user); setIsActivityModalOpen(true); }}
                          title="View Activity Log"
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          title="Edit User"
                          className="p-1.5 hover:bg-gray-100 rounded text-indigo-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user)}
                          title="Reset Password"
                          className="p-1.5 hover:bg-gray-100 rounded text-amber-600"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleToggleStatus(user.id, 'inactive')}
                            title="Deactivate"
                            className="p-1.5 hover:bg-gray-100 rounded text-rose-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(user.id, 'active')}
                            title="Activate"
                            className="p-1.5 hover:bg-gray-100 rounded text-emerald-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                          className="p-1.5 hover:bg-rose-50 rounded text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                    No users matching the filters were found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-semibold text-lg text-gray-900">
                {selectedUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button onClick={() => setIsAddEditModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                  <option value="tenant">Tenant</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {isActivityModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-semibold text-lg text-gray-900">Activity Log: {selectedUser.name}</h3>
              <button onClick={() => setIsActivityModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedUser.activityLog?.map((act, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium text-gray-800">{act.action}</p>
                  <span className="text-xs text-gray-400">{act.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;