import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import { mockRevenueData, mockTreatmentDistribution, mockPayments } from '../data/mockData';
import { useLang } from '../context/LanguageContext';

export default function ReportsPage() {
  const { t } = useLang();
  const totalRevenue = mockRevenueData.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = mockRevenueData.reduce((s, d) => s + d.expenses, 0);
  const totalPatients = mockRevenueData.reduce((s, d) => s + d.patients, 0);
  const netProfit = totalRevenue - totalExpenses;

  const overduePayments = mockPayments.filter(p => p.status === 'overdue');
  const overdueTotal = overduePayments.reduce((s, p) => s + (p.amount - p.paidAmount), 0);

  return (
    <Layout>
      <Topbar
        title="Reports & Analytics"
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/reports/financial"
              className="flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              Financial Report
            </Link>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export
            </button>
          </div>
        }
      />

      <div className="p-4 md:p-6 flex flex-col gap-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t.reports.statRevenue}
            value={`$${(totalRevenue / 1000).toFixed(1)}k`}
            icon="trending_up"
            iconBg="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            trend="+14%"
            trendUp
          />
          <StatCard
            title={t.reports.statProfit}
            value={`$${(netProfit / 1000).toFixed(1)}k`}
            icon="account_balance"
            iconBg="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            trend="+8%"
            trendUp
          />
          <StatCard
            title={t.reports.statPatients}
            value={totalPatients}
            icon="group"
            iconBg="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            trend="+22%"
            trendUp
          />
          <StatCard
            title={t.reports.statOverdue}
            value={`$${overdueTotal.toFixed(0)}`}
            icon="warning"
            iconBg="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            subtitle={`${overduePayments.length} patients`}
          />
        </div>

        {/* Revenue & Expense Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.reports.chartRevExp}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockRevenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2b7cee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2b7cee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
                formatter={(val: unknown) => [`$${Number(val).toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2b7cee" strokeWidth={2} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patients per Month */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.reports.chartPatients}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockRevenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
                />
                <Bar dataKey="patients" name="Patients" fill="#2b7cee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* {t.reports.chartTreatments} */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Treatment Distribution</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={mockTreatmentDistribution}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {mockTreatmentDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
                    formatter={(val: unknown) => [`${val}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1">
                {mockTreatmentDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.reports.recentPayments}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  {['Patient', 'Description', 'Amount', 'Paid', 'Method', 'Date', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockPayments.map((pay) => (
                  <tr key={pay.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-slate-900 dark:text-white">{pay.patientName}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">{pay.description}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white">${pay.amount.toFixed(2)}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">${pay.paidAmount.toFixed(2)}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400 capitalize">{pay.method}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">{pay.date}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        pay.status === 'paid' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        pay.status === 'overdue' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        pay.status === 'partial' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
