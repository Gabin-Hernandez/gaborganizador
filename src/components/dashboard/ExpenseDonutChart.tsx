'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryExpenseBreakdown } from '@/domain/services/FinancialCalculator';
import { Card } from '@/components/ui/Card';
import { PieChart as PieIcon } from 'lucide-react';

interface ExpenseDonutChartProps {
  categoryBreakdown: CategoryExpenseBreakdown[];
}

const COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // rose
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#64748b'  // slate
];

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({ categoryBreakdown }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasExpenses = categoryBreakdown && categoryBreakdown.length > 0 && categoryBreakdown.some(c => c.amount > 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  const chartData = categoryBreakdown.map((item, idx) => ({
    name: item.categoryName,
    value: item.amount,
    percentage: item.percentage,
    color: COLORS[idx % COLORS.length]
  }));

  return (
    <Card className="flex flex-col h-full min-h-[350px]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Distribución de Gastos</h3>
            <p className="text-xs text-slate-400">Porcentaje por categoría en el periodo</p>
          </div>
        </div>
      </div>

      {!isMounted ? (
        <div className="flex-1 flex items-center justify-center p-6 text-slate-500 text-xs">
          Cargando gráfica...
        </div>
      ) : !hasExpenses ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-3 text-slate-400">
            <PieIcon className="w-6 h-6 stroke-[1.5]" />
          </div>
          <p className="text-sm font-semibold text-slate-300 mb-1">Aún no tienes gastos registrados</p>
          <p className="text-xs max-w-xs">Registra tus primeros movimientos para visualizar el gráfico por categorías.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="w-full h-[220px] sm:h-[260px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
                          <p className="font-bold text-slate-100 mb-1">{data.name}</p>
                          <p className="text-emerald-400 font-semibold">{formatCurrency(data.value)}</p>
                          <p className="text-slate-400 font-medium">{data.percentage.toFixed(1)}% del total</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Clean Categorical Breakdown List for Mobile & Desktop */}
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            {chartData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-200 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-bold">
                    <span className="text-slate-300">{formatCurrency(item.value)}</span>
                    <span className="text-slate-400 text-[11px] font-normal">({item.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
