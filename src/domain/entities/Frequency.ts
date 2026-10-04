export interface Frequency {
  id: string;
  userId: string;
  name: string;
  daysInterval: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export const DEFAULT_FREQUENCIES: Omit<Frequency, 'id' | 'userId' | 'createdAt'>[] = [
  { name: 'Diario', daysInterval: 1, isDefault: true, isActive: true },
  { name: 'Semanal', daysInterval: 7, isDefault: true, isActive: true },
  { name: 'Quincenal', daysInterval: 15, isDefault: true, isActive: true },
  { name: 'Mensual', daysInterval: 30, isDefault: true, isActive: true }
];
