import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageDropdownNav from "../../common/PageDropdownNav";
import {
  BuildingOffice2Icon,
  HomeModernIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import dashboardService from "../../../services/dashboardService";

const ManagerDashboard = () => {
  // Dummy State initialized with provided JSON structure
  const [dashboardData, setDashboardData] = useState({
    summary: {
      properties: 8,
      buildings: 18,
      totalUnits: 520,
      occupiedUnits: 450,
      vacantUnits: 70,
      tenants: 450,
      pendingMaintenance: 24,
      pendingPayments: 32,
    },
    recentActivities: [
      { id: 1, text: "New tenant added to Unit 302", time: "10 mins ago", type: "tenant" },
      { id: 2, text: "Maintenance ticket #108 created", time: "30 mins ago", type: "maintenance" },
      { id: 3, text: "Rent payment received ($1,200)", time: "2 hours ago", type: "payment" },
      { id: 4, text: "Clubhouse booked by John Doe", time: "4 hours ago", type: "booking" },
      { id: 5, text: "Unit 104 assigned to new lease", time: "1 day ago", type: "unit" },
    ],
    alerts: [
      { id: 1, title: "32 Overdue Payments", detail: "Total pending $45,000", level: "critical" },
      { id: 2, title: "5 Urgent Maintenance Tickets", detail: "Plumbing issue in Bldg B", level: "critical" },
      { id: 3, title: "12 Expiring Leases", detail: "Expiring within next 30 days", level: "warning" },
      { id: 4, title: "8 Pending Amenity Bookings", detail: "Requires approval", level: "info" },
    ],
  });

  // Chart Data Configurations
  const occupancyChartData = [
    { name: "Occupied", value: 450, color: "#10B981" },
    { name: "Vacant", value: 70, color: "#EF4444" },
  ];

  const rentCollectionData = [
    { month: "Jan", collected: 42000, pending: 8000 },
    { month: "Feb", collected: 45000, pending: 5000 },
    { month: "Mar", collected: 48000, pending: 6000 },
    { month: "Apr", collected: 51000, pending: 4000 },
    { month: "May", collected: 49000, pending: 7000 },
    { month: "Jun", collected: 53000, pending: 3500 },
  ];

  const maintenanceChartData = [
    { name: "Pending", count: 24, fill: "#F59E0B" },
    { name: "In Progress", count: 15, fill: "#3B82F6" },
    { name: "Completed", count: 85, fill: "#10B981" },
  ];

  const bookingStatsData = [
    { day: "Mon", bookings: 4 },
    { day: "Tue", bookings: 7 },
    { day: "Wed", bookings: 5 },
    { day: "Thu", bookings: 9 },
    { day: "Fri", bookings: 14 },
    { day: "Sat", bookings: 22 },
    { day: "Sun", bookings: 18 },
  ];

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getManagerDashboard();
        if (data.summary) {
          setDashboardData((current) => ({ ...current, summary: data.summary }));
        }
      } catch (error) {
        console.error("Failed to load manager dashboard:", error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="manager" currentFileName="Dashboard.jsx" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Manager Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time performance metrics and quick property controls.</p>
        </div>
        
        {/* Quick Actions Bar */}
        <div className="flex flex-wrap gap-2">
          <Link to="/manager/properties" className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Property
          </Link>
          <Link to="/manager/buildings" className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-gray-700 bg-white border hover:bg-gray-50 shadow-sm">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Building
          </Link>
          <Link to="/manager/units" className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-gray-700 bg-white border hover:bg-gray-50 shadow-sm">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Unit
          </Link>
          <Link to="/manager/tenants" className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-gray-700 bg-white border hover:bg-gray-50 shadow-sm">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Tenant
          </Link>
          <Link to="/manager/maintenance" className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-gray-700 bg-white border hover:bg-gray-50 shadow-sm">
            <WrenchScrewdriverIcon className="w-4 h-4 mr-1" /> Create Ticket
          </Link>
        </div>
      </div>

      {/* 8 KPI Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="My Properties" value={dashboardData.summary.properties} icon={BuildingOffice2Icon} color="bg-blue-500" />
        <SummaryCard title="Total Buildings" value={dashboardData.summary.buildings} icon={BuildingOffice2Icon} color="bg-indigo-500" />
        <SummaryCard title="Total Units" value={dashboardData.summary.totalUnits} icon={HomeModernIcon} color="bg-purple-500" />
        <SummaryCard title="Occupied Units" value={dashboardData.summary.occupiedUnits} icon={HomeModernIcon} color="bg-emerald-500" subText={`${dashboardData.summary.totalUnits ? Math.round((dashboardData.summary.occupiedUnits / dashboardData.summary.totalUnits) * 100) : 0}% Occupancy`} />
        <SummaryCard title="Vacant Units" value={dashboardData.summary.vacantUnits} icon={HomeModernIcon} color="bg-rose-500" />
        <SummaryCard title="Total Tenants" value={dashboardData.summary.tenants} icon={UserGroupIcon} color="bg-cyan-500" />
        <SummaryCard title="Pending Maintenance" value={dashboardData.summary.pendingMaintenance} icon={WrenchScrewdriverIcon} color="bg-amber-500" />
        <SummaryCard title="Pending Payments" value={dashboardData.summary.pendingPayments} icon={CreditCardIcon} color="bg-red-500" />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardData.alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border flex items-start space-x-3 ${
              alert.level === "critical"
                ? "bg-red-50 border-red-200 text-red-800"
                : alert.level === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">{alert.title}</p>
              <p className="text-xs mt-0.5 opacity-90">{alert.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Occupancy Rate */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Occupancy Rate Breakdown</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={occupancyChartData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {occupancyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Rent Collection */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Monthly Rent Collection ($)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rentCollectionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="#10B981" name="Collected" stackId="a" />
                <Bar dataKey="pending" fill="#EF4444" name="Pending" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Maintenance Ticket Status */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Maintenance Ticket Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={maintenanceChartData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Booking Statistics */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Weekly Amenity Bookings</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingStatsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#6366F1" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Recent Platform Activities</h2>
          <span className="text-xs text-gray-400">Live updates</span>
        </div>
        <div className="divide-y divide-gray-100">
          {dashboardData.recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <p className="text-sm font-medium text-gray-700">{act.text}</p>
              </div>
              <span className="text-xs text-gray-400">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-component: KPI Cards
const SummaryCard = ({ title, value, icon: Icon, color, subText }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subText && <p className="text-xs font-semibold text-emerald-600 mt-1">{subText}</p>}
    </div>
    <div className={`p-3 rounded-lg text-white ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default ManagerDashboard;