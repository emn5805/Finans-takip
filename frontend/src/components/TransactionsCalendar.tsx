import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { Transaction } from '../types';
import { formatCompactCurrency } from '../utils/format';
import { Timeframe, timeframeToDates } from '../hooks/useDashboardData';

interface Props {
  transactions: Transaction[];
  timeframe: Timeframe;
  currentDate?: Date;
  loading?: boolean;
  showHeader?: boolean;
  title?: string;
  description?: string;
}

const weekdayLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const toNumber = (value: number | string): number => (typeof value === 'number' ? value : Number(value));

const TransactionsCalendar = ({ transactions, timeframe, currentDate, loading, showHeader = true, title, description }: Props) => {
  const { startDate } = timeframeToDates(timeframe, currentDate);
  const referenceDate = startDate ? new Date(startDate) : (currentDate || new Date());

  // Calculate month start for display purposes
  const monthStart = startOfMonth(referenceDate);

  // For week view, show only the current week (7 days)
  // For month/year view, show the full month calendar
  let calendarStart: Date;
  let calendarEnd: Date;

  if (timeframe === 'week') {
    calendarStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
    calendarEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });
  } else {
    const monthEnd = endOfMonth(monthStart);
    calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  }

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const dailyTotals = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, tx) => {
    const dateKey = format(new Date(tx.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = { income: 0, expense: 0 };
    }
    const amount = toNumber(tx.amount);
    if (tx.category.type === 'INCOME') {
      acc[dateKey].income += amount;
    } else {
      acc[dateKey].expense += amount;
    }
    return acc;
  }, {});

  const monthLabel = new Intl.DateTimeFormat('tr-TR', {
    month: 'long',
    year: 'numeric',
  }).format(monthStart);
  const headerTitle = title ?? 'Gelir / Gider Takvimi';
  const headerDescription = description ?? 'Hızlıca hangi gün ne kadar harcama veya gelir olduğunu görün.';

  return (
    <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-sm">
      {showHeader && (
        <header className="mb-4">
          <p className="text-sm font-medium text-slate-500">{headerTitle}</p>
          <h2 className="text-xl font-semibold capitalize text-slate-900">{monthLabel}</h2>
          <p className="text-sm text-slate-500">{headerDescription}</p>
        </header>
      )}

      <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold uppercase text-slate-400">
        {weekdayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const totals = dailyTotals[key];
          const net = totals ? totals.income - totals.expense : 0;
          const isCurrentMonth = isSameMonth(day, monthStart);
          const today = isSameDay(day, new Date());
          const hasIncome = Boolean(totals && totals.income > 0);
          const hasExpense = Boolean(totals && totals.expense > 0);
          const hasData = hasIncome || hasExpense;

          const badgeColor = net >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600';

          return (
            <div
              key={key}
              className={`flex min-h-[60px] flex-col justify-between rounded-xl border p-1 text-[10px] transition sm:min-h-[80px] sm:rounded-2xl sm:p-2 sm:text-xs ${isCurrentMonth ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-50'
                } ${loading ? 'animate-pulse' : ''}`}
            >
              <div className="mb-0.5 flex items-center justify-between font-semibold text-slate-500 sm:mb-1">
                <span className={`${today ? 'text-brand-primary' : ''}`}>{format(day, 'd')}</span>
                {hasData && (
                  <span className={`hidden rounded-full px-1.5 py-0.5 text-[9px] sm:inline-block sm:px-2 sm:text-[10px] ${badgeColor}`}>
                    {`${net >= 0 ? '+' : '-'}${formatCompactCurrency(Math.abs(net)).replace('₺', '')}`}
                  </span>
                )}
              </div>
              {hasData && (
                <div className="flex flex-col gap-0.5">
                  {/* Mobile View: Show only dots or small summary */}
                  <div className="flex gap-1 sm:hidden">
                    {hasIncome && <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                    {hasExpense && <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />}
                  </div>

                  {/* Desktop View: Show details */}
                  <div className="hidden space-y-0.5 sm:block">
                    {hasIncome && (
                      <div className="flex items-center justify-between text-emerald-600">
                        <span>Gelir</span>
                        <span>{formatCompactCurrency(totals!.income).replace('₺', '')}</span>
                      </div>
                    )}
                    {hasExpense && (
                      <div className="flex items-center justify-between text-rose-600">
                        <span>Gider</span>
                        <span>{formatCompactCurrency(totals!.expense).replace('₺', '')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionsCalendar;
