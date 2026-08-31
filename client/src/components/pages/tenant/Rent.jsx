import React, { useState } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import {
  CreditCard,
  Zap,
  Droplet,
  Building,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  TrendingUp,
  Sparkles,
  Receipt,
  ShieldCheck,
  ChevronRight,
  X,
  Clock,
  QrCode
} from 'lucide-react';

const Rent = () => {
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Exact State Structure from Query
  const [rentData, setRentData] = useState({
    rentCenter: {
      currentBill: {
        rent: 15000,
        maintenance: 1000,
        electricity: 500,
        water: 200,
        lateFee: 0,
        total: 16700
      },
      dueDate: "2026-09-05",
      payment: {
        status: "pending",
        methods: ["UPI", "Card", "Net Banking"]
      },
      features: [
        "One Click Payment",
        "Download Invoice",
        "Payment Receipt",
        "Rent Breakdown",
        "Due Date Reminder",
        "Payment Status"
      ],
      rentHistoryGraph: true
    },
    rentPrediction: {
      nextMonthEstimatedAmount: 16700,
      basedOn: [
        "Monthly Rent",
        "Maintenance Charges",
        "Utility Usage"
      ]
    }
  });

  const { currentBill, dueDate, payment, features } = rentData.rentCenter;
  const { rentPrediction } = rentData;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setRentData(prev => ({
        ...prev,
        rentCenter: {
          ...prev.rentCenter,
          payment: { ...prev.rentCenter.payment, status: "paid" }
        }
      }));
    }, 1500);
  };

  return (
    <>
      <TenantNavigation />
      <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold">
              Smart Billing Hub
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
              payment.status === 'paid'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {payment.status === 'paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {payment.status === 'paid' ? 'Paid' : 'Payment Due'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Rent & Utilities Center</h1>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> Payment Due Date: <span className="font-semibold text-white">{dueDate}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 z-10">
          <button 
            onClick={() => alert("Downloading official tax invoice PDF...")}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition backdrop-blur-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-indigo-400" /> Invoice
          </button>
          
          {payment.status === 'pending' ? (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> One Click Pay
            </button>
          ) : (
            <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
              <Receipt className="w-4 h-4" /> Payment Receipt
            </button>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Amount Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Current Payable Total</span>
            <Receipt className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <div className="text-4xl font-black">₹{currentBill.total.toLocaleString()}</div>
            <p className="text-xs text-indigo-200 mt-1">Includes rent + society maintenance + utilities</p>
          </div>
          <div className="pt-2 border-t border-indigo-500/30 text-xs text-indigo-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit Encrypted Payment Processing
          </div>
        </div>

        {/* ⭐ Unique Feature: Rent Prediction Engine */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Next Month Rent Prediction</h3>
                <p className="text-xs text-slate-400">Smart AI estimated billing cycle analysis</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Accuracy
            </span>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-medium">Estimated Amount</span>
              <div className="text-2xl font-black text-slate-800">₹{rentPrediction.nextMonthEstimatedAmount.toLocaleString()}</div>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 block">Calculated Based On:</span>
              <div className="flex flex-wrap gap-1.5">
                {rentPrediction.basedOn.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Rent Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Rent & Utility Itemized Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl"><Building className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Base Rent</p>
                <p className="text-lg font-bold text-slate-800">₹{currentBill.rent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl"><Zap className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Electricity</p>
                <p className="text-lg font-bold text-slate-800">₹{currentBill.electricity}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-100 text-sky-600 rounded-xl"><Droplet className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Water Charges</p>
                <p className="text-lg font-bold text-slate-800">₹{currentBill.water}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl"><Building className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Maintenance</p>
                <p className="text-lg font-bold text-slate-800">₹{currentBill.maintenance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Badges Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Rent Hub Features Enabled</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {features.map((feat, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold text-slate-700">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {!paymentSuccess ? (
              <>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Select Payment Method</h3>
                  <p className="text-xs text-slate-400 mt-1">Total Payable: <strong className="text-slate-800">₹{currentBill.total.toLocaleString()}</strong></p>
                </div>

                <div className="space-y-2">
                  {payment.methods.map((method) => (
                    <div
                      key={method}
                      onClick={() => setSelectedMethod(method)}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                        selectedMethod === method
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-sm font-bold flex items-center gap-2">
                        {method === 'UPI' && <QrCode className="w-4 h-4 text-indigo-600" />}
                        {method === 'Card' && <CreditCard className="w-4 h-4 text-indigo-600" />}
                        {method === 'Net Banking' && <Building className="w-4 h-4 text-indigo-600" />}
                        {method}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedMethod === method ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}>
                        {selectedMethod === method && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Processing Transaction...' : `Pay ₹${currentBill.total.toLocaleString()} via ${selectedMethod}`}
                </button>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Payment Successful!</h3>
                <p className="text-xs text-slate-500">Transaction ID: TXN98723410. Rent receipt has been generated.</p>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentSuccess(false);
                  }}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    
    </>
  );
};

export default Rent;