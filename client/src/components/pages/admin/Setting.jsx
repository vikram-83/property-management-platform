import React, { useState } from 'react';
import PageDropdownNav from '../../common/PageDropdownNav';
import {
  User,
  Globe,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  Camera,
  Lock,
  Clock,
  Mail,
  Phone,
  DollarSign,
  ShieldAlert
} from 'lucide-react';


// Initial Schema Data
const INITIAL_SETTINGS = {
  profile: {
    name: "System Administrator",
    email: "admin@example.com",
    phone: "+91XXXXXXXXXX",
    profileImage: ""
  },
  platform: {
    platformName: "Property Management Platform",
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD-MM-YYYY"
  },
  notifications: {
    emailNotifications: true,
    paymentNotifications: true,
    maintenanceNotifications: true,
    bookingNotifications: true
  },
  security: {
    twoFactorAuthentication: false,
    sessionTimeout: 30,
    loginAlerts: true
  }
};

export default function Settings() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);

  // General Input Handler for nested states
  const handleChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 space-y-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Universal Page Dropdown Navigator */}
        <PageDropdownNav role="admin" currentFileName="Setting.jsx" />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
            <p className="text-sm text-slate-500">
              Manage system configuration, security rules, and user profile preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 shadow-sm transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Success Alert */}
        {isSaved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-medium animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            Settings saved successfully!
          </div>
        )}

        {/* Main Settings Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Sidebar Navigation */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>

            <button
              onClick={() => setActiveTab('platform')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
                activeTab === 'platform'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-4 h-4" />
              Platform
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
                activeTab === 'notifications'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
                activeTab === 'security'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              Security
            </button>
          </div>

          {/* Content Panel */}
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <form onSubmit={handleSave}>

              {/* SECTION: PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Profile Information
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Update your administrator account identity details.
                    </p>
                  </div>

                  {/* Profile Picture Placeholder */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-lg relative">
                      {settings.profile.name.charAt(0)}
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 p-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow"
                        title="Upload Profile Image"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{settings.profile.name}</h4>
                      <p className="text-xs text-slate-500">{settings.profile.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => handleChange('profile', 'name', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg text-sm px-3.5 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleChange('profile', 'email', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg text-sm px-3.5 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={settings.profile.phone}
                        onChange={(e) => handleChange('profile', 'phone', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg text-sm px-3.5 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: PLATFORM */}
              {activeTab === 'platform' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Platform Settings
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Configure regional defaults, currency, and portal branding.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={settings.platform.platformName}
                        onChange={(e) => handleChange('platform', 'platformName', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg text-sm px-3.5 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                          Currency
                        </label>
                        <select
                          value={settings.platform.currency}
                          onChange={(e) => handleChange('platform', 'currency', e.target.value)}
                          className="w-full border border-slate-200 bg-white rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                          Date Format
                        </label>
                        <select
                          value={settings.platform.dateFormat}
                          onChange={(e) => handleChange('platform', 'dateFormat', e.target.value)}
                          className="w-full border border-slate-200 bg-white rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        >
                          <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                          <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Timezone
                      </label>
                      <select
                        value={settings.platform.timezone}
                        onChange={(e) => handleChange('platform', 'timezone', e.target.value)}
                        className="w-full border border-slate-200 bg-white rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">Coordinated Universal Time (UTC)</option>
                        <option value="America/New_York">Eastern Time (EST)</option>
                        <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Notification Preferences
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose which system activities trigger automated notifications.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive system activity digests via email' },
                      { key: 'paymentNotifications', label: 'Payment Alerts', desc: 'Notify when payment transactions or rent collection events occur' },
                      { key: 'maintenanceNotifications', label: 'Maintenance Alerts', desc: 'Notify on new or updated maintenance requests' },
                      { key: 'bookingNotifications', label: 'Booking Alerts', desc: 'Notify on property or facility reservation requests' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-lg hover:bg-slate-50/50 transition">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{label}</p>
                          <p className="text-xs text-slate-500">{desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[key]}
                            onChange={(e) => handleChange('notifications', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Security & Authentication
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage authentication standards and session duration controls.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication (2FA)</p>
                        <p className="text-xs text-slate-500">Require an authentication code when signing into admin accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuthentication}
                          onChange={(e) => handleChange('security', 'twoFactorAuthentication', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Login Alerts</p>
                        <p className="text-xs text-slate-500">Alert administrators when logins occur from unrecognized devices</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.loginAlerts}
                          onChange={(e) => handleChange('security', 'loginAlerts', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Session Timeout (Minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="240"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleChange('security', 'sessionTimeout', Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-lg text-sm px-3.5 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      <p className="text-xs text-slate-400 mt-1">Automatically sign out users after period of inactivity.</p>
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}