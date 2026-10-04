'use client';

import React, { useState } from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { UserProfileRepositoryFirebase } from '@/infrastructure/firebase/userProfileRepositoryFirebase';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DollarSign, Save, CheckCircle } from 'lucide-react';

const repo = new UserProfileRepositoryFirebase();

export const SalaryForm: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [salary, setSalary] = useState(profile?.salary?.toString() || '0');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(salary);
    if (isNaN(num) || num < 0) {
      setError('Ingresa un salario válido mayor o igual a 0');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      if (user) {
        await repo.updateSalary(user.uid, num);
        await refreshProfile();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar el salario');
    } finally {
      setIsSaving(false);
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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100">Configuración de Salario Base</h3>
          <p className="text-xs text-slate-400">Modifica la cifra mensual de tus ingresos fijos principales.</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase block">Salario actual</span>
          <span className="text-xl font-extrabold text-emerald-400">{formatCurrency(profile?.salary || 0)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium">{error}</div>}
        {savedSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            ¡Salario actualizado correctamente!
          </div>
        )}

        <Input
          label="Nuevo monto de salario mensual ($)"
          type="number"
          step="0.01"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          leftIcon={<DollarSign className="w-5 h-5 text-emerald-400" />}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isSaving} className="gap-2">
            <Save className="w-4 h-4" /> Guardar cambios de salario
          </Button>
        </div>
      </form>
    </Card>
  );
};
