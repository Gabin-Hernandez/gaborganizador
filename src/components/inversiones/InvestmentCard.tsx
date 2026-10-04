'use client';

import React from 'react';
import { useInvestment } from '@/hooks/useInvestment';
import { FinancialPeriodSummary } from '@/domain/services/FinancialCalculator';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';

interface InvestmentCardProps {
  summary: FinancialPeriodSummary;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({ summary }) => {
  const { contributions, deleteContribution } = useInvestment();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const progressPct = summary.investmentTarget > 0
    ? Math.min(100, (summary.totalInvested / summary.investmentTarget) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Target Progress Card */}
      <Card className="p-6 border-teal-500/30 bg-teal-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
              Estado de Inversión del Periodo
            </span>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-extrabold text-slate-100">
                {formatCurrency(summary.totalInvested)} / {formatCurrency(summary.investmentTarget)}
              </h3>
              {summary.investmentStatus === 'FULFILLED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="w-4 h-4" /> Cumplido
                </span>
              )}
              {summary.investmentStatus === 'PARTIAL' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Clock className="w-4 h-4" /> En progreso
                </span>
              )}
              {summary.investmentStatus === 'PENDING' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                  <AlertCircle className="w-4 h-4" /> Pendiente
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block">Porcentaje alcanzado</span>
            <span className="text-2xl font-extrabold text-teal-400">{progressPct.toFixed(0)}%</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Contributions History */}
      <Card className="p-6">
        <h4 className="text-sm font-bold text-slate-100 mb-4">Aportes a inversión registrados</h4>

        {contributions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Aún no has registrado aportes de inversión este periodo.</p>
        ) : (
          <div className="space-y-3">
            {contributions.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <p className="text-sm font-bold text-slate-200">{c.note || 'Aporte a inversión'}</p>
                  <p className="text-xs text-slate-500">{c.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-teal-400">+{formatCurrency(c.amount)}</span>
                  <button
                    onClick={() => deleteContribution(c.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
