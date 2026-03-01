interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBg: string;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
}

export default function StatCard({ title, value, icon, iconBg, trend, trendUp, subtitle }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        {trend && (
          <span className={`text-xs font-medium flex items-center ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            <span className="material-symbols-outlined text-[14px]">{trendUp ? 'trending_up' : 'trending_down'}</span>
            {trend}
          </span>
        )}
        {subtitle && !trend && (
          <span className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
