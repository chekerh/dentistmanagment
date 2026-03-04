import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import Badge, { getStatusBadge } from '../components/Badge';
import { mockPayments, mockPatients } from '../data/mockData';
import { useLang } from '../context/LanguageContext';

export default function FinancialReportPage() {
  const { t } = useLang();
  
  const REVENUE_CATEGORIES = [
    { label: t.financialReport.catOrtho, value: 15400, pct: 75, color: 'bg-primary' },
    { label: t.financialReport.catImplants, value: 18200, pct: 90, color: 'bg-purple-500' },
    { label: t.financialReport.catGeneral, value: 8500, pct: 45, color: 'bg-indigo-500' },
    { label: t.financialReport.catCosmetic, value: 5200, pct: 30, color: 'bg-pink-500' },
    { label: t.financialReport.catHygiene, value: 2100, pct: 15, color: 'bg-teal-500' },
  ];
  
  const TOTAL_REVENUE = REVENUE_CATEGORIES.reduce((s, c) => s + c.value, 0);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPayments = mockPayments.filter(p =>
    statusFilter === 'all' || p.status === statusFilter
  );

  const totalRevenue = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.paidAmount, 0);
  const totalPending = mockPayments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalOverdue = mockPayments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);

  const getPatient = (pid: string) => mockPatients.find(p => p.id === pid);

  return (
    <Layout>
      <Topbar
        title="Financial Report"
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/reports"
              className="flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 dark:border-border-dark text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Reports
            </Link>
            <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-border-dark transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export PDF
            </button>
          </div>
        }
      />

      <div className="p-6 max-w-[1200px] mx-auto flex flex-col gap-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200 dark:border-border-dark">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.financialReport.title}</h1>
            <p className="text-slate-500 dark:text-text-secondary mt-1">{t.financialReport.subtitle}</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-border-dark transition-colors">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              This Month
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: t.financialReport.cardRevenue, value: `$${totalRevenue.toLocaleString()}`, trend: '+12%', trendUp: true,
              sub: t.financialReport.vsLastMonth, icon: 'payments', iconColor: 'text-primary',
            },
            {
              label: t.financialReport.cardPending, value: `$${totalPending.toLocaleString()}`, trend: '-5%', trendUp: false,
              sub: `${mockPayments.filter(p => p.status === 'pending').length} {t.financialReport.invoicesPending}`, icon: 'pending_actions', iconColor: 'text-orange-500',
            },
            {
              label: 'Overdue', value: `$${totalOverdue.toLocaleString()}`, trend: '+2%', trendUp: true,
              sub: t.financialReport.requiresAttention, icon: 'warning', iconColor: 'text-red-500',
            },
          ].map(card => (
            <div key={card.label} className="relative flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className={`material-symbols-outlined text-6xl ${card.iconColor}`}>{card.icon}</span>
              </div>
              <div className="flex justify-between items-start z-10">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
                <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded ${card.trendUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
                  <span className="material-symbols-outlined text-[14px] mr-0.5">{card.trendUp ? 'trending_up' : 'trending_down'}</span>
                  {card.trend}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white z-10">{card.value}</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm z-10">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* {t.financialReport.revByCategory} */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue by Category</h3>
              <p className="text-sm text-slate-500 dark:text-text-secondary">Total: ${TOTAL_REVENUE.toLocaleString()}</p>
            </div>
            {/* Bar chart */}
            <div className="flex flex-col h-64 pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex-1 flex items-end gap-4 px-2">
                {REVENUE_CATEGORIES.map(cat => (
                  <div key={cat.label} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer" style={{ height: '100%', justifyContent: 'flex-end' }}>
                    <div className="relative w-full flex flex-col justify-end" style={{ height: '100%' }}>
                      <div
                        className={`w-full ${cat.color} rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity`}
                        style={{ height: `${cat.pct}%` }}
                      />
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ${cat.value.toLocaleString()}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center leading-tight">{cat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3">
              {REVENUE_CATEGORIES.map(cat => (
                <div key={cat.label} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                  {cat.label}: ${cat.value.toLocaleString()}
                </div>
              ))}
            </div>
          </div>

          {/* {t.financialReport.paymentStatus} Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Payment Status</h3>
            <div className="flex-1 flex flex-col justify-center gap-5">
              {[
                { label: 'Paid', pct: 91, value: totalRevenue, color: 'bg-emerald-500' },
                { label: 'Pending', pct: 7, value: totalPending, color: 'bg-orange-400' },
                { label: 'Overdue', pct: 2, value: totalOverdue, color: 'bg-rose-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.label} ({item.pct}%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">${item.value.toLocaleString()}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t.financialReport.insuranceNote}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.financialReport.recentTransactions}</h3>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">filter_list</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="h-9 pr-8 pl-3 text-sm bg-slate-50 dark:bg-border-dark border-0 rounded-lg text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="all">{t.financialReport.allStatuses}</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {filteredPayments.map(pay => {
                  const pt = getPatient(pay.patientId);
                  return (
                    <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                            {pt ? `${pt.firstName[0]}${pt.lastName[0]}` : '?'}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {pt ? `${pt.firstName} ${pt.lastName}` : pay.patientId}
                            </p>
                            <p className="text-xs text-slate-400">{pay.patientId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-700 dark:text-slate-300 max-w-[200px] truncate">{pay.description}</td>
                      <td className="px-4 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{pay.date}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">${pay.amount.toFixed(2)}</td>
                      <td className="px-4 py-4 text-slate-500 dark:text-slate-400 capitalize">{pay.method}</td>
                      <td className="px-4 py-4">
                        <Badge variant={getStatusBadge(pay.status)}>{pay.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {pay.status === 'paid' ? (
                          <button className="text-xs font-semibold h-8 px-3 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors">
                            Receipt
                          </button>
                        ) : (
                          <button className="text-xs font-semibold h-8 px-3 rounded bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20">
                            {pay.status === 'overdue' ? t.financialReport.resendInvoice : t.financialReport.issueInvoice}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredPayments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="material-symbols-outlined text-4xl text-slate-300">receipt_long</span>
              <p className="text-slate-400 text-sm">{t.financialReport.noTransactions}</p>
            </div>
          )}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <p className="text-xs text-slate-400">{filteredPayments.length} {t.financialReport.transactionCount}</p>
            <Link to="/billing" className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1">
              {t.financialReport.viewAllBilling} <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
