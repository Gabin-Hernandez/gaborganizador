'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Tags, Plus, Layers, MoreHorizontal } from 'lucide-react';
import { useDashboardLayout } from './DashboardLayoutContext';
import { MobileMoreMenu } from './MobileMoreMenu';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { openQuickExpense } = useDashboardLayout();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Categorías', href: '/categorias', icon: Tags }
  ];

  const rightTabs = [
    { label: 'Resumen', href: '/resumen', icon: Layers }
  ];

  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe pt-2 px-3 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          {/* Left Tabs */}
          {mainTabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-target ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
              </Link>
            );
          })}

          {/* Central Prominent Quick Action (+) Button */}
          <div className="relative -top-5 flex justify-center">
            <button
              onClick={openQuickExpense}
              aria-label="Agregar gasto rápido"
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 border-4 border-slate-950 active:scale-95 transition-transform touch-target"
            >
              <Plus className="w-7 h-7 stroke-[3]" />
            </button>
          </div>

          {/* Right Tabs */}
          {rightTabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-target ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
              </Link>
            );
          })}

          {/* "Más" Secondary Options Sheet Button */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-target ${
              ['/salario', '/inversion', '/ingresos'].includes(pathname)
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] tracking-tight mt-1">Más</span>
          </button>
        </div>
      </nav>

      {/* Secondary More Menu Drawer */}
      <MobileMoreMenu isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  );
};
