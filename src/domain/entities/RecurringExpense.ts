export interface RecurringExpense {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  description: string;
  frequencyName: string; // 'Diario' | 'Semanal' | 'Quincenal' | 'Mensual'
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  dayOfMonth?: number; // 1 - 31 for Monthly recurrences
  status: 'active' | 'paused' | 'ended';
  createdAt: string;
  updatedAt?: string;
}
