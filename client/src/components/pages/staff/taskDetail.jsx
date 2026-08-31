import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import staffService from '../../../services/staffService';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  AlertTriangle,
  MapPin,
  User,
  Phone,
  Calendar,
  FileText,
  Camera,
  PlusCircle,
  ShieldAlert,
} from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Note & Issue modal/form inputs
  const [noteText, setNoteText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');

  // Fetch Task Details
  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const data = await staffService.getTaskDetails(id);
      if (data.success) {
        setTaskDetails(data.taskDetails);
      } else {
        setError(data.message || 'Failed to fetch task details');
      }
    } catch (err) {
      setError('Server communication error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  // Handle Lifecycle Actions (Accept, Start, Pause, Resume, Complete)
  const handleAction = async (actionName, customNote = '', customImg = '') => {
    try {
      const data = await staffService.executeTaskAction(id, {
        action: actionName,
        note: customNote || noteText || `${actionName} executed`,
        imageUrl: customImg || imageUrl,
      });
      if (data.success) {
        setNoteText('');
        setImageUrl('');
        setShowIssueModal(false);
        setIssueDescription('');
        fetchTaskDetails();
      } else {
        alert(data.message || 'Failed to update action');
      }
    } catch (err) {
      console.error('Action error:', err);
    }
  };

  // Helper Badge Color Styles
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'inProgress': return 'bg-blue-600 text-white';
      case 'accepted': return 'bg-indigo-600 text-white';
      case 'onHold': return 'bg-amber-600 text-white';
      default: return 'bg-purple-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-500 font-medium">
        Loading task information...
      </div>
    );
  }

  if (error || !taskDetails) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="text-red-500 text-lg font-semibold">{error || 'Task not found'}</div>
        <button
          onClick={() => navigate('/staff/tasks')}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm"
        >
          Back to My Tasks
        </button>
      </div>
    );
  }

  const { taskInformation, location, tenant, assignment, schedule, actions, workLog, attachments } = taskDetails;

  // Task Lifecycle Stepper mapping
  const lifecycleSteps = [
    { key: 'assigned', label: 'ASSIGNED' },
    { key: 'accepted', label: 'ACCEPTED' },
    { key: 'inProgress', label: 'IN PROGRESS' },
    { key: 'onHold', label: 'ON HOLD' },
    { key: 'completed', label: 'COMPLETED' },
  ];

  const currentStatusIndex = lifecycleSteps.findIndex(s => s.key === taskInformation.status);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/staff/tasks')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Tasks
        </button>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs rounded-full border font-semibold uppercase ${getPriorityBadge(taskInformation.priority)}`}>
            {taskInformation.priority} Priority
          </span>
          <span className={`px-3 py-1 text-xs rounded-full font-semibold uppercase ${getStatusBadge(taskInformation.status)}`}>
            {taskInformation.status}
          </span>
        </div>
      </div>

      {/* Task Lifecycle Visualization */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Task Lifecycle Stage</h3>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {lifecycleSteps.map((step, index) => {
            const isCurrent = taskInformation.status === step.key;
            const isPassed = currentStatusIndex > index && taskInformation.status !== 'onHold';
            const isOnHold = step.key === 'onHold' && taskInformation.status === 'onHold';

            return (
              <React.Fragment key={step.key}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isOnHold
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : isPassed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-xs font-bold ${isCurrent || isOnHold ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
                {index < lifecycleSteps.length - 1 && (
                  <div className={`hidden md:block flex-1 h-0.5 ${index < currentStatusIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Action Buttons Panel */}
      {actions.length > 0 && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-3 items-center justify-between">
          <span className="text-sm font-bold text-gray-700">Available Actions:</span>
          <div className="flex flex-wrap gap-2">
            {actions.includes('Accept Task') && (
              <button
                onClick={() => handleAction('Accept Task')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Accept Task
              </button>
            )}
            {actions.includes('Start Task') && (
              <button
                onClick={() => handleAction('Start Task')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Start Task
              </button>
            )}
            {actions.includes('Pause Task') && (
              <button
                onClick={() => handleAction('Pause Task')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Pause className="w-3.5 h-3.5" /> Pause Task
              </button>
            )}
            {actions.includes('Resume Task') && (
              <button
                onClick={() => handleAction('Resume Task')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Resume Task
              </button>
            )}
            {actions.includes('Complete Task') && (
              <button
                onClick={() => handleAction('Complete Task')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Complete Task
              </button>
            )}
            {actions.includes('Report Issue') && (
              <button
                onClick={() => setShowIssueModal(true)}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Report Issue
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Task Info, Location, Work Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Info & Location */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">{taskInformation.ticketId}</span>
              <h1 className="text-xl font-bold text-gray-900">{taskInformation.title}</h1>
              <p className="text-sm text-gray-600 mt-1">{taskInformation.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400 uppercase">Location</span>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">{location.property}</p>
                    <p>{location.building}, Floor {location.floor}, Unit {location.unit}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400 uppercase">Schedule</span>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">{schedule.date}</p>
                    <p>{schedule.startTime} - {schedule.expectedEndTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Log Timeline */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Work Log History
            </h3>

            <div className="space-y-4">
              {workLog.length === 0 ? (
                <p className="text-xs text-gray-400">No work log entries recorded yet.</p>
              ) : (
                workLog.map((log, index) => (
                  <div key={index} className="flex gap-3 text-xs border-l-2 border-blue-500 pl-4 py-1">
                    <div>
                      <span className="font-bold text-gray-400">{log.time}</span>
                      <p className="font-bold text-gray-900">{log.action}</p>
                      <p className="text-gray-600 mt-0.5">{log.note}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Work Note */}
            <div className="pt-4 border-t space-y-3">
              <h4 className="text-xs font-bold text-gray-700">Add Work Log Note</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Reached unit, checked wiring..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleAction('Update Work Log', noteText)}
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-black"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tenant Info, Assignment, Attachments */}
        <div className="space-y-6">
          {/* Tenant Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tenant Contact</h3>
            <div className="space-y-2 text-sm text-gray-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">{tenant.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{tenant.phone}</span>
              </div>
            </div>
          </div>

          {/* Assignment Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assignment Details</h3>
            <div className="space-y-2 text-xs text-gray-700">
              <p><strong>Assigned By:</strong> {assignment.assignedBy}</p>
              <p><strong>Assigned To:</strong> {assignment.assignedTo}</p>
              <p><strong>Assigned Date:</strong> {assignment.assignedDate}</p>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attachments / Work Images</h3>
            {attachments.length === 0 ? (
              <p className="text-xs text-gray-400">No attachments uploaded.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {attachments.map((att, i) => (
                  <img
                    key={i}
                    src={att.url}
                    alt="Task attachment"
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}

            {/* Image URL Attach Input */}
            <div className="pt-2 space-y-2">
              <input
                type="text"
                placeholder="Paste Image URL to upload..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-1.5 border rounded-xl text-xs"
              />
              <button
                onClick={() => handleAction('Upload Image', 'Uploaded task photo', imageUrl)}
                className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" /> Attach Photo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <ShieldAlert className="w-5 h-5" /> Report Blocked Issue
            </div>
            <p className="text-xs text-gray-600">
              Describing an issue will pause the task (`ON HOLD`) and notify the manager.
            </p>
            <textarea
              rows="4"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Describe the blocker (e.g., spare parts missing, tenant unavailable)..."
              className="w-full p-3 border rounded-xl text-xs focus:ring-2 focus:ring-red-500"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowIssueModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction('Report Issue', issueDescription)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl"
              >
                Submit Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;