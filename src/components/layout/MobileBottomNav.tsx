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

  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe pt-2 px-2 shadow-2xl">
        <div className="grid grid-cols-5 items-center w-full max-w-md mx-auto relative">
          {/* Item 1: Dashboard */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all touch-target text-center ${
              pathname === '/dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${pathname === '/dashboard' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">Dashboard</span>
          </Link>

          {/* Item 2: Categorías */}
          <Link
            href="/categorias"
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all touch-target text-center ${
              pathname === '/categorias' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tags className={`w-5 h-5 ${pathname === '/categorias' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">Categorías</span>
          </Link>

          {/* Item 3: Central Prominent (+) Button - 100% Dead Center (Column 3 of 5) */}
          <div className="flex justify-center items-center relative -top-3">
            <button
              onClick={openQuickExpense}
              aria-label="Agregar gasto rápido"
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 border-4 border-slate-950 active:scale-95 transition-transform touch-target shrink-0"
            >
              <Plus className="w-7 h-7 stroke-[3]" />
            </button>
          </div>

          {/* Item 4: Resumen */}
          <Link
            href="/resumen"
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all touch-target text-center ${
              pathname === '/resumen' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className={`w-5 h-5 ${pathname === '/resumen' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">Resumen</span>
          </Link>

          {/* Item 5: Más */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all touch-target text-center ${
              ['/salario', '/inversion', '/ingresos'].includes(pathname)
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">Más</span>
          </button>
        </div>
      </nav>

      {/* Secondary More Menu Drawer */}
      <MobileMoreMenu isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  );
};
