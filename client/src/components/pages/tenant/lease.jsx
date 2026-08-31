import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Shield, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Eye, 
  RefreshCw, 
  FileCheck2, 
  ArrowRight,
  Info,
  Building,
  DollarSign,
  HelpCircle,
  X
} from 'lucide-react';

const Lease = () => {
  const [loading, setLoading] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  
  // State matching requirement JSON specs
  const [leaseData, setLeaseData] = useState({
    leaseId: "LEASE001",
    status: "active",
    duration: {
      start: "2026-01-01",
      end: "2026-12-31",
      daysRemaining: 127
    },
    financial: {
      monthlyRent: 15000,
      securityDeposit: 30000,
      maintenance: 1000
    },
    renewal: {
      eligible: true,
      renewalWindow: "30 days before expiry"
    },
    renewalRequest: {
      status: "not_requested",
      preferredDuration: "12 months",
      requestedRent: null,
      tenantComment: ""
    },
    features: [
      "View Agreement",
      "Download Agreement",
      "Lease Expiry Countdown",
      "Renewal Request",
      "View Terms",
      "View Deposit"
    ]
  });

  // Renewal Form State
  const [renewalForm, setRenewalForm] = useState({
    preferredDuration: "12 months",
    requestedRent: "15000",
    tenantComment: ""
  });

  const handleRenewalSubmit = (e) => {
    e.preventDefault();
    setLeaseData(prev => ({
      ...prev,
      status: "pending_renewal",
      renewalRequest: {
        status: "pending",
        preferredDuration: renewalForm.preferredDuration,
        requestedRent: Number(renewalForm.requestedRent),
        tenantComment: renewalForm.tenantComment
      }
    }));
    setShowRenewalModal(false);
  };

  const handleDownloadPdf = () => {
    alert(`Downloading Official Lease Agreement (${leaseData.leaseId}.pdf)...`);
  };

  return (
    <>
      <TenantNavigation />
      <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold">
              Official Contract
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
              leaseData.status === 'active' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              <CheckCircle className="w-3.5 h-3.5" /> 
              {leaseData.status === 'active' ? 'Active Contract' : 'Renewal Pending'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            Lease Agreement <span className="text-indigo-400 font-mono text-2xl">#{leaseData.leaseId}</span>
          </h1>
          <p className="text-slate-400 text-sm">Valid from {leaseData.duration.start} to {leaseData.duration.end}</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3 z-10">
          <button
            onClick={() => setShowAgreementModal(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition backdrop-blur-sm flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-indigo-400" /> View Agreement
          </button>
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Countdown & Renewal Alert Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Countdown Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 rounded-3xl shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider block">Lease Expiry Countdown</span>
            <div className="text-4xl font-black">{leaseData.duration.daysRemaining} <span className="text-lg font-normal text-indigo-200">Days</span></div>
            <p className="text-xs text-indigo-200">Remaining on current tenure</p>
          </div>
          <Clock className="w-12 h-12 text-indigo-300 opacity-60" />
        </div>

        {/* ⭐ Unique Feature: Lease Renewal Status Box */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Lease Renewal Status</h3>
                <p className="text-xs text-slate-400">Renewal Window: {leaseData.renewal.renewalWindow}</p>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              leaseData.renewalRequest.status === 'pending' 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {leaseData.renewalRequest.status === 'pending' ? 'Request Submitted' : 'Not Requested'}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
            {leaseData.renewalRequest.status === 'pending' ? (
              <p className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Renewal request of {leaseData.renewalRequest.preferredDuration} is under review by Property Manager.
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                You are eligible for lease extension. Send your preferred duration & terms.
              </p>
            )}

            {leaseData.renewalRequest.status === 'not_requested' && (
              <button
                onClick={() => setShowRenewalModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                Request Renewal <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Financial Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Rent</span>
            <CreditCard className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800">₹{leaseData.financial.monthlyRent.toLocaleString()}</div>
          <p className="text-xs text-slate-400">Due on 1st of every calendar month</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Security Deposit</span>
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800">₹{leaseData.financial.securityDeposit.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 font-medium">Refundable at end of lease</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Maintenance Fee</span>
            <Building className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800">₹{leaseData.financial.maintenance.toLocaleString()}</div>
          <p className="text-xs text-slate-400">Fixed society charges included</p>
        </div>
      </div>

      {/* Contract Features Matrix */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Contract Privileges & Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {leaseData.features.map((feature, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-2">
              <FileCheck2 className="w-6 h-6 text-indigo-600" />
              <span className="text-xs font-bold text-slate-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Renewal Request Modal */}
      {showRenewalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative">
            <button 
              onClick={() => setShowRenewalModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-slate-800">Submit Lease Renewal Request</h3>
              <p className="text-xs text-slate-400 mt-1">Specify your proposed tenure and comments for manager review.</p>
            </div>

            <form onSubmit={handleRenewalSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Duration</label>
                <select
                  value={renewalForm.preferredDuration}
                  onChange={(e) => setRenewalForm({ ...renewalForm, preferredDuration: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="6 months">6 Months</option>
                  <option value="12 months">12 Months (Standard)</option>
                  <option value="24 months">24 Months</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Proposed Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={renewalForm.requestedRent}
                  onChange={(e) => setRenewalForm({ ...renewalForm, requestedRent: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tenant Notes / Remarks</label>
                <textarea
                  rows="3"
                  placeholder="Add any request (e.g., requested paint touchup before renewal)..."
                  value={renewalForm.tenantComment}
                  onChange={(e) => setRenewalForm({ ...renewalForm, tenantComment: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowRenewalModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View Digital Agreement */}
      {showAgreementModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowAgreementModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800">Digital Tenancy Contract Terms</h3>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-3 leading-relaxed">
              <p><strong>1. Rent Payment:</strong> The tenant agrees to pay ₹{leaseData.financial.monthlyRent} on or before the 1st of each calendar month.</p>
              <p><strong>2. Security Deposit:</strong> ₹{leaseData.financial.securityDeposit} held securely as security deposit, refundable post inspection upon contract termination.</p>
              <p><strong>3. Maintenance & Repairs:</strong> Tenant shall maintain unit cleanliness. Structural maintenance is handled by building management.</p>
              <p><strong>4. Termination Notice:</strong> Either party must provide at least 30 days prior written notice before vacating premises.</p>
            </div>
          </div>
        </div>
      )}
      </div>

    </>
  );
};

export default Lease;