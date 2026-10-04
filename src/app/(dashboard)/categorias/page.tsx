'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { CategoryList } from '@/components/categories/CategoryList';

interface PageProps {
  onOpenMobileSidebar?: () => void;
}

export default function CategoriasPage({ onOpenMobileSidebar }: PageProps) {
  return (
    <div className="space-y-6">
      <Header
        title="Categorías de Gastos"
        subtitle="Administra y personaliza tus categorías y frecuencias de gastos"
        moduleImage="/categorias.png"
        onOpenMobileSidebar={onOpenMobileSidebar}
      />
      <CategoryList />
    </div>
  );
}
