import { useState } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

import useDashboardData, { Timeframe } from '../hooks/useDashboardData';
import TimeframeTabs from '../components/TimeframeTabs';
import TransactionsCalendar from '../components/TransactionsCalendar';
import YearView from '../components/YearView';

const CalendarPage = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { transactions, loading, error, refresh } = useDashboardData(timeframe, currentDate);

  const handleMonthSelect = (date: Date) => {
    setCurrentDate(date);
    setTimeframe('month');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Gün bazlı gelir / gider görünümü</p>
          <h1 className="text-3xl font-bold text-slate-900">Takvim</h1>
        </div>
        <div className="flex items-center gap-3">
          <TimeframeTabs value={timeframe} onChange={setTimeframe} />
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 transition hover:border-slate-300"
          >
            <RefreshCcw size={16} /> Yenile
          </button>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {timeframe === 'year' ? (
        <YearView
          transactions={transactions}
          year={currentDate}
          onMonthSelect={handleMonthSelect}
          loading={loading}
        />
      ) : (
        <div className="overflow-hidden">
          <TransactionsCalendar
            transactions={transactions}
            timeframe={timeframe}
            currentDate={currentDate}
            loading={loading}
            title="Kapsam"
            description="Seçilen dönemde hangi gün gelir veya gider oluştuğunu görüntüleyin."
          />
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
