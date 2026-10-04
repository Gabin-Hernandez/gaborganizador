'use client';

import React, { createContext, useContext, useState } from 'react';

interface DashboardLayoutContextType {
  mobileOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  isQuickExpenseOpen: boolean;
  openQuickExpense: () => void;
  closeQuickExpense: () => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType>({
  mobileOpen: false,
  openMobileSidebar: () => {},
  closeMobileSidebar: () => {},
  isQuickExpenseOpen: false,
  openQuickExpense: () => {},
  closeQuickExpense: () => {}
});

export const DashboardLayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false);

  return (
    <DashboardLayoutContext.Provider
      value={{
        mobileOpen,
        openMobileSidebar: () => setMobileOpen(true),
        closeMobileSidebar: () => setMobileOpen(false),
        isQuickExpenseOpen,
        openQuickExpense: () => setIsQuickExpenseOpen(true),
        closeQuickExpense: () => setIsQuickExpenseOpen(false)
      }}
    >
      {children}
    </DashboardLayoutContext.Provider>
  );
};

export const useDashboardLayout = () => useContext(DashboardLayoutContext);
