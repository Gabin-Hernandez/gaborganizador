'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, PieChart, TrendingUp, LogOut, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/application/context/AuthContext';

interface MobileMoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMoreMenu: React.FC<MobileMoreMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const moreItems = [
    { label: 'Registro de gastos', subtitle: 'Administrar historial de gastos', href: '/gastos', icon: DollarSign, image: '/salario.png' },
    { label: 'Salario', subtitle: 'Configurar salario base', href: '/salario', icon: DollarSign, image: '/salario.png' },
    { label: 'Inversión', subtitle: 'Patrimonio y aportaciones', href: '/inversion', icon: PieChart, image: '/inversion.png' },
    { label: 'Ingresos extra', subtitle: 'Freelance, ventas y extras', href: '/ingresos', icon: TrendingUp, image: '/ingresoextra.png' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative z-10 w-full bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 pb-safe space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-2 opacity-60" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-md">
                  <Image
                    src="/logomono.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    unoptimized
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Más opciones</h3>
                  <p className="text-xs text-slate-400 truncate">{user?.email || 'Usuario'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center hover:text-slate-100 touch-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="space-y-2 py-1">
              {moreItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all touch-target ${
                      isActive
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-200 active:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center border border-slate-200 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.label}
                          width={32}
                          height={32}
                          unoptimized
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100">{item.label}</p>
                        <p className="text-xs text-slate-400 font-normal">{item.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </Link>
                );
              })}
            </div>

            {/* Logout */}
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-sm active:bg-rose-500/20 touch-target"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
