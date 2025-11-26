import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { Category, Transaction } from '../types';
import { formatCurrency } from '../utils/format';

const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
];

interface Props {
  categories: Category[];
  transactions: Transaction[];
  loading?: boolean;
}

const SpendingDonutChart = ({ categories, transactions, loading }: Props) => {
  const expenseTotals = categories
    .filter((cat) => cat.type === 'EXPENSE')
    .map((cat) => ({
      name: cat.name,
      value: transactions
        .filter((tx) => tx.categoryId === cat.id)
        .reduce((sum, tx) => sum + Number(tx.amount), 0),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value); // Sort by value desc

  const total = expenseTotals.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-400">Yükleniyor...</div>;
  }

  if (expenseTotals.length === 0) {
    return <div className="flex h-64 items-center justify-center text-slate-400">Harcama verisi yok</div>;
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
      <div className="relative h-64 w-full lg:w-1/2">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={expenseTotals}
              innerRadius={85}
              outerRadius={100}
              paddingAngle={2}
              cornerRadius={4}
              isAnimationActive={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 15; // Push label slightly outside
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                if (percent < 0.05) return null;

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#64748b"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize={11}
                    fontWeight="600"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
              labelLine={false}
            >
              {expenseTotals.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Centered Total Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm font-medium text-slate-400">Toplam</span>
          <span className="text-xl font-bold text-slate-800">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4">
        {expenseTotals.map((item, index) => (
          <div key={item.name} className="group flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-opacity-10"
                style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                <span className="text-xs text-slate-400">{((item.value / total) * 100).toFixed(1)}%</span>
              </div>
            </div>
            <span className="font-semibold text-slate-900">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingDonutChart;
