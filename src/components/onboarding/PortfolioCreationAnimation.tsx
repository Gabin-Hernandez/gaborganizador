'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface PortfolioCreationAnimationProps {
  onComplete: () => void;
}

export const PortfolioCreationAnimation: React.FC<PortfolioCreationAnimationProps> = ({ onComplete }) => {
  const messages = [
    'Configurando tus categorías...',
    'Preparando tus finanzas...',
    'Creando tu espacio personal...'
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [messages.length, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center max-w-md text-center"
      >
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-500/30 animate-pulse">
            <Sparkles className="w-10 h-10 stroke-[2]" />
          </div>
          <div className="absolute -inset-2 bg-emerald-500/20 blur-xl rounded-full -z-10" />
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight mb-2">Creando tu portafolio...</h2>
        
        <div className="h-12 flex items-center justify-center">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-emerald-400 font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-spin" />
            {messages[currentStep]}
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / messages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
};
