'use client';

import React, { useState } from 'react';
import { Expense } from '@/domain/entities/Expense';
import { getCategoryEmoji } from '@/utils/categoryHelpers';
import { MoreVertical, Edit2, Trash2, Repeat, Calendar } from 'lucide-react';

interface GastoItemCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export const GastoItemCard: React.FC<GastoItemCardProps> = ({ expense, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const emoji = getCategoryEmoji(expense.categoryName);

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
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-slate-700 transition-all duration-200 relative group flex flex-col justify-between space-y-3">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shrink-0 shadow-inner">
            {emoji}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-100 truncate">{expense.categoryName}</h4>
            <p className="text-xs text-slate-400 truncate">
              {expense.description && expense.description !== expense.categoryName
                ? expense.description
                : 'Sin nota adicional'}
            </p>
          </div>
        </div>

        {/* Action Menu (Three dots / buttons) */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors touch-target"
            aria-label="Opciones de gasto"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 z-20 w-36 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 shadow-2xl space-y-1">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(expense);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:bg-slate-900 transition-colors touch-target"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(expense);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors touch-target"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Amount & Frequency Row */}
      <div className="flex items-end justify-between pt-2 border-t border-slate-800/60 gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(expense.date)}</span>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
              expense.isRecurring
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {expense.isRecurring ? (
              <>
                <Repeat className="w-3 h-3" /> {expense.frequencyName || 'Recurrente'}
              </>
            ) : (
              'Una sola vez'
            )}
          </span>
        </div>

        <div className="text-right">
          <span className="text-lg sm:text-xl font-extrabold text-rose-400 tracking-tight">
            -{formatCurrency(expense.amount)}
          </span>
        </div>
      </div>
    </div>
  );
};
