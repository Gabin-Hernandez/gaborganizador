'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { ExtraIncomeList } from '@/components/ingresos/ExtraIncomeList';

interface PageProps {
  onOpenMobileSidebar?: () => void;
}

export default function IngresosPage({ onOpenMobileSidebar }: PageProps) {
  return (
    <div className="space-y-6">
      <Header
        title="Ingresos Extra"
        subtitle="Registra fuentes de ingresos adicionales fuera de tu salario mensual base"
        moduleImage="/ingresoextra.png"
        onOpenMobileSidebar={onOpenMobileSidebar}
      />
      <ExtraIncomeList />
    </div>
  );
}
