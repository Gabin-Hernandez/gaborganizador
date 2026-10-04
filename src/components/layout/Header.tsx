'use client';

import React from 'react';
import Image from 'next/image';
import { Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDashboardLayout } from './DashboardLayoutContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  moduleImage?: string;
  onOpenMobileSidebar?: () => void;
  onQuickAction?: () => void;
  quickActionLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  moduleImage,
  onOpenMobileSidebar,
  onQuickAction,
  quickActionLabel
}) => {
  const { openMobileSidebar } = useDashboardLayout();
  const handleToggle = onOpenMobileSidebar || openMobileSidebar;

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800/80 gap-4">
      <div className="flex items-center gap-3.5">
        <button
          onClick={handleToggle}
          className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {moduleImage && (
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-lg shadow-black/30 shrink-0">
            <Image
              src={moduleImage}
              alt={title}
              width={40}
              height={40}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {onQuickAction && quickActionLabel && (
        <Button onClick={onQuickAction} size="sm" className="gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          {quickActionLabel}
        </Button>
      )}
    </header>
  );
};
