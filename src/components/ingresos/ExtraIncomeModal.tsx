'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DollarSign } from 'lucide-react';

interface ExtraIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; concept: string; description?: string; date: string }) => Promise<void>;
}

export const ExtraIncomeModal: React.FC<ExtraIncomeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Ingresa un monto de ingreso válido mayor a 0');
      return;
    }
    if (!concept.trim()) {
      setError('El concepto del ingreso es obligatorio (ej. Proyecto freelance)');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await onSubmit({
        amount: num,
        concept: concept.trim(),
        description: description.trim() || undefined,
        date
      });
      setAmount('');
      setConcept('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar ingreso extra">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium">{error}</div>}

        <Input
          label="Monto recibido ($) *"
          type="number"
          step="0.01"
          placeholder="2500.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          leftIcon={<DollarSign className="w-5 h-5 text-emerald-400" />}
        />

        <Input
          label="Concepto *"
          placeholder="Ej. Trabajo extra freelance, Venta de laptop, Comisión"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
        />

        <Input
          label="Descripción opcional"
          placeholder="Detalles adicionales..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          label="Fecha de recepción *"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Guardar ingreso
          </Button>
        </div>
      </form>
    </Modal>
  );
};
