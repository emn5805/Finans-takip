import clsx from 'clsx';
import { Timeframe } from '../hooks/useDashboardData';

const labels: Record<Timeframe, string> = {
  week: 'Bu Hafta',
  month: 'Bu Ay',
  year: 'Bu Yıl',
};

interface Props {
  value: Timeframe;
  onChange: (value: Timeframe) => void;
}

const TimeframeTabs = ({ value, onChange }: Props) => {
  return (
    <div className="flex rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold text-slate-500">
      {(Object.keys(labels) as Timeframe[]).map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={clsx(
            'rounded-full px-4 py-1.5 transition',
            value === option ? 'bg-slate-900 text-white shadow' : 'hover:text-slate-900',
          )}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
};

export default TimeframeTabs;
