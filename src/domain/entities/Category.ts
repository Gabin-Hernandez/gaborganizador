export interface Category {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export const INITIAL_DEFAULT_CATEGORIES = [
  { name: 'Gasolina', icon: 'Fuel', color: '#f59e0b' },
  { name: 'Comida', icon: 'Utensils', color: '#ef4444' },
  { name: 'Internet', icon: 'Wifi', color: '#3b82f6' },
  { name: 'Renta', icon: 'Home', color: '#8b5cf6' },
  { name: 'Carro', icon: 'Car', color: '#6366f1' },
  { name: 'Gimnasio', icon: 'Dumbbell', color: '#10b981' }
];

export const ONBOARDING_CATEGORY_OPTIONS = [
  'Café',
  'Comida',
  'Gasolina',
  'Gimnasio',
  'Cine',
  'Carro',
  'Internet',
  'Renta',
  'Escuela',
  'Entretenimiento',
  'Otros'
];
