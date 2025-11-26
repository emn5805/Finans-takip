import { useState } from 'react';
import { RefreshCcw, AlertCircle, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

import useDashboardData, { Timeframe } from '../hooks/useDashboardData';
import { formatCurrency } from '../utils/format';
import TimeframeTabs from '../components/TimeframeTabs';
import SummaryCard from '../components/SummaryCard';
import TransactionsTable from '../components/TransactionsTable';
import SpendingDonutChart from '../components/SpendingDonutChart';
import IncomeExpenseTrend from '../components/IncomeExpenseTrend';

const DashboardPage = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const { summary, categories, transactions, loading, error, refresh, monthlyStats, deleteTransaction } = useDashboardData(timeframe);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Finans durumunun genel özeti</p>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
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

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Toplam Bakiye"
          value={formatCurrency(summary.balance)}
          trend="+2.5%"
          colorClass="text-brand-primary"
          loading={loading}
          icon={Wallet}
        />
        <SummaryCard
          label="Gelir"
          value={formatCurrency(summary.totalIncome)}
          trend="+12%"
          colorClass="text-emerald-500"
          loading={loading}
          icon={ArrowUpRight}
        />
        <SummaryCard
          label="Gider"
          value={formatCurrency(summary.totalExpense)}
          trend="-4%"
          colorClass="text-rose-500"
          loading={loading}
          icon={ArrowDownRight}
        />
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Gelir & Gider Akışı</p>
              <h2 className="text-xl font-semibold text-slate-900">
                {timeframe === 'year' ? 'Yıllık Trend (Aylık)' : timeframe === 'month' ? 'Aylık Trend (Günlük)' : 'Haftalık Trend'}
              </h2>
            </div>
          </header>
          <IncomeExpenseTrend transactions={transactions} monthlyStats={monthlyStats} loading={loading} />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Aylık Harcama Dağılımı</p>
              <h2 className="text-xl font-semibold text-slate-900">Toplam Harcama {formatCurrency(summary.totalExpense)}</h2>
            </div>
          </header>
          <SpendingDonutChart categories={categories} transactions={transactions} loading={loading} />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Son İşlemler</h2>
        </header>
        <TransactionsTable transactions={transactions} loading={loading} onDelete={deleteTransaction} />
      </section>
    </div>
  );
};

export default DashboardPage;
