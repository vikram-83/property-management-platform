import React, { useState } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import {
  AlertTriangle,
  Upload,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  FileVideo,
  Image as ImageIcon,
  Loader2,
  MapPin,
  ShieldAlert
} from 'lucide-react';
import { MaintenanceService } from '../../../api/maintenanceApi';

const CATEGORIES = [
  'Electrical',
  'Plumbing',
  'AC',
  'Internet',
  'Cleaning',
  'Appliance',
  'Carpentry',
  'Security',
  'Other'
];

const EMERGENCY_CATEGORIES = [
  'Major Water Leakage',
  'Power Failure',
  'Gas Problem',
  'Security Issue',
  'Lockout'
];

const CreateMaintenance = () => {
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyCat, setEmergencyCat] = useState('Major Water Leakage');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AC');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState('Master Bedroom');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (9 AM - 12 PM)');

  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  const [aiSuggested, setAiSuggested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Smart Feature: Auto-suggest Category & Priority based on description
  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);

    const lower = val.toLowerCase();
    if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe')) {
      setCategory('Plumbing');
      if (lower.includes('flood') || lower.includes('burst')) setPriority('urgent');
      setAiSuggested(true);
    } else if (lower.includes('light') || lower.includes('spark') || lower.includes('switch')) {
      setCategory('Electrical');
      if (lower.includes('spark') || lower.includes('short')) setPriority('high');
      setAiSuggested(true);
    } else if (lower.includes('ac') || lower.includes('cool') || lower.includes('ac not')) {
      setCategory('AC');
      setPriority('high');
      setAiSuggested(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', isEmergency ? 'Other' : category);
    formData.append('priority', isEmergency ? 'urgent' : priority);
    formData.append('location', location);
    formData.append('preferredDate', preferredDate);
    formData.append('preferredTime', preferredTime);
    formData.append('isEmergency', isEmergency);
    formData.append('emergencyCategory', isEmergency ? emergencyCat : 'None');

    Array.from(photos).forEach((photo) => formData.append('photos', photo));
    Array.from(videos).forEach((video) => formData.append('videos', video));

    try {
      const res = await MaintenanceService.createTicket(formData);
      setSuccessMsg(res.message);
      // Reset form
      setTitle('');
      setDescription('');
      setPhotos([]);
      setVideos([]);
    } catch (err) {
      alert('Error creating ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TenantNavigation />
      <div className="p-6 bg-slate-50 min-h-screen space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Raise Maintenance Ticket</h1>
          <p className="text-xs text-slate-400 mt-1">Smart problem classification with media attachments & emergency options.</p>
        </div>

        {/* Emergency Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsEmergency(!isEmergency)}
          className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition ${
            isEmergency
              ? 'bg-red-600 text-white animate-pulse hover:bg-red-700'
              : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          {isEmergency ? '🚨 EMERGENCY MODE ACTIVE' : 'Toggle Emergency Mode'}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* 🚨 Emergency Mode Protocol Card */}
      {isEmergency && (
        <div className="bg-red-950 text-white p-6 rounded-3xl space-y-4 border border-red-800 shadow-xl">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-wider">Emergency Dispatch Protocol Active</h3>
          </div>

          <p className="text-xs text-red-200 leading-relaxed">
            Marking an emergency notifies property managers and nearest available staff immediately. Please use this for urgent situations only.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-red-300">Select Critical Issue</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {EMERGENCY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setEmergencyCat(cat)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition ${
                    emergencyCat === cat
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-red-900/40 text-red-300 border-red-800 hover:bg-red-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Request Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        {/* Category Selection */}
        {!isEmergency && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-400">1. Problem Category</label>
              {aiSuggested && (
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-Categorized
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                    category === cat
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Title & Description */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400">Ticket Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Master Bedroom AC throwing warm air"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">Detailed Description</label>
            <textarea
              rows={4}
              required
              placeholder="Describe what happened, noise issues, water pooling, etc..."
              value={description}
              onChange={handleDescriptionChange}
              className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Location & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Issue Location inside Unit
            </label>
            <input
              type="text"
              placeholder="e.g. Kitchen sink, Hallway ceiling"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>

          {!isEmergency && (
            <div>
              <label className="text-xs font-bold uppercase text-slate-400">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="low">Low - Resolve within 48 hrs</option>
                <option value="medium">Medium - Resolve within 24 hrs</option>
                <option value="high">High - Same day resolution</option>
                <option value="urgent">Urgent - Immediate response</option>
              </select>
            </div>
          )}
        </div>

        {/* Preferred Date & Visit Time */}
        {!isEmergency && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Preferred Visit Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Preferred Time Slot
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
              </select>
            </div>
          </div>
        )}

        {/* Photo & Video Uploads */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <label className="text-xs font-bold uppercase text-slate-400">Attach Media Evidence (Photos & Videos)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:border-indigo-400 transition bg-slate-50">
              <ImageIcon className="w-6 h-6 text-slate-400" />
              <p className="text-xs font-bold text-slate-600">Upload Photos (Max 5)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setPhotos(e.target.files)}
                className="text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:border-indigo-400 transition bg-slate-50">
              <FileVideo className="w-6 h-6 text-slate-400" />
              <p className="text-xs font-bold text-slate-600">Upload Short Video Clip (Max 2)</p>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={(e) => setVideos(e.target.files)}
                className="text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition ${
            isEmergency
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isEmergency ? (
            <>
              <Zap className="w-4 h-4" /> Broadcast Emergency Alert Now
            </>
          ) : (
            'Submit Maintenance Ticket'
          )}
        </button>
      </form>
      </div>
    
    </>
  );
};

export default CreateMaintenance;