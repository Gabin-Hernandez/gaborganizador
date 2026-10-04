'use client';

import React from 'react';
import { FinancialActivityItem } from '@/domain/entities/Activity';
import { Card } from '@/components/ui/Card';
import { Clock, ArrowDownLeft, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface ActivityListProps {
  activities: FinancialActivityItem[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Últimos 10 días de actividad</h3>
            <p className="text-xs text-slate-400">Movimientos financieros recientes del usuario</p>
          </div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          <p className="text-sm font-semibold text-slate-400 mb-1">Sin actividad registrada en los últimos 10 días</p>
          <p className="text-xs text-slate-500">Tus movimientos recientes de gastos, ingresos o inversión aparecerán aquí.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card List (< md) */}
          <div className="block md:hidden space-y-3">
            {activities.map((item) => {
              const isExpense = item.type === 'EXPENSE';
              const isIncome = item.type === 'EXTRA_INCOME';
              const isInvest = item.type === 'INVESTMENT';

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isExpense
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : isIncome
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                      }`}
                    >
                      {isExpense && <ArrowDownLeft className="w-5 h-5" />}
                      {isIncome && <ArrowUpRight className="w-5 h-5" />}
                      {isInvest && <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-100 truncate">{item.categoryOrConcept}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {item.description || item.title || formatDate(item.date)} · <span className="text-[11px]">{formatDate(item.date)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-extrabold tracking-tight ${
                        isExpense ? 'text-rose-400' : isIncome ? 'text-emerald-400' : 'text-teal-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'}{formatCurrency(item.amount)}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                        isExpense
                          ? 'bg-rose-500/10 text-rose-400'
                          : isIncome
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-teal-500/10 text-teal-400'
                      }`}
                    >
                      {isExpense ? 'Gasto' : isIncome ? 'Ingreso' : 'Inversión'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table (hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl font-semibold">Fecha</th>
                  <th className="py-3 px-4 font-semibold">Tipo</th>
                  <th className="py-3 px-4 font-semibold">Categoría / Concepto</th>
                  <th className="py-3 px-4 font-semibold">Descripción</th>
                  <th className="py-3 px-4 rounded-r-xl text-right font-semibold">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activities.map((item) => {
                  const isExpense = item.type === 'EXPENSE';
                  const isIncome = item.type === 'EXTRA_INCOME';
                  const isInvest = item.type === 'INVESTMENT';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-400 whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isExpense && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <ArrowDownLeft className="w-3.5 h-3.5" /> Gasto
                          </span>
                        )}
                        {isIncome && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Ingreso
                          </span>
                        )}
                        {isInvest && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <ShieldCheck className="w-3.5 h-3.5" /> Inversión
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {item.categoryOrConcept}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {item.description || item.title || '-'}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${
                        isExpense ? 'text-rose-400' : isIncome ? 'text-emerald-400' : 'text-teal-400'
                      }`}>
                        {isExpense ? '-' : '+'}{formatCurrency(item.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
};
