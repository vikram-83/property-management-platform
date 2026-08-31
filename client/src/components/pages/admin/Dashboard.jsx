import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageDropdownNav from '../../common/PageDropdownNav';
import { 
  Users, 
  Building2, 
  UserCheck, 
  IndianRupee, 
  Wrench, 
  CreditCard, 
  UserPlus, 
  Building, 
  FileText, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';


// Assuming you have Lucide icons or similar SVG icon set installed.
// If using custom icons, replace the components accordingly.

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Simulating API call to fetching admin dashboard summary
    // Replace with: import reportService / api call
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Mocking the provided JSON structure
        const responseData = {
          summaryCards: [
            {
              title: "Total Users",
              value: 1250,
              icon: "users",
              action: "View Users",
              route: "/admin/users"
            },
            {
              title: "Total Properties",
              value: 185,
              icon: "building",
              action: "View Properties",
              route: "/admin/properties"
            },
            {
              title: "Total Tenants",
              value: 920,
              icon: "tenant",
              action: "View Tenants",
              route: "/admin/users?role=tenant"
            },
            {
              title: "Total Revenue",
              value: "₹24,50,000",
              icon: "money",
              action: "View Payments",
              route: "/admin/payments"
            },
            {
              title: "Pending Maintenance",
              value: 42,
              icon: "maintenance",
              action: "View Tickets",
              route: "/admin/reports?type=maintenance"
            },
            {
              title: "Pending Payments",
              value: "₹3,25,000",
              icon: "payment",
              action: "View Payments",
              route: "/admin/payments?status=pending"
            }
          ],
          recentActivities: [
            { id: 1, type: "user", text: "New user registered: Rahul Sharma (Tenant)", time: "10 mins ago" },
            { id: 2, type: "property", text: "New property added: Sun Villa Apartment #302", time: "25 mins ago" },
            { id: 3, type: "payment", text: "Payment received: ₹25,000 via UPI from Unit 104", time: "1 hour ago" },
            { id: 4, type: "maintenance", text: "Maintenance ticket created: AC Leakage in Block B", time: "2 hours ago" },
            { id: 5, type: "booking", text: "Booking created: Clubhouse reserved for 20th Aug", time: "3 hours ago" }
          ]
        };

        setDashboardData(responseData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderIcon = (iconName) => {
    const props = { className: "w-6 h-6 text-indigo-600" };
    switch (iconName) {
      case 'users': return <Users {...props} />;
      case 'building': return <Building2 {...props} />;
      case 'tenant': return <UserCheck {...props} />;
      case 'money': return <IndianRupee {...props} />;
      case 'maintenance': return <Wrench {...props} />;
      case 'payment': return <CreditCard {...props} />;
      default: return <Activity {...props} />;
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'Add User':
        navigate('/admin/users?action=new');
        break;
      case 'Add Property':
        navigate('/admin/properties?action=new');
        break;
      case 'View Payments':
        navigate('/admin/payments');
        break;
      case 'View Reports':
        navigate('/admin/reports');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="admin" currentFileName="Dashboard.jsx" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Real-Time Property Rental, Maintenance & Amenity Insights</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 text-indigo-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Status: Operational
        </div>
      </div>


      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboardData?.summaryCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{card.value}</h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                {renderIcon(card.icon)}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-end">
              <button
                onClick={() => navigate(card.route)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                {card.action}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => handleQuickAction('Add User')}
            className="flex items-center justify-center gap-2 p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg text-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
          <button
            onClick={() => handleQuickAction('Add Property')}
            className="flex items-center justify-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg text-sm transition-colors"
          >
            <Building className="w-4 h-4" />
            Add Property
          </button>
          <button
            onClick={() => handleQuickAction('View Payments')}
            className="flex items-center justify-center gap-2 p-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-lg text-sm transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            View Payments
          </button>
          <button
            onClick={() => handleQuickAction('View Reports')}
            className="flex items-center justify-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-lg text-sm transition-colors"
          >
            <FileText className="w-4 h-4" />
            View Reports
          </button>
        </div>
      </div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Widgets Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Platform Analytics Overview</h2>
            <div className="flex gap-2 text-xs">
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-medium rounded-md">Monthly Revenue</span>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">User Growth</span>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">Occupancy</span>
            </div>
          </div>
          <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
            <TrendingUp className="w-10 h-10 mb-2 stroke-1" />
            <p className="text-sm font-medium text-gray-500">Revenue & Occupancy Statistics Visualizer</p>
            <span className="text-xs text-gray-400 mt-1">Connect Chart.js or Recharts to visualize monthly trends</span>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Activities</h2>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[260px]">
            {dashboardData?.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 text-sm">
                <div className="p-1.5 bg-gray-100 rounded-full mt-0.5 text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium leading-snug">{activity.text}</p>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;