'use client';

import React, { useState } from 'react';
import { Expense } from '@/domain/entities/Expense';
import { GastoItemCard } from './GastoItemCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Plus, AlertTriangle } from 'lucide-react';

interface GastosCardListProps {
  expenses: Expense[];
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => Promise<void>;
  onOpenCreateModal: () => void;
}

export const GastosCardList: React.FC<GastosCardListProps> = ({
  expenses,
  loading,
  onEdit,
  onDelete,
  onOpenCreateModal
}) => {
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(expenseToDelete.id);
      setExpenseToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-36 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse p-4 space-y-3">
            <div className="h-10 w-10 bg-slate-800 rounded-xl" />
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 my-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingCart className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-lg font-bold text-slate-100">¿Aún no tienes gastos registrados en esta vista?</h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Registra tu primer gasto para consultar el historial y comprender cómo se distribuye tu dinero.
          </p>
        </div>
        <div className="pt-2">
          <Button onClick={onOpenCreateModal} className="gap-2">
            <Plus className="w-4 h-4" /> Registrar mi primer gasto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.map((expense) => (
          <GastoItemCard
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={(exp) => setExpenseToDelete(exp)}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        title="Confirmar eliminación"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">¿Deseas eliminar este movimiento de gasto?</p>
              <p className="text-slate-400 mt-0.5">
                Esta acción eliminará el registro de{' '}
                <strong className="text-slate-200">{expenseToDelete?.categoryName}</strong> por ${expenseToDelete?.amount}.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setExpenseToDelete(null)} touch-target>
              Cancelar
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={confirmDelete} touch-target>
              Eliminar gasto
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
