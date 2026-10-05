'use client';

import React, { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GastosFilterState {
  search: string;
  category: string;
  period: string; // 'ESTE_MES' | 'MES_ANTERIOR' | '30_DIAS' | 'TODOS'
  type: string; // 'TODOS' | 'UNICOS' | 'RECURRENTES'
  sort: string; // 'RECENT' | 'OLD' | 'AMOUNT_DESC' | 'AMOUNT_ASC'
}

interface GastosFilterBarProps {
  filters: GastosFilterState;
  onChange: (filters: GastosFilterState) => void;
}

export const GastosFilterBar: React.FC<GastosFilterBarProps> = ({ filters, onChange }) => {
  const { categories } = useCategories();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeCategories = categories.filter((c) => c.isActive !== false);

  const update = (patch: Partial<GastosFilterState>) => {
    onChange({ ...filters, ...patch });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'TODAS' ||
    filters.period !== 'ESTE_MES' ||
    filters.type !== 'TODOS' ||
    filters.sort !== 'RECENT';

  const resetFilters = () => {
    onChange({
      search: '',
      category: 'TODAS',
      period: 'ESTE_MES',
      type: 'TODOS',
      sort: 'RECENT'
    });
  };

  const filterControls = (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-3 flex-wrap">
      {/* Category Dropdown */}
      <div className="flex-1 min-w-[140px]">
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 sm:hidden">Categoría</label>
        <select
          value={filters.category}
          onChange={(e) => update({ category: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="TODAS">Todas las categorías</option>
          {activeCategories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Period Dropdown */}
      <div className="flex-1 min-w-[130px]">
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 sm:hidden">Periodo</label>
        <select
          value={filters.period}
          onChange={(e) => update({ period: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="ESTE_MES">Este mes</option>
          <option value="30_DIAS">Últimos 30 días</option>
          <option value="MES_ANTERIOR">Mes anterior</option>
          <option value="TODOS">Todos los periodos</option>
        </select>
      </div>

      {/* Type Dropdown */}
      <div className="flex-1 min-w-[130px]">
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 sm:hidden">Tipo</label>
        <select
          value={filters.type}
          onChange={(e) => update({ type: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="TODOS">Todos los tipos</option>
          <option value="UNICOS">Gastos únicos</option>
          <option value="RECURRENTES">Gastos recurrentes</option>
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="flex-1 min-w-[140px]">
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 sm:hidden">Ordenar por</label>
        <select
          value={filters.sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="RECENT">Más recientes</option>
          <option value="OLD">Más antiguos</option>
          <option value="AMOUNT_DESC">Mayor monto</option>
          <option value="AMOUNT_ASC">Menor monto</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-rose-400 hover:text-rose-300 py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 transition-colors w-full sm:w-auto"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por concepto o categoría..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {filters.search && (
            <button
              onClick={() => update({ search: '' })}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="sm:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 active:bg-slate-800 touch-target"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span>Filtros</span>
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
        </button>
      </div>

      {/* Desktop Filter Bar Controls */}
      <div className="hidden sm:block">{filterControls}</div>

      {/* Mobile Filter Bottom Sheet */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 sm:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative z-10 w-full bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 pb-safe space-y-4"
            >
              <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto opacity-60 mb-2" />
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-slate-100">Filtrar y Ordenar</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {filterControls}

              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 font-bold text-slate-950 text-sm active:bg-emerald-500"
              >
                Aplicar filtros
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
