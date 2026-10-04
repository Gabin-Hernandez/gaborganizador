'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCategories } from '@/hooks/useCategories';
import { useFrequencies } from '@/hooks/useFrequencies';
import { DollarSign } from 'lucide-react';

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
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { categories } = useCategories();
  const { frequencies } = useFrequencies();

  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequencyName, setFrequencyName] = useState('Mensual');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeCategories = categories.filter((c) => c.isActive !== false);

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
    if (!date) {
      setError('Ingresa una fecha válida');
      return;
    }

    const catObj = activeCategories.find((c) => c.id === categoryId);
    const catName = catObj ? catObj.name : 'General';

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
        frequencyName: isRecurring ? frequencyName : undefined
      });
      setAmount('');
      setDescription('');
      setIsRecurring(false);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar nuevo gasto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium">{error}</div>}

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Categoría *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl min-h-[44px] py-2.5 px-4 text-slate-100 text-base sm:text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="">Selecciona categoría</option>
            {activeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Monto del gasto ($) *"
          type="number"
          inputMode="decimal"
          step="0.01"
          placeholder="350.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          leftIcon={<DollarSign className="w-5 h-5 text-rose-400" />}
        />

        <Input
          label="Descripción o concepto"
          placeholder="Ej. Súper quincenal, Gasolina Pemex"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          label="Fecha *"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500"
            />
            ¿Es un gasto recurrente / periódico?
          </label>

          {isRecurring && (
            <div className="mt-3 pl-6 border-l-2 border-emerald-500/40 space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase block">Frecuencia</label>
              <select
                value={frequencyName}
                onChange={(e) => setFrequencyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {frequencies.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name} (cada {f.daysInterval} días)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} variant="danger">
            Guardar gasto
          </Button>
        </div>
      </form>
    </Modal>
  );
};
