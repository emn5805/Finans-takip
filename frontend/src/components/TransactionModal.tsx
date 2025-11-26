import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import api from '../lib/api';
import { Category } from '../types';
import CurrencyInput from './CurrencyInput';

type TransactionType = 'INCOME' | 'EXPENSE';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: () => void;
}

const TransactionModal = ({ open, onClose, categories, onSuccess }: TransactionModalProps) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [recurring, setRecurring] = useState('NEVER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setType('EXPENSE');
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
      setCategoryId('');
      setDescription('');
      setRecurring('NEVER');
      setError(null);
    }
  }, [open]);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/transactions', {
        amount: Number(amount),
        date,
        categoryId,
        description,
        recurring,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İşlem kaydedilemedi');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Yeni İşlem</p>
            <h2 className="text-2xl font-semibold text-slate-900">Gelir / Gider</h2>
          </div>
          <button onClick={onClose} className="text-sm font-semibold text-slate-400 hover:text-slate-600">
            Kapat
          </button>
        </div>

        <div className="mb-4 flex rounded-full border border-slate-200 p-1 text-sm font-semibold text-slate-500">
          {(['EXPENSE', 'INCOME'] as TransactionType[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`flex-1 rounded-full py-2 transition ${type === option ? 'bg-slate-900 text-white' : ''}`}
              onClick={() => setType(option)}
            >
              {option === 'EXPENSE' ? 'Gider' : 'Gelir'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">




            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Tutar</label>
              <CurrencyInput
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 focus:border-brand-primary focus:outline-none"
                value={amount}
                onChange={(val) => setAmount(val)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Tarih</label>
              <input
                type="date"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 focus:border-brand-primary focus:outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Kategori</label>
            <select
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 focus:border-brand-primary focus:outline-none"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Kategori seçin</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Açıklama</label>
            <input
              type="text"
              maxLength={140}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 focus:border-brand-primary focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Yinelenen İşlem</label>
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 focus:border-brand-primary focus:outline-none"
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
            >
              <option value="NEVER">Hiçbir zaman</option>
              <option value="DAILY">Günlük</option>
              <option value="WEEKLY">Haftalık</option>
              <option value="MONTHLY">Aylık</option>
              <option value="YEARLY">Yıllık</option>
            </select>
          </div>

          {error && <p className="rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-500"
              onClick={onClose}
              disabled={loading}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading || !categoryId || !amount}
              className="rounded-2xl bg-brand-primary px-6 py-2 font-semibold text-white shadow hover:bg-brand-secondary disabled:opacity-60"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default TransactionModal;
