'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthSelectorProps {
  selectedPeriod: string; // YYYY-MM
  onChange: (period: string) => void;
}

export function formatPeriodLabel(periodStr: string): string {
  if (!periodStr || !periodStr.includes('-')) return periodStr;
  try {
    const [year, month] = periodStr.split('-').map((n) => parseInt(n, 10));
    const date = new Date(year, month - 1, 1);
    const monthName = date.toLocaleDateString('es-MX', { month: 'long' });
    const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${capitalized} ${year}`;
  } catch {
    return periodStr;
  }
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedPeriod, onChange }) => {
  const [yearStr, monthStr] = selectedPeriod.split('-');
  const year = parseInt(yearStr, 10) || new Date().getFullYear();
  const month = parseInt(monthStr, 10) || new Date().getMonth() + 1;

  const handlePrev = () => {
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    const formatted = `${newYear}-${String(newMonth).padStart(2, '0')}`;
    onChange(formatted);
  };

  const handleNext = () => {
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    const formatted = `${newYear}-${String(newMonth).padStart(2, '0')}`;
    onChange(formatted);
  };

  // Generate list of 12 previous months and 6 future months for dropdown selector
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    for (let y = currentYear - 2; y <= currentYear + 1; y++) {
      for (let m = 1; m <= 12; m++) {
        const val = `${y}-${String(m).padStart(2, '0')}`;
        options.push({
          value: val,
          label: formatPeriodLabel(val)
        });
      }
    }
    return options;
  };

  return (
    <div className="inline-flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
      <button
        onClick={handlePrev}
        className="w-8 h-8 rounded-xl bg-slate-950 text-slate-400 hover:text-slate-100 hover:bg-slate-800 flex items-center justify-center transition-colors touch-target shrink-0"
        aria-label="Mes anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="relative flex items-center px-2">
        <Calendar className="w-3.5 h-3.5 text-emerald-400 mr-2 pointer-events-none" />
        <select
          value={selectedPeriod}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent font-bold text-slate-100 text-xs sm:text-sm focus:outline-none cursor-pointer pr-1 py-1"
        >
          {generateMonthOptions().map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100 font-medium">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleNext}
        className="w-8 h-8 rounded-xl bg-slate-950 text-slate-400 hover:text-slate-100 hover:bg-slate-800 flex items-center justify-center transition-colors touch-target shrink-0"
        aria-label="Mes siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
