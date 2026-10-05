'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCategories } from '@/hooks/useCategories';
import { useFrequencies } from '@/hooks/useFrequencies';
import { Expense } from '@/domain/entities/Expense';
import { getCategoryEmoji } from '@/utils/categoryHelpers';
import { DollarSign, Search, Calendar, Repeat, ArrowRight, Check } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: {
    categoryId: string;
    categoryName: string;
    amount: number;
    description: string;
    date: string;
    isRecurring: boolean;
    frequencyName?: string;
  }) => Promise<void>;
  initialData?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const { categories } = useCategories();
  const { frequencies } = useFrequencies();

  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequencyName, setFrequencyName] = useState('Mensual');
  const [categorySearch, setCategorySearch] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeCategories = categories.filter((c) => c.isActive !== false);

  const filteredCategories = activeCategories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  useEffect(() => {
    if (initialData) {
      setCategoryId(initialData.categoryId || '');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setDescription(initialData.description || '');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setIsRecurring(!!initialData.isRecurring);
      setFrequencyName(initialData.frequencyName || 'Mensual');
    } else {
      setCategoryId(activeCategories[0]?.id || '');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setIsRecurring(false);
      setFrequencyName('Mensual');
    }
    setError('');
  }, [initialData, isOpen, activeCategories.length]);

  const selectedCategoryObj = activeCategories.find((c) => c.id === categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError('Debes seleccionar una categoría obligatoriamente');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Ingresa un monto válido mayor a 0');
      return;
    }
    if (numAmount > 10000000) {
      setError('El monto ingresado es demasiado elevado');
      return;
    }
    if (!date) {
      setError('Ingresa una fecha válida');
      return;
    }

    const catName = selectedCategoryObj ? selectedCategoryObj.name : 'General';

    setError('');
    setIsLoading(true);
    try {
      await onSubmit({
        categoryId,
        categoryName: catName,
        amount: numAmount,
        description: description.trim() || catName,
        date,
        isRecurring,
        frequencyName: isRecurring ? frequencyName : 'Una sola vez'
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error al procesar el gasto');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar gasto' : 'Registrar gasto'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {/* 1. VISUAL CATEGORY GRID SELECTOR */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              ¿En qué categoría gastaste? *
            </label>
            {activeCategories.length > 6 && (
              <div className="relative w-36">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1 text-[11px] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
            {filteredCategories.map((c) => {
              const isSelected = categoryId === c.id;
              const emoji = getCategoryEmoji(c.name);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition-all touch-target ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 font-bold shadow-md shadow-emerald-950/20'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{emoji}</span>
                    <span className="truncate">{c.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. PROMINENT AMOUNT INPUT ($) */}
        <div>
          <Input
            label="¿Cuánto gastaste? ($) *"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="250.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            leftIcon={<DollarSign className="w-5 h-5 text-emerald-400" />}
            className="text-lg font-extrabold py-3 text-emerald-300"
          />
        </div>

        {/* 3. RECURRENCE SELECTOR (Segmented Pill Toggle) */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Tipo de gasto *
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setIsRecurring(false)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all touch-target flex items-center justify-center gap-1.5 ${
                !isRecurring
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Gasto único</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRecurring(true)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all touch-target flex items-center justify-center gap-1.5 ${
                isRecurring
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Gasto recurrente</span>
            </button>
          </div>

          {/* FREQUENCY SELECTOR */}
          {isRecurring && (
            <div className="mt-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase block">
                ¿Cada cuánto se repite este gasto? *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Diario', 'Semanal', 'Quincenal', 'Mensual'].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequencyName(freq)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all touch-target ${
                      frequencyName === freq
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. DATE AND DESCRIPTION / NOTES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Fecha del gasto *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            label="Descripción o notas (opcional)"
            placeholder="Ej. Súper quincenal, Gasolina"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* 5. LIVE VISUAL SUMMARY PREVIEW */}
        {selectedCategoryObj && parseFloat(amount) > 0 && (
          <div className="p-3.5 bg-slate-950/80 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{getCategoryEmoji(selectedCategoryObj.name)}</span>
              <div>
                <p className="font-bold text-slate-100">{selectedCategoryObj.name}</p>
                <p className="text-[11px] text-slate-400">
                  {isRecurring ? `🔄 ${frequencyName}` : 'Una sola vez'} · {date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-extrabold text-emerald-400">{formatCurrency(parseFloat(amount))}</p>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} className="touch-target">
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} className="gap-2 touch-target">
            {initialData ? 'Guardar cambios' : 'Registrar gasto'} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Modal>
  );
};
