import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowLeft,
  DollarSign,
  Camera,
  ShieldCheck,
  Send,
} from 'lucide-react';
import PageDropdownNav from '../../common/PageDropdownNav';

const MOCK_JOB_DATA = {
  jobId: 'JOB-10245',
  title: 'AC Compressor Repair & Gas Refill',
  category: 'HVAC Maintenance',
  priority: 'HIGH',
  status: 'IN_PROGRESS',
  property: {
    name: 'Green Valley Residency',
    building: 'Block A',
    unit: 'Unit A-203 (3BHK)',
    address: '124 Civil Lines, Satna, MP',
  },
  assignedBy: {
    id: 'MGR-001',
    name: 'Amit Sharma',
    role: 'Senior Property Manager',
    phone: '+91 98765 43210',
    email: 'amit.sharma@propertymanagement.com',
  },
  scheduledDate: '2026-08-31',
  scheduledTime: '10:00 AM - 01:30 PM',
  estimatedCost: 2500,
  technician: 'Rajesh Kumar (HVAC Lead)',
  description:
    'Tenant reported cooling failure and unusual grinding noise from outdoor compressor unit. Comprehensive diagnostic check, pressure testing, and refrigerant recharge (R-410A) required.',
  timeline: [
    { step: 'Work Order Created', time: 'Today, 08:30 AM', completed: true },
    { step: 'Vendor Accepted Job', time: 'Today, 09:15 AM', completed: true },
    { step: 'Technician Dispatched', time: 'Today, 10:00 AM', completed: true },
    { step: 'On-Site Diagnostic & Repair', time: 'In Progress', active: true },
    { step: 'Quality Verification & Sign-off', time: 'Pending', completed: false },
    { step: 'Invoice Submission', time: 'Pending', completed: false },
  ],
  materials: [
    { id: 1, name: 'R-410A Refrigerant Gas (1kg)', qty: 1, rate: 1200, total: 1200 },
    { id: 2, name: 'Heavy-Duty Capacitor (50uF)', qty: 1, rate: 450, total: 450 },
    { id: 3, name: 'Insulation Foam Tape Roll', qty: 2, rate: 100, total: 200 },
  ],
};

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(MOCK_JOB_DATA);
  const [status, setStatus] = useState(job.status);
  const [workNotes, setWorkNotes] = useState('Replaced damaged 50uF starting capacitor. Verified refrigerant pressure at 120 PSI. Cooling restored efficiently.');
  const [newMaterial, setNewMaterial] = useState({ name: '', qty: 1, rate: 0 });
  const [materials, setMaterials] = useState(job.materials);
  const [toastMsg, setToastMsg] = useState('');

  const laborCost = 800;
  const materialsTotal = materials.reduce((acc, curr) => acc + curr.total, 0);
  const grandTotal = laborCost + materialsTotal;

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!newMaterial.name.trim()) return;
    const itemTotal = Number(newMaterial.qty) * Number(newMaterial.rate);
    const item = {
      id: Date.now(),
      name: newMaterial.name.trim(),
      qty: Number(newMaterial.qty),
      rate: Number(newMaterial.rate),
      total: itemTotal,
    };
    setMaterials([...materials, item]);
    setNewMaterial({ name: '', qty: 1, rate: 0 });
    showToast('Added material item to work order');
  };

  const handleStatusUpdate = (newStatus) => {
    setStatus(newStatus);
    showToast(`Status updated to: ${newStatus}`);
  };

  const handleGenerateInvoice = () => {
    showToast(`✓ Invoice generated for ₹${grandTotal.toLocaleString()} & submitted to Manager!`);
    setTimeout(() => {
      navigate('/vendor/invoices');
    }, 1500);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="vendor" currentFileName="jobDetails.jsx" />

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/vendor/jobs')}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
            title="Back to Jobs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold rounded-full">
                {status}
              </span>
              <span className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold rounded-full">
                {job.priority} PRIORITY
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Job ID: <strong className="text-slate-800">{id || job.jobId}</strong> | Category: {job.category}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusUpdate('COMPLETED')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition shadow-sm flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark Complete</span>
          </button>
          <button
            onClick={handleGenerateInvoice}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>Create Invoice (₹{grandTotal})</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details, Materials, Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Job Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Work Order Details</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{job.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 font-semibold uppercase">Property & Location</span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{job.property.name} ({job.property.unit})</span>
                </p>
                <p className="text-xs text-slate-500">{job.property.address}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 font-semibold uppercase">Schedule & Assignment</span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{job.scheduledDate} ({job.scheduledTime})</span>
                </p>
                <p className="text-xs text-slate-500">Lead Tech: {job.technician}</p>
              </div>
            </div>
          </div>

          {/* Materials & Parts Used */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Materials & Parts Required</h2>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                Total Parts: ₹{materialsTotal.toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase text-slate-400 font-semibold">
                    <th className="pb-2">Material / Component</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Unit Rate</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {materials.map((mat) => (
                    <tr key={mat.id}>
                      <td className="py-2.5 font-medium">{mat.name}</td>
                      <td className="py-2.5">{mat.qty}</td>
                      <td className="py-2.5">₹{mat.rate}</td>
                      <td className="py-2.5 font-bold text-slate-900 text-right">₹{mat.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Material Mini Form */}
            <form onSubmit={handleAddMaterial} className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Part name (e.g. Copper valve)"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                className="flex-2 min-w-[180px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={newMaterial.qty}
                onChange={(e) => setNewMaterial({ ...newMaterial, qty: e.target.value })}
                className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                min="0"
                placeholder="Rate (₹)"
                value={newMaterial.rate}
                onChange={(e) => setNewMaterial({ ...newMaterial, rate: e.target.value })}
                className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Part</span>
              </button>
            </form>
          </div>

          {/* Work Completion Notes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Technician Work Notes & Diagnostics</h2>
            <textarea
              rows={3}
              value={workNotes}
              onChange={(e) => setWorkNotes(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Record repair steps, diagnostic readings, and tenant confirmation notes..."
            />
          </div>

        </div>

        {/* Right Col: Timeline, Billing Summary, Manager Contact */}
        <div className="space-y-6">
          
          {/* Billing & Invoice Summary */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-indigo-900 shadow-md space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Job Financial Summary</span>
            </h3>
            
            <div className="space-y-2 text-sm text-slate-300 border-b border-indigo-800/80 pb-4">
              <div className="flex justify-between">
                <span>Standard Labor Charges:</span>
                <span className="font-bold text-white">₹{laborCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Materials & Spares Total:</span>
                <span className="font-bold text-white">₹{materialsTotal}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-extrabold">
              <span className="text-emerald-300">Total Invoice Amount:</span>
              <span className="text-2xl text-white">₹{grandTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={handleGenerateInvoice}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>Submit Final Invoice</span>
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Workflow Progress Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Execution Timeline</h3>
            <div className="space-y-4">
              {job.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    item.completed
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.active
                      ? 'bg-blue-100 text-blue-700 animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.step}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manager Contact Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Assigned Property Manager</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                AS
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{job.assignedBy.name}</p>
                <p className="text-xs text-slate-500">{job.assignedBy.role}</p>
              </div>
            </div>
            <div className="pt-2 text-xs text-slate-600 space-y-1">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.assignedBy.phone}</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
