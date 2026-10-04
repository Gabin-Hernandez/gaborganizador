'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/application/context/AuthContext';
import { UserProfileRepositoryFirebase } from '@/infrastructure/firebase/userProfileRepositoryFirebase';
import { ONBOARDING_CATEGORY_OPTIONS } from '@/domain/entities/Category';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PortfolioCreationAnimation } from './PortfolioCreationAnimation';
import { DollarSign, Check, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';

const profileRepo = new UserProfileRepositoryFirebase();

export const OnboardingWizard: React.FC = () => {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [salary, setSalary] = useState('');
  const [salaryError, setSalaryError] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Gasolina', 'Comida', 'Internet']);
  const [hasRecurring, setHasRecurring] = useState<boolean | null>(null);
  
  // Recurring items config
  const [selectedRecurring, setSelectedRecurring] = useState<string[]>(['Renta', 'Internet']);
  const [recurringFrequency, setRecurringFrequency] = useState('Mensual');

  const [isSaving, setIsSaving] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleRecurring = (cat: string) => {
    setSelectedRecurring((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleNextFromSalary = () => {
    const numSalary = parseFloat(salary);
    if (!salary || isNaN(numSalary) || numSalary < 0) {
      setSalaryError('Ingresa un salario válido mayor o igual a 0');
      return;
    }
    setSalaryError('');
    setStep(2);
  };

  const [saveError, setSaveError] = useState('');

  const handleComplete = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveError('');
    try {
      const recurringExpenses = hasRecurring
        ? selectedRecurring.map((cat) => ({
            categoryName: cat,
            frequencyName: recurringFrequency
          }))
        : [];

      await profileRepo.completeOnboarding(user.uid, {
        salary: parseFloat(salary),
        selectedCategories,
        hasRecurringExpenses: !!hasRecurring,
        recurringExpenses
      });

      await refreshProfile();
      setIsSaving(false);
      setShowAnimation(true);
    } catch (err: any) {
      console.error('Error saving onboarding:', err);
      setIsSaving(false);
      if (err?.code === 'permission-denied' || err?.message?.includes('permissions')) {
        setSaveError('Permisos de Firebase denegados. Actualiza tus Reglas de Firestore en la consola de Firebase para permitir el acceso por UID.');
      } else {
        setSaveError(err?.message || 'Error al guardar la configuración inicial.');
      }
    }
  };

  if (showAnimation) {
    return (
      <PortfolioCreationAnimation
        onComplete={() => {
          router.replace('/dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-emerald-500' : s < step ? 'w-2 bg-emerald-700' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold uppercase text-slate-400">Paso {step} de 3</span>
        </div>

        {/* STEP 1: SALARIO */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">¿Cuál es tu salario mensual?</h2>
              <p className="text-sm text-slate-400">
                Esta cifra servirá como base para calcular tu dinero disponible e inversiones.
              </p>
            </div>

            <div className="pt-2">
              <Input
                label="Monto mensual ($)"
                type="number"
                inputMode="decimal"
                placeholder="25000"
                value={salary}
                onChange={(e) => {
                  setSalary(e.target.value);
                  setSalaryError('');
                }}
                error={salaryError}
                leftIcon={<DollarSign className="w-5 h-5 text-emerald-400" />}
                className="text-lg font-bold py-3"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNextFromSalary} className="gap-2">
                Siguiente <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: CATEGORIAS DE GASTO FRECUENTES */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">¿En qué gastas más a menudo?</h2>
              <p className="text-sm text-slate-400">
                Selecciona las categorías principales donde realizas pagos frecuentes.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
              {ONBOARDING_CATEGORY_OPTIONS.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl border text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-inner'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ChevronLeft className="w-4 h-4" /> Atrás
              </Button>
              <Button onClick={() => setStep(3)} className="gap-2">
                Siguiente <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: GASTOS RECURRENTES */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">¿Tienes gastos recurrentes?</h2>
              <p className="text-sm text-slate-400">
                Servicios o pagos fijos que realizas de forma periódica.
              </p>
            </div>

            {saveError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 font-semibold leading-relaxed">
                {saveError}
              </div>
            )}

            {hasRecurring === null && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <button
                  type="button"
                  onClick={() => setHasRecurring(true)}
                  className="p-6 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-center transition-all"
                >
                  <span className="text-xl font-bold text-emerald-400 block mb-1">Sí</span>
                  <span className="text-xs text-slate-400">Tengo pagos fijos periódicos</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasRecurring(false);
                    handleComplete();
                  }}
                  className="p-6 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 text-center transition-all"
                >
                  <span className="text-xl font-bold text-slate-300 block mb-1">No</span>
                  <span className="text-xs text-slate-400">No tengo pagos fijos por ahora</span>
                </button>
              </div>
            )}

            {hasRecurring === true && (
              <div className="space-y-4 pt-2">
                <label className="text-xs font-semibold text-slate-300 uppercase">¿Cuáles pagos recurrentes tienes?</label>
                <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {['Internet', 'Escuela', 'Renta', 'Carro', 'Gimnasio', 'Suscripciones', 'Seguro', 'Otros'].map((item) => {
                    const isSel = selectedRecurring.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleRecurring(item)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isSel
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>{item}</span>
                        {isSel && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase mb-2 block">
                    Frecuencia de estos pagos
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Diario', 'Semanal', 'Quincenal', 'Mensual'].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setRecurringFrequency(freq)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                          recurringFrequency === freq
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button
                variant="outline"
                onClick={() => {
                  if (hasRecurring === true) {
                    setHasRecurring(null);
                  } else {
                    setStep(2);
                  }
                }}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Atrás
              </Button>

              {hasRecurring === true && (
                <Button onClick={handleComplete} isLoading={isSaving} className="gap-2">
                  Finalizar <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
