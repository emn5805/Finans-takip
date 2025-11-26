import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Trash2, CheckSquare, Square } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const TransactionsTable = ({ transactions, loading, onDelete, onBulkDelete }: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!onBulkDelete) {
      setSelectedIds([]);
    }
  }, [onBulkDelete]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === transactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transactions.map((tx) => tx.id));
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      if (confirm(`${selectedIds.length} adet işlemi silmek istediğinize emin misiniz?`)) {
        onBulkDelete(selectedIds);
        setSelectedIds([]);
      }
    }
  };

  return (
    <div className="space-y-3">
      {onBulkDelete && transactions.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            {selectedIds.length === transactions.length ? (
              <CheckSquare size={18} className="text-brand-primary" />
            ) : (
              <Square size={18} />
            )}
            Tümünü Seç
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
            >
              <Trash2 size={16} />
              Seçilenleri Sil ({selectedIds.length})
            </button>
          )}
        </div>
      )}

      {transactions.slice(0, 5).map((tx) => {
        const isSelected = selectedIds.includes(tx.id);
        return (
          <div
            key={tx.id}
            className={`group flex items-center justify-between rounded-2xl border px-4 py-3 transition hover:shadow-sm ${isSelected ? 'border-brand-primary bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
          >
            <div className="flex items-center gap-3">
              {onBulkDelete && (
                <button onClick={() => toggleSelect(tx.id)} className="text-slate-400 hover:text-brand-primary">
                  {isSelected ? <CheckSquare size={20} className="text-brand-primary" /> : <Square size={20} />}
                </button>
              )}
              <span
                className={`h-10 w-1 rounded-full ${tx.category.type === 'INCOME' ? 'bg-emerald-400' : 'bg-rose-400'}`}
              />
              <div>
                <p className="font-semibold text-slate-800">{tx.description || tx.category.name}</p>
                <p className="text-sm text-slate-500">{format(new Date(tx.date), 'dd MMM yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={`font-semibold ${tx.category.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {loading ? '...' : `${tx.category.type === 'INCOME' ? '+' : '-'}${formatCurrency(tx.amount).replace('₺', '')}`}
                </p>
                <p className="text-sm text-slate-500">{tx.category.name}</p>
              </div>
              {onDelete && !onBulkDelete && (
                <button
                  onClick={() => onDelete(tx.id)}
                  className="rounded-full p-2 text-slate-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                  title="İşlemi Sil"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionsTable;
