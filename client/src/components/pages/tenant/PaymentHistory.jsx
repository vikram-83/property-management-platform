import React, { useState, useMemo } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import {
  Search,
  Filter,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Calendar,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';

const PaymentHistory = () => {
  // State matching your JSON schema exactly
  const [data] = useState({
    paymentHistory: {
      filters: [
        "date",
        "month",
        "year",
        "status",
        "paymentMethod"
      ],
      transactions: [
        {
          id: "PAY001",
          invoice: "INV001",
          amount: 16700,
          method: "UPI",
          transactionId: "TXN78652",
          date: "2026-08-05",
          status: "success"
        },
        {
          id: "PAY002",
          invoice: "INV002",
          amount: 16700,
          method: "Card",
          transactionId: "TXN89123",
          date: "2026-07-05",
          status: "success"
        },
        {
          id: "PAY003",
          invoice: "INV003",
          amount: 16700,
          method: "Net Banking",
          transactionId: "TXN12398",
          date: "2026-06-05",
          status: "success"
        },
        {
          id: "PAY004",
          invoice: "INV004",
          amount: 16700,
          method: "UPI",
          transactionId: "TXN45612",
          date: "2026-05-05",
          status: "success"
        }
      ],
      features: [
        "Search Transactions",
        "Filter Payments",
        "Download Receipt",
        "Download Invoice",
        "Payment Verification"
      ]
    }
  });

  const { filters, transactions, features } = data.paymentHistory;

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Filtered Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
      const matchesMethod = selectedMethod === 'all' || t.method === selectedMethod;
      const matchesYear = selectedYear === 'all' || t.date.startsWith(selectedYear);

      return matchesSearch && matchesStatus && matchesMethod && matchesYear;
    });
  }, [transactions, searchTerm, selectedStatus, selectedMethod, selectedYear]);

  const handleDownloadInvoice = (invoiceNo) => {
    alert(`Downloading Invoice ${invoiceNo}.pdf...`);
  };

  const handleDownloadReceipt = (txnId) => {
    alert(`Downloading Payment Receipt for ${txnId}.pdf...`);
  };

  return (
    <>
      <TenantNavigation />
      <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Page Header */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 z-10">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold">
            Financial Ledger
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Payment History</h1>
          <p className="text-slate-400 text-sm">
            View, filter, and export all historical rent transactions and receipts.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-right">
          <p className="text-xs text-slate-400 font-medium uppercase">Total Executed Payments</p>
          <p className="text-2xl font-black text-emerald-400">{transactions.length} Verified</p>
        </div>
      </div>

      {/* Control Bar: Search & Dynamic Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by Payment ID, Invoice, or Txn ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 transition"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600"
            >
              <option value="all">Status: All</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Method Filter */}
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600"
            >
              <option value="all">Method: All</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600"
            >
              <option value="all">Year: All</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>

            {/* Reset Button */}
            {(searchTerm || selectedStatus !== 'all' || selectedMethod !== 'all' || selectedYear !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                  setSelectedMethod('all');
                  setSelectedYear('all');
                }}
                className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800">Transaction Records ({filteredTransactions.length})</h2>
          <span className="text-xs text-slate-400">Showing filtered results</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-400 uppercase font-semibold">
                <th className="py-4 px-6">Payment ID</th>
                <th className="py-4 px-6">Invoice</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 font-bold text-slate-800">{item.id}</td>
                    <td className="py-4 px-6 font-semibold text-indigo-600 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> {item.invoice}
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900">₹{item.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 flex items-center gap-1.5 w-max">
                        {item.method === 'UPI' && <QrCode className="w-3.5 h-3.5 text-indigo-600" />}
                        {item.method === 'Card' && <CreditCard className="w-3.5 h-3.5 text-indigo-600" />}
                        {item.method === 'Net Banking' && <Building className="w-3.5 h-3.5 text-indigo-600" />}
                        {item.method}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">{item.transactionId}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-600">{item.date}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max ${
                        item.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownloadInvoice(item.invoice)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                          title="Download Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(item.transactionId)}
                          className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-sm">
                    No transactions match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supported System Features Badges */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ledger Features Active</h3>
        <div className="flex flex-wrap gap-2">
          {features.map((feat, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> {feat}
            </span>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

export default PaymentHistory;