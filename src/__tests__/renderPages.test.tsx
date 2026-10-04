// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock Firebase & Next router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn()
  }),
  usePathname: () => '/dashboard'
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback({ uid: 'test-user', email: 'test@example.com' });
    return () => {};
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({ onboarded: true, salary: 25000 }) })),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ empty: true, forEach: vi.fn() })),
  addDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn()
}));

import { AuthProvider } from '@/application/context/AuthContext';
import DashboardPage from '@/app/(dashboard)/dashboard/page';
import CategoriasPage from '@/app/(dashboard)/categorias/page';
import IngresosPage from '@/app/(dashboard)/ingresos/page';
import SalarioPage from '@/app/(dashboard)/salario/page';
import InversionPage from '@/app/(dashboard)/inversion/page';
import ResumenPage from '@/app/(dashboard)/resumen/page';
import OnboardingPage from '@/app/onboarding/page';
import LoginPage from '@/app/(auth)/login/page';
import RegisterPage from '@/app/(auth)/register/page';

describe('All Page Routes Render Test', () => {
  it('should render DashboardPage without invalid element type error', () => {
    const { container } = render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });

  it('should render CategoriasPage', () => {
    const { container } = render(
      <AuthProvider>
        <CategoriasPage />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });

  it('should render IngresosPage', () => {
    const { container } = render(
      <AuthProvider>
        <IngresosPage />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });

  it('should render SalarioPage', () => {
    const { container } = render(
      <AuthProvider>
        <SalarioPage />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });

  it('should render InversionPage', () => {
    const { container } = render(
      <AuthProvider>
        <InversionPage />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });

  it('should render ResumenPage', () => {
    const { container } = render(
      <AuthProvider>
        <ResumenPage />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });

  it('should render OnboardingPage', () => {
    const { container } = render(
      <AuthProvider>
        <OnboardingPage />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });

  it('should render LoginPage and RegisterPage', () => {
    const { container: login } = render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
    expect(login).toBeDefined();

    const { container: reg } = render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );
    expect(reg).toBeDefined();
  });
});
