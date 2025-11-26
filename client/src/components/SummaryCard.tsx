import clsx from 'clsx';

import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  trend: string;
  colorClass?: string;
  loading?: boolean;
  icon?: LucideIcon;
}

const SummaryCard = ({ label, value, trend, colorClass = 'text-emerald-500', loading, icon: Icon }: Props) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-slate-900">{loading ? '...' : value}</p>
          <p className={clsx('mt-2 text-sm font-semibold', colorClass)}>{trend}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
