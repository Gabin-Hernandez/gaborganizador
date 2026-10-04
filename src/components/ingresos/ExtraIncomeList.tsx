'use client';

import React, { useState } from 'react';
import { useExtraIncomes } from '@/hooks/useExtraIncomes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ExtraIncomeModal } from './ExtraIncomeModal';
import { TrendingUp, Plus, Trash2, Calendar } from 'lucide-react';

export const ExtraIncomeList: React.FC = () => {
  const { extraIncomes, loading, addExtraIncome, deleteExtraIncome } = useExtraIncomes();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner label="Cargando ingresos extra..." />;
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const totalExtra = extraIncomes.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Total Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Ingresos Extra Registrados
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dinero percibido fuera del salario mensual base (freelance, ventas, comisiones).
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Registrar ingreso extra
        </Button>
      </div>

      <Card className="flex items-center justify-between p-5 border-emerald-500/30 bg-emerald-950/20">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Total Ingresos Extra Registrados
          </span>
          <p className="text-3xl font-extrabold text-slate-100">{formatCurrency(totalExtra)}</p>
        </div>
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
          <TrendingUp className="w-8 h-8" />
        </div>
      </Card>

      {/* List */}
      {extraIncomes.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">
          <p className="text-sm font-semibold text-slate-300 mb-1">No has registrado ingresos extra</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Registra cualquier dinero adicional que hayas recibido. Estos ingresos complementan tu presupuesto mensual sin alterar tu salario base.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extraIncomes.map((inc) => (
            <Card key={inc.id} hoverEffect className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-100 text-base">{inc.concept}</span>
                </div>
                {inc.description && <p className="text-xs text-slate-400 mb-2">{inc.description}</p>}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{inc.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-emerald-400">+{formatCurrency(inc.amount)}</span>
                <button
                  onClick={() => deleteExtraIncome(inc.id)}
                  title="Eliminar ingreso"
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ExtraIncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          await addExtraIncome(data);
        }}
      />
    </div>
  );
};
