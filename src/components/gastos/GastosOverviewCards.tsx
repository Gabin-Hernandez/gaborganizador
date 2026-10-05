'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Expense } from '@/domain/entities/Expense';
import { TrendingDown, Repeat, Hash, Tag } from 'lucide-react';
import { formatPeriodLabel } from '@/components/ui/MonthSelector';

interface GastosOverviewCardsProps {
  expenses: Expense[]; // Expenses filtered strictly for the selected period
  selectedPeriod: string; // YYYY-MM
}

export const GastosOverviewCards: React.FC<GastosOverviewCardsProps> = ({ expenses, selectedPeriod }) => {
  const periodLabel = formatPeriodLabel(selectedPeriod);

  // Total del mes
  const monthTotal = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);

  // Gastos recurrentes del mes
  const recurringExpenses = expenses.filter((e) => e.isRecurring);
  const recurringTotal = recurringExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

  // Categoría principal del mes
  const categorySums: Record<string, number> = {};
  expenses.forEach((e) => {
    categorySums[e.categoryName] = (categorySums[e.categoryName] || 0) + e.amount;
  });

  let topCategoryName = 'Sin movimientos';
  let topCategoryAmount = 0;

  Object.entries(categorySums).forEach(([cat, sum]) => {
    if (sum > topCategoryAmount) {
      topCategoryAmount = sum;
      topCategoryName = cat;
    }
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const cards = [
    {
      title: `Total ${periodLabel}`,
      amount: formatCurrency(monthTotal),
      subtext: `Monto acumulado en ${periodLabel}`,
      icon: TrendingDown,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Gastos recurrentes',
      amount: formatCurrency(recurringTotal),
      subtext: `${recurringExpenses.length} ocurrencias en el periodo`,
      icon: Repeat,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Número de movimientos',
      amount: `${expenses.length}`,
      subtext: `Registros financieros en ${periodLabel}`,
      icon: Hash,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'Categoría principal',
      amount: topCategoryName,
      subtext: topCategoryAmount > 0 ? formatCurrency(topCategoryAmount) : 'Sin gastos en el periodo',
      icon: Tag,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <Card key={idx} hoverEffect className="relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {c.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${c.bgColor} ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mb-1 truncate">
              {c.amount}
            </div>
            <p className="text-xs text-slate-500 font-medium truncate">{c.subtext}</p>
          </Card>
        );
      })}
    </div>
  );
};
