import { eachMonthOfInterval, endOfYear, format, isSameMonth, startOfYear } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Transaction } from '../types';
import { formatCompactCurrency } from '../utils/format';

interface Props {
    transactions: Transaction[];
    year: Date;
    onMonthSelect: (date: Date) => void;
    loading?: boolean;
}

const YearView = ({ transactions, year, onMonthSelect, loading }: Props) => {
    const yearStart = startOfYear(year);
    const yearEnd = endOfYear(year);
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    const monthlyTotals = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, tx) => {
        const dateKey = format(new Date(tx.date), 'yyyy-MM');
        if (!acc[dateKey]) {
            acc[dateKey] = { income: 0, expense: 0 };
        }
        const amount = Number(tx.amount);
        if (tx.category.type === 'INCOME') {
            acc[dateKey].income += amount;
        } else {
            acc[dateKey].expense += amount;
        }
        return acc;
    }, {});

    return (
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-sm">
            <header className="mb-6">
                <p className="text-sm font-medium text-slate-500">Yıllık Genel Bakış</p>
                <h2 className="text-xl font-semibold text-slate-900">{format(year, 'yyyy')}</h2>
                <p className="text-sm text-slate-500">Aylık detayları görmek için bir ay seçin.</p>
            </header>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {months.map((month) => {
                    const key = format(month, 'yyyy-MM');
                    const totals = monthlyTotals[key];
                    const net = totals ? totals.income - totals.expense : 0;
                    const hasData = Boolean(totals);
                    const isCurrentMonth = isSameMonth(month, new Date());

                    return (
                        <button
                            key={key}
                            onClick={() => onMonthSelect(month)}
                            className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition hover:border-slate-300 hover:bg-slate-50 ${isCurrentMonth ? 'border-brand-primary/20 bg-brand-primary/5' : 'border-slate-100 bg-white'
                                } ${loading ? 'animate-pulse' : ''}`}
                        >
                            <span className="mb-2 text-sm font-semibold capitalize text-slate-700">
                                {format(month, 'MMMM', { locale: tr })}
                            </span>

                            {hasData ? (
                                <div className="space-y-1 text-xs">
                                    <div className={`font-medium ${net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {net >= 0 ? '+' : '-'}{formatCompactCurrency(Math.abs(net))}
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                        {formatCompactCurrency(totals.income)} / {formatCompactCurrency(totals.expense)}
                                    </div>
                                </div>
                            ) : (
                                <span className="text-xs text-slate-400">-</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default YearView;
