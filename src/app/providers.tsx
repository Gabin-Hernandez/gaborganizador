'use client';

import React from 'react';
import { AuthProvider } from '@/application/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
