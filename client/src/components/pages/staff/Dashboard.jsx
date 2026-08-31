import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import staffService from "../../../services/staffService";
import {
  ClipboardList,
  Clock,
  Loader2,
  CheckCircle2,
  MapPin,
  Building,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Zap,
  Check
} from "lucide-react";

// Initial Mock Data matching provided JSON payload
const INITIAL_DATA = {
  header: {
    title: "Staff Dashboard",
    welcomeMessage: "Welcome, Ravi 👋"
  },
  summaryCards: [
    { title: "Today's Tasks", value: 4, icon: "clipboard", color: "blue" },
    { title: "Pending Tasks", value: 2, icon: "clock", color: "amber" },
    { title: "In Progress", value: 1, icon: "loader", color: "indigo" },
    { title: "Completed", value: 25, icon: "check-circle", color: "emerald" }
  ],
  todaySchedule: [
    {
      id: 1,
      time: "09:00 AM",
      task: "AC Repair",
      location: "A-203",
      property: "Green Valley Residency",
      status: "pending"
    },
    {
      id: 2,
      time: "11:00 AM",
      task: "Plumbing",
      location: "B-102",
      property: "Green Valley Residency",
      status: "inProgress"
    },
    {
      id: 3,
      time: "02:00 PM",
      task: "Inspection",
      location: "C-305",
      property: "Sunrise Heights",
      status: "pending"
    }
  ],
  recentTasks: [
    {
      taskId: "TASK001",
      title: "Water Leakage Repair",
      priority: "high",
      status: "completed"
    },
    {
      taskId: "TASK002",
      title: "Fan Repair",
      priority: "medium",
      status: "inProgress"
    }
  ],
  alerts: [
    "Urgent maintenance task assigned",
    "Task deadline approaching",
    "New task assigned by manager"
  ],
  quickActions: [
    "View My Tasks",
    "Today's Schedule",
    "Active Maintenance",
    "View Performance"
  ]
};

export default function StaffDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    ...INITIAL_DATA,
    header: {
      ...INITIAL_DATA.header,
      welcomeMessage: `Welcome, ${user?.name || "Staff"} 👋`,
    },
  });

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await staffService.getDashboard();
        if (data?.success) {
          setDashboardData((current) => ({
            ...current,
            header: data.header || current.header,
            summaryCards: data.summaryCards || current.summaryCards,
            todaySchedule: data.todaySchedule?.length ? data.todaySchedule : current.todaySchedule,
            recentTasks: data.recentTasks?.length ? data.recentTasks : current.recentTasks,
            alerts: data.alerts?.length ? data.alerts : current.alerts,
            quickActions: data.quickActions || current.quickActions,
          }));
        }
      } catch (err) {
        console.error("Failed to load staff dashboard:", err);
      }
    };
    load();
  }, []);

  // Helper function to dynamically map string icons
  const renderSummaryIcon = (iconName) => {
    switch (iconName) {
      case "clipboard":
        return <ClipboardList className="w-5 h-5 text-blue-600" />;
      case "clock":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "loader":
        return <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />;
      case "check-circle":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <ClipboardList className="w-5 h-5 text-slate-600" />;
    }
  };

  // Status Badge Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "inProgress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Priority Badge Styling
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {dashboardData.header.title}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            {dashboardData.header.welcomeMessage}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 w-fit">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardData.summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {card.value}
              </h3>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              {renderSummaryIcon(card.icon)}
            </div>
          </div>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Today's Schedule & Recent Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule Component */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Today's Schedule
              </h2>
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                {dashboardData.todaySchedule.length} Assigned
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {dashboardData.todaySchedule.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200 shrink-0">
                      {item.time}
                    </span>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {item.task}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {item.property}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize w-fit ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks Table/List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-600" /> Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {dashboardData.recentTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        {task.taskId}
                      </span>
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {task.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded border capitalize ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${getStatusBadge(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Alerts Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Urgent Alerts
            </h2>
            <div className="space-y-2">
              {dashboardData.alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg text-xs font-semibold text-amber-900 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Component */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-blue-600" /> Quick Actions
            </h2>
            <div className="space-y-2">
              {(dashboardData.quickActions || []).map((action, idx) => {
                const label = typeof action === "string" ? action : action.label;
                const to = typeof action === "string" ? "/staff/tasks" : action.to;
                return (
                  <Link
                    key={idx}
                    to={to}
                    className="w-full text-left px-3 py-2.5 rounded-lg border border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between transition group"
                  >
                    <span>{label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}