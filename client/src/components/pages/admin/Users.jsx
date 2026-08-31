import React, { useState, useMemo } from 'react';
import PageDropdownNav from '../../common/PageDropdownNav';
import {
  Users as UsersIcon, Search, Plus, Filter, MoreVertical, Edit2, 
  Trash2, Shield, KeyRound, Activity, UserCheck, UserX, Eye, X,
  CheckCircle2, AlertTriangle, Clock, Mail, Phone, Calendar
} from 'lucide-react';


const USERS_CONFIG = {
  roles: ["admin", "manager", "staff", "tenant", "vendor"],
  status: ["active", "inactive", "blocked", "pending"]
};

const INITIAL_USERS = [
  {
    id: "USR001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+919876543210",
    role: "manager",
    status: "active",
    createdAt: "2026-08-10",
    lastLogin: "2026-08-17"
  },
  {
    id: "USR002",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+919876543211",
    role: "admin",
    status: "active",
    createdAt: "2026-08-01",
    lastLogin: "2026-08-17"
  },
  {
    id: "USR003",
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+919876543212",
    role: "tenant",
    status: "pending",
    createdAt: "2026-08-15",
    lastLogin: "Never"
  },
  {
    id: "USR004",
    name: "Suresh Verma",
    email: "suresh@example.com",
    phone: "+919876543213",
    role: "vendor",
    status: "inactive",
    createdAt: "2026-07-20",
    lastLogin: "2026-08-02"
  },
  {
    id: "USR005",
    name: "Neha Gupta",
    email: "neha@example.com",
    phone: "+919876543214",
    role: "staff",
    status: "blocked",
    createdAt: "2026-06-12",
    lastLogin: "2026-07-11"
  }
];

export default function Users() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals & Active Selections
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    status: 'active'
  });

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = !roleFilter || u.role === roleFilter;
      const matchesStatus = !statusFilter || u.status === statusFilter;
      const matchesDate = !dateFilter || u.createdAt === dateFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesDate;
    });
  }, [users, searchTerm, roleFilter, statusFilter, dateFilter]);

  // Actions
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ name: '', email: '', phone: '', role: 'staff', status: 'active' });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setIsAddEditOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (isEditing) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...formData } : u))
      );
    } else {
      const newUser = {
        id: `USR00${users.length + 1}`,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };
      setUsers([newUser, ...users]);
    }
    setIsAddEditOpen(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const handleDeleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleResetPassword = (user) => {
    alert(`Password reset link sent to ${user.email}`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      inactive: "bg-slate-100 text-slate-700 border-slate-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      blocked: "bg-rose-50 text-rose-700 border-rose-200"
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${styles[status] || styles.inactive}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Universal Page Dropdown Navigator */}
        <PageDropdownNav role="admin" currentFileName="Users.jsx" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <UsersIcon className="w-6 h-6 text-indigo-600" />
              User Management
            </h1>
            <p className="text-sm text-slate-500">View, create, and manage access roles for all system users.</p>
          </div>


          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-indigo-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            {/* Filter: Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Filter by Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">All Roles</option>
                {USERS_CONFIG.roles.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Filter: Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">All Statuses</option>
                {USERS_CONFIG.status.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Filter: Registration Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Registration Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 capitalize font-medium text-slate-700">
                        {user.role}
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(user.status)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        {user.createdAt}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        {user.lastLogin}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setSelectedUser(user); setIsDetailsOpen(true); }}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleResetPassword(user)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Reset Password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(user.id, 'inactive')}
                              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                              title="Deactivate User"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              title="Activate User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">
                      No users found matching the given criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add / Edit User */}
        {isAddEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  {isEditing ? 'Edit User Profile' : 'Add New User'}
                </h3>
                <button onClick={() => setIsAddEditOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full border border-slate-200 bg-white rounded-lg text-sm px-2.5 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      {USERS_CONFIG.roles.map((r) => (
                        <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full border border-slate-200 bg-white rounded-lg text-sm px-2.5 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      {USERS_CONFIG.status.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddEditOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition"
                  >
                    {isEditing ? 'Save Changes' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: View User Details & Activity */}
        {isDetailsOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">User Details & Activity</h3>
                <button onClick={() => setIsDetailsOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{selectedUser.name}</h4>
                    <p className="text-xs text-slate-500">ID: {selectedUser.id}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {getStatusBadge(selectedUser.status)}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm border-t border-b border-slate-100 py-4">
                  <div>
                    <span className="text-xs text-slate-400 block uppercase">Email</span>
                    <span className="font-medium text-slate-800">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block uppercase">Phone</span>
                    <span className="font-medium text-slate-800">{selectedUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block uppercase">Registration Date</span>
                    <span className="font-medium text-slate-800">{selectedUser.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block uppercase">Last Login</span>
                    <span className="font-medium text-slate-800">{selectedUser.lastLogin}</span>
                  </div>
                </div>

                {/* Activity Feed Sample */}
                <div>
                  <h5 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    Recent Activity Log
                  </h5>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                      <span>Logged into dashboard session</span>
                      <span className="text-slate-400">{selectedUser.lastLogin}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                      <span>Updated user profile information</span>
                      <span className="text-slate-400">{selectedUser.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}