'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { FinancialPeriodSummary } from '@/domain/services/FinancialCalculator';
import { Card } from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';

interface SalaryDistributionChartProps {
  summary: FinancialPeriodSummary;
}

export const SalaryDistributionChart: React.FC<SalaryDistributionChartProps> = ({ summary }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  const data = [
    { name: 'Gastos', value: summary.totalExpenses, color: '#ef4444' },
    { name: 'Inversión Target', value: summary.investmentTarget, color: '#06b6d4' },
    { name: 'Disponible Restante', value: Math.max(0, summary.remainingMoney), color: '#10b981' }
  ];

  return (
    <Card className="p-6 flex flex-col h-full min-h-[350px]">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-4">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Distribución Financiera del Salario</h3>
          <p className="text-xs text-slate-400">Asignación comparativa entre gastos, inversión y sobrante</p>
        </div>
      </div>

      <div className="flex-1 w-full h-[250px]">
        {!isMounted ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
            Cargando gráfica...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
                        <p className="font-bold text-slate-100 mb-1">{d.name}</p>
                        <p className="font-extrabold text-emerald-400">{formatCurrency(d.value)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
