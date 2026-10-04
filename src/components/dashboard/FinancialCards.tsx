'use client';

import React from 'react';
import { FinancialPeriodSummary } from '@/domain/services/FinancialCalculator';
import { Card } from '@/components/ui/Card';
import { DollarSign, TrendingDown, TrendingUp, Wallet, PieChart } from 'lucide-react';

interface FinancialCardsProps {
  summary: FinancialPeriodSummary;
}

export const FinancialCards: React.FC<FinancialCardsProps> = ({ summary }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const cards = [
    {
      title: 'Salario Base',
      amount: formatCurrency(summary.salary),
      subtext: 'Configuración de ingreso mensual',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Gastos del Periodo',
      amount: formatCurrency(summary.totalExpenses),
      subtext: `${summary.spentPercentage.toFixed(1)}% del salario gastado`,
      icon: TrendingDown,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Ingresos Extra',
      amount: formatCurrency(summary.totalExtraIncome),
      subtext: 'Ingresos adicionales fuera de salario',
      icon: TrendingUp,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'Disponible / Restante',
      amount: formatCurrency(summary.remainingMoney),
      subtext: summary.remainingMoney >= 0 ? 'Balance disponible estimado' : 'Excedido respecto a gastos e inversión',
      icon: Wallet,
      color: summary.remainingMoney >= 0 ? 'text-teal-400' : 'text-rose-400',
      bgColor: summary.remainingMoney >= 0 ? 'bg-teal-500/10 border-teal-500/20' : 'bg-rose-500/10 border-rose-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} hoverEffect className="relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.bgColor} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-100 tracking-tight mb-1">
              {card.amount}
            </div>
            <p className="text-xs text-slate-500 font-medium">{card.subtext}</p>
          </Card>
        );
      })}
    </div>
  );
};
