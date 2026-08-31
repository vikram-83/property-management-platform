import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import staffService from '../../../services/staffService';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Play,
  Pause,
  AlertTriangle,
  FileText,
  Camera,
  X,
  MapPin,
  Calendar,
  User,
  ChevronRight,
} from 'lucide-react';

const MyTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Form Inputs Inside Drawer/Modal
  const [newNote, setNewNote] = useState('');
  const [isIssue, setIsIssue] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Fetch Assigned Tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await staffService.getTasks({
        search,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        sortBy,
      });
      if (data.success) {
        setTasks(data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, priorityFilter, categoryFilter, sortBy]);

  // Handle Status Update Action
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const data = await staffService.updateTaskStatus(taskId, newStatus);
      if (data.success) {
        fetchTasks();
        if (selectedTask && selectedTask.taskId === taskId) {
          setSelectedTask({ ...selectedTask, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Handle Note / Issue Submit
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const data = await staffService.addNote(selectedTask.taskId, { note: newNote, isIssue });
      if (data.success) {
        setNewNote('');
        setIsIssue(false);
        fetchTasks();
        setSelectedTask(null);
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  // Helper Badge Color Styles
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'inProgress': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-indigo-100 text-indigo-800';
      case 'onHold': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assigned Tasks</h1>
          <p className="text-sm text-gray-500">Manage and update your daily maintenance work items</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title, ticket ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="assigned">Assigned</option>
            <option value="accepted">Accepted</option>
            <option value="inProgress">In Progress</option>
            <option value="onHold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort By</option>
            <option value="priority">Priority</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>
      </div>

      {/* Tasks List Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading assigned tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">No assigned tasks found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.taskId}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-gray-400">{task.ticketId}</span>
                  <div className="flex gap-1.5">
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityBadge(task.priority)} font-medium capitalize`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{task.description}</p>

                <div className="mt-4 space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{task.property.name} • {task.location.building}, Unit {task.location.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Scheduled: {task.scheduledDate} ({task.scheduledTime})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Assigned By: {task.assignedBy.name}</span>
                  </div>
                </div>
              </div>

              {/* Workflow Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                {task.status === 'assigned' && (
                  <button
                    onClick={() => handleStatusUpdate(task.taskId, 'accepted')}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Accept Task
                  </button>
                )}
                {task.status === 'accepted' && (
                  <button
                    onClick={() => handleStatusUpdate(task.taskId, 'inProgress')}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Task
                  </button>
                )}
                {task.status === 'inProgress' && (
                  <div className="flex w-full gap-2">
                    <button
                      onClick={() => handleStatusUpdate(task.taskId, 'onHold')}
                      className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(task.taskId, 'completed')}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Complete
                    </button>
                  </div>
                )}
                {task.status === 'onHold' && (
                  <button
                    onClick={() => handleStatusUpdate(task.taskId, 'inProgress')}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" /> Resume Task
                  </button>
                )}

                <button
                  onClick={() => navigate(`/staff/tasks/${task.taskId}`)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Details & Action Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <span className="text-xs font-bold text-gray-400">{selectedTask.ticketId}</span>
                  <h2 className="text-xl font-bold text-gray-900">{selectedTask.title}</h2>
                </div>
                <button onClick={() => setSelectedTask(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Task Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-600">
                  <p><strong>Category:</strong> {selectedTask.category}</p>
                  <p><strong>Description:</strong> {selectedTask.description}</p>
                  <p><strong>Location:</strong> {selectedTask.property.name}, {selectedTask.location.building} (Floor {selectedTask.location.floor}, Unit {selectedTask.location.unit})</p>
                  <p><strong>Scheduled:</strong> {selectedTask.scheduledDate} at {selectedTask.scheduledTime}</p>
                </div>
              </div>

              {/* Add Note or Report Issue Section */}
              <form onSubmit={handleAddNote} className="space-y-3 border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700">Add Work Note / Report Issue</h4>
                <textarea
                  rows="3"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type notes or details regarding progress/issues..."
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-red-600 font-medium">
                    <input
                      type="checkbox"
                      checked={isIssue}
                      onChange={(e) => setIsIssue(e.target.checked)}
                      className="rounded text-red-600"
                    />
                    Flag as Blocked Issue
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black"
                  >
                    Submit Note
                  </button>
                </div>
              </form>
            </div>

            <div className="border-t pt-4">
              <button
                onClick={() => setSelectedTask(null)}
                className="w-full py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;