import { useState } from 'react';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import Badge, { getStatusBadge } from '../components/Badge';
import Modal from '../components/Modal';
import { mockPayments, mockPatients } from '../data/mockData';
import type { Payment, PaymentMethod } from '../types';

const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'card', 'insurance', 'bank-transfer', 'check'];

export default function BillingPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkout, setCheckout] = useState({
    patientId: '', appointmentId: '', amount: '', method: 'card' as PaymentMethod,
    description: '', insuranceClaim: '',
  });

  const filtered = mockPayments.filter((p) => {
    const matchSearch = p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.paidAmount, 0);
  const totalPending = mockPayments.filter(p => p.status !== 'paid').reduce((s, p) => s + (p.amount - p.paidAmount), 0);
  const totalOverdue = mockPayments.filter(p => p.status === 'overdue').reduce((s, p) => s + (p.amount - p.paidAmount), 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Payment processed! (Demo)');
    setShowCheckoutModal(false);
  };

  return (
    <Layout>
      <Topbar
        title="Billing & Payments"
        action={
          <button
            onClick={() => setShowCheckoutModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Invoice
          </button>
        }
      />

      <div className="p-6 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Collected</p>
              <div className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">Outstanding Balance</p>
              <div className="h-8 w-8 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-2">${totalPending.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">Overdue</p>
              <div className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-2">${totalOverdue.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              type="text"
              placeholder="Search by patient or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'paid', 'pending', 'overdue'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === f ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  {['Patient', 'Description', 'Total', 'Paid', 'Remaining', 'Method', 'Date', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-slate-400">No records found</td></tr>
                ) : filtered.map((pay) => (
                  <tr
                    key={pay.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedPayment(pay)}
                  >
                    <td className="px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white">{pay.patientName}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{pay.description}</td>
                    <td className="px-5 py-3 text-sm font-medium text-slate-900 dark:text-white">${pay.amount.toFixed(2)}</td>
                    <td className="px-5 py-3 text-sm text-green-600 dark:text-green-400">${pay.paidAmount.toFixed(2)}</td>
                    <td className="px-5 py-3 text-sm">
                      {pay.amount - pay.paidAmount > 0 ? (
                        <span className="text-red-500">${(pay.amount - pay.paidAmount).toFixed(2)}</span>
                      ) : <span className="text-green-600">$0.00</span>}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400 capitalize">{pay.method}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">{pay.date}</td>
                    <td className="px-5 py-3">
                      <Badge variant={getStatusBadge(pay.status)}>{pay.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      {pay.status !== 'paid' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); alert('Payment processed! (Demo)'); }}
                          className="text-xs px-2.5 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <Modal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} title="New Invoice / Payment" size="md">
        <form onSubmit={handleCheckout} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient *</span>
            <select
              value={checkout.patientId}
              onChange={(e) => setCheckout(p => ({ ...p, patientId: e.target.value }))}
              required
              className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select patient...</option>
              {mockPatients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Description *</span>
            <input
              type="text"
              value={checkout.description}
              onChange={(e) => setCheckout(p => ({ ...p, description: e.target.value }))}
              required
              placeholder="e.g. Dental cleaning & X-ray"
              className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount ($) *</span>
              <input
                type="number"
                value={checkout.amount}
                onChange={(e) => setCheckout(p => ({ ...p, amount: e.target.value }))}
                required min={0} step="0.01"
                className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Method</span>
              <select
                value={checkout.method}
                onChange={(e) => setCheckout(p => ({ ...p, method: e.target.value as PaymentMethod }))}
                className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m.replace('-', ' ').charAt(0).toUpperCase() + m.replace('-', ' ').slice(1)}</option>)}
              </select>
            </label>
          </div>
          {checkout.method === 'insurance' && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Insurance Claim #</span>
              <input
                type="text"
                value={checkout.insuranceClaim}
                onChange={(e) => setCheckout(p => ({ ...p, insuranceClaim: e.target.value }))}
                placeholder="INS-2026-XXXX"
                className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCheckoutModal(false)}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">
              Process Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Payment Detail Modal */}
      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Payment Details">
        {selectedPayment && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{selectedPayment.patientName}</h4>
              <Badge variant={getStatusBadge(selectedPayment.status)}>{selectedPayment.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              {[
                { label: 'Description', value: selectedPayment.description },
                { label: 'Date', value: selectedPayment.date },
                { label: 'Total Amount', value: `$${selectedPayment.amount.toFixed(2)}` },
                { label: 'Paid', value: `$${selectedPayment.paidAmount.toFixed(2)}` },
                { label: 'Remaining', value: `$${(selectedPayment.amount - selectedPayment.paidAmount).toFixed(2)}` },
                { label: 'Method', value: selectedPayment.method },
                ...(selectedPayment.insuranceClaim ? [{ label: 'Insurance Claim', value: selectedPayment.insuranceClaim }] : []),
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {selectedPayment.status !== 'paid' && (
                <button
                  onClick={() => { alert('Payment processed! (Demo)'); setSelectedPayment(null); }}
                  className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Mark as Paid
                </button>
              )}
              <button
                onClick={() => setSelectedPayment(null)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
