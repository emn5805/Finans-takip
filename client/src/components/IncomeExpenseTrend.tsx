import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { Transaction } from '../types';
import { formatDateLabel } from '../utils/format';
import { extendTransactions } from '../hooks/useDashboardData';

interface Props {
  transactions: Transaction[];
  monthlyStats?: { name: string; income: number; expense: number }[];
  loading?: boolean;
}

const IncomeExpenseTrend = ({ transactions, monthlyStats, loading }: Props) => {
  const data = monthlyStats || extendTransactions(transactions).map((tx) => ({
    name: formatDateLabel(tx.date),
    income: tx.category.type === 'INCOME' ? tx.amount : 0,
    expense: tx.category.type === 'EXPENSE' ? tx.amount : 0,
  }));

  return (
    <div className="h-72">
      {loading ? (
        <div className="flex h-full items-center justify-center text-slate-400">Yükleniyor...</div>
      ) : (
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`${value.toLocaleString('tr-TR')} ₺`]}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIncome)"
              name="Gelir"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#f43f5e"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExpense)"
              name="Gider"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default IncomeExpenseTrend;
