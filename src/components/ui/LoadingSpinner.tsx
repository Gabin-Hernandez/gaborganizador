import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Cargando información...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-400">
      <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};
