'use client';

import React, { useState } from 'react';
import { useInvestment } from '@/hooks/useInvestment';
import { InvestmentType } from '@/domain/entities/InvestmentConfig';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PieChart, Percent, DollarSign, Save, Plus, ShieldCheck } from 'lucide-react';

interface InvestmentFormProps {
  salary: number;
}

export const InvestmentForm: React.FC<InvestmentFormProps> = ({ salary }) => {
  const { config, saveConfig, addContribution } = useInvestment();

  const [type, setType] = useState<InvestmentType>(config?.type || 'PERCENTAGE');
  const [value, setValue] = useState(config?.value?.toString() || '10');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Add Contribution State
  const [contribAmount, setContribAmount] = useState('');
  const [contribNote, setContribNote] = useState('');
  const [isSavingContrib, setIsSavingContrib] = useState(false);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      setError('Ingresa una meta de inversión válida');
      return;
    }
    if (type === 'PERCENTAGE' && (num < 0 || num > 100)) {
      setError('El porcentaje debe estar entre 0% y 100%');
      return;
    }
    setError('');
    setIsSavingConfig(true);
    try {
      await saveConfig(type, num);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar meta de inversión');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleAddContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(contribAmount);
    if (isNaN(amt) || amt <= 0) return;
    setIsSavingContrib(true);
    try {
      await addContribution(amt, contribNote || 'Aporte mensual');
      setContribAmount('');
      setContribNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingContrib(false);
    }
  };

  const targetAmount = type === 'PERCENTAGE' ? (salary * (parseFloat(value) || 0)) / 100 : parseFloat(value) || 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configure Goal */}
      <Card className="p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-4">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Definir Objetivo de Inversión</h3>
            <p className="text-xs text-slate-400">Selecciona porcentaje o monto fijo mensual.</p>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          {error && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium">{error}</div>}
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-medium">
              ¡Configuración de inversión guardada!
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('PERCENTAGE')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                type === 'PERCENTAGE'
                  ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <Percent className="w-4 h-4" /> Porcentaje %
            </button>
            <button
              type="button"
              onClick={() => setType('FIXED_AMOUNT')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                type === 'FIXED_AMOUNT'
                  ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <DollarSign className="w-4 h-4" /> Monto Fijo $
            </button>
          </div>

          <Input
            label={type === 'PERCENTAGE' ? 'Porcentaje de salario (%)' : 'Monto mensual destinado ($)'}
            type="number"
            step={type === 'PERCENTAGE' ? '1' : '100'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex justify-between items-center">
            <span className="text-slate-400 font-medium">Destino mensual calculado:</span>
            <span className="font-extrabold text-teal-400 text-base">{formatCurrency(targetAmount)}</span>
          </div>

          <Button type="submit" isLoading={isSavingConfig} className="w-full gap-2">
            <Save className="w-4 h-4" /> Guardar meta de inversión
          </Button>
        </form>
      </Card>

      {/* Record Contribution Form */}
      <Card className="p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Registrar Aporte de Inversión</h3>
              <p className="text-xs text-slate-400">Suma capital real destinado a tus inversiones este mes.</p>
            </div>
          </div>

          <form onSubmit={handleAddContribution} className="space-y-4">
            <Input
              label="Monto aportado ($)"
              type="number"
              step="0.01"
              placeholder="2500.00"
              value={contribAmount}
              onChange={(e) => setContribAmount(e.target.value)}
              leftIcon={<DollarSign className="w-5 h-5 text-emerald-400" />}
            />

            <Input
              label="Nota / Destino de inversión"
              placeholder="Ej. Cetes Directo, ETF S&P 500, Fideicomiso"
              value={contribNote}
              onChange={(e) => setContribNote(e.target.value)}
            />

            <Button type="submit" isLoading={isSavingContrib} className="w-full gap-2">
              <Plus className="w-4 h-4" /> Registrar aporte realizado
            </Button>
          </form>
        </div>

        <p className="text-[11px] text-slate-500 mt-4 italic">
          * Las aportaciones a inversión no se consideran gastos destruidos, representan asignaciones financieras de patrimonio.
        </p>
      </Card>
    </div>
  );
};
