import { useState } from 'react';
import { Plus } from 'lucide-react';
import TransactionsTable from '../components/TransactionsTable';
import useDashboardData from '../hooks/useDashboardData';
import TransactionModal from '../components/TransactionModal';

const TransactionsPage = () => {
  const { transactions, categories, loading, refresh, deleteTransaction, deleteTransactions } = useDashboardData('month');
  const [open, setOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  return (
    <div className="relative space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">İşlemler listesi</p>
          <h1 className="text-3xl font-bold text-slate-900">İşlemler</h1>
        </div>
        <button
          onClick={() => setIsSelectionMode(!isSelectionMode)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${isSelectionMode
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            : 'bg-white text-rose-600 shadow-sm ring-1 ring-slate-200 hover:bg-rose-50 hover:ring-rose-200'
            }`}
        >
          {isSelectionMode ? 'Vazgeç' : 'Toplu Sil'}
        </button>
      </header>

      <TransactionsTable
        transactions={transactions}
        loading={loading}
        onDelete={async (id) => {
          if (window.confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
            await deleteTransaction(id);
          }
        }}
        onBulkDelete={isSelectionMode ? deleteTransactions : undefined}
      />

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-10 inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 font-semibold text-white shadow-2xl transition hover:bg-brand-secondary"
      >
        <Plus size={18} /> Yeni İşlem
      </button>

      <TransactionModal
        open={open}
        onClose={() => setOpen(false)}
        categories={categories}
        onSuccess={refresh}
      />
    </div>
  );
};

export default TransactionsPage;
