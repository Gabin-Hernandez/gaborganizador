'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Tags,
  TrendingUp,
  DollarSign,
  PieChart,
  Layers,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '@/application/context/AuthContext';
import { useDashboardLayout } from './DashboardLayoutContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen: propMobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { mobileOpen: ctxMobileOpen, closeMobileSidebar } = useDashboardLayout();

  const isMobileOpen = propMobileOpen !== undefined ? propMobileOpen : ctxMobileOpen;
  const handleClose = onCloseMobile || closeMobileSidebar;

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, image: '/dashboard.png' },
    { label: 'Categorías de gastos', href: '/categorias', icon: Tags, image: '/categorias.png' },
    { label: 'Ingresos extra', href: '/ingresos', icon: TrendingUp, image: '/ingresoextra.png' },
    { label: 'Salario', href: '/salario', icon: DollarSign, image: '/salario.png' },
    { label: 'Inversión', href: '/inversion', icon: PieChart, image: '/inversion.png' },
    { label: 'Resumen', href: '/resumen', icon: Layers, image: '/resumen.png' }
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-64 p-5 select-none">
      {/* Sidebar Logo Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white p-1.5 flex items-center justify-center border border-slate-200 shadow-lg shadow-black/40 shrink-0">
            <Image
              src="/logomono.png"
              alt="Finanzas Personales Logo"
              width={40}
              height={40}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight leading-tight">GABOR</h1>
            <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">GANIZADOR</p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleClose}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-lg shadow-emerald-950/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
            >
              <div
                className={`w-9 h-9 rounded-xl p-1.5 flex items-center justify-center shrink-0 border transition-all ${isActive
                    ? 'bg-emerald-400 border-emerald-300 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-100 border-slate-200 shadow-sm'
                  }`}
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  width={28}
                  height={28}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="pt-4 border-t border-slate-800 mt-auto">
        <div className="mb-3 px-2">
          <p className="text-xs text-slate-500 truncate">Sesión iniciada</p>
          <p className="text-xs font-medium text-slate-300 truncate">{user?.email || 'Usuario'}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 z-30">{content}</aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
};
