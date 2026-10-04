'use client';

import React from 'react';
import { FinancialPeriodSummary } from '@/domain/services/FinancialCalculator';
import { Card } from '@/components/ui/Card';
import { Layers, Wallet, TrendingUp, TrendingDown, ShieldCheck, Tag, DollarSign } from 'lucide-react';

interface ResumenOverviewProps {
  summary: FinancialPeriodSummary;
}

export const ResumenOverview: React.FC<ResumenOverviewProps> = ({ summary }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const chartData = summary.categoryBreakdown.map((cat, idx) => ({
    name: cat.categoryName,
    amount: cat.amount,
    percentage: cat.percentage
  }));

  return (
    <div className="space-y-8">
      {/* Top Banner: Te sobran al mes */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Métrica Financiera Clave
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Te sobran al mes</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fórmula: Salario {formatCurrency(summary.salary)} - Gastos {formatCurrency(summary.totalExpenses)} - Inversión Target {formatCurrency(summary.investmentTarget)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className={`text-3xl sm:text-4xl font-black ${summary.remainingMoney >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
              {formatCurrency(summary.remainingMoney)}
            </span>
          </div>
        </div>
      </Card>

      {/* Complete Financial Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Salario Base</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{formatCurrency(summary.salary)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Ingresos Extra</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{formatCurrency(summary.totalExtraIncome)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Ingresos Totales</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{formatCurrency(summary.totalIncome)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Gastos Totales</span>
          </div>
          <p className="text-2xl font-extrabold text-rose-400">{formatCurrency(summary.totalExpenses)}</p>
          <p className="text-xs text-slate-500 mt-1">{summary.spentPercentage.toFixed(1)}% del salario</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Inversión Destinada</span>
          </div>
          <p className="text-2xl font-extrabold text-teal-400">{formatCurrency(summary.investmentTarget)}</p>
          <p className="text-xs text-slate-500 mt-1">{summary.investmentPercentage.toFixed(1)}% del salario</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Flujo Neto de Caja</span>
          </div>
          <p className={`text-2xl font-extrabold ${summary.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(summary.netCashFlow)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Ingresos totales - gastos - aportes</p>
        </Card>
      </div>

      {/* Gastos por Categoría al mes Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">Gastos en cada categoría al mes</h3>
              <p className="text-xs text-slate-400">Desglose calculado en base a movimientos reales</p>
            </div>
          </div>
        </div>

        {summary.categoryBreakdown.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No hay registros de gastos este mes.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.categoryBreakdown.map((cat, idx) => (
              <div key={cat.categoryId || cat.categoryName || `cat-key-${idx}`} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{cat.categoryName}</h4>
                  <p className="text-xs text-slate-500">{cat.percentage.toFixed(1)}% de gastos</p>
                </div>
                <span className="text-base font-extrabold text-rose-400">
                  {formatCurrency(cat.amount)} <span className="text-[10px] text-slate-500 font-normal">/ mes</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
