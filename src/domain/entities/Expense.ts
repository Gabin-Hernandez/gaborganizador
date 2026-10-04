export interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  description: string;
  date: string; // ISO String (YYYY-MM-DD or full timestamp)
  isRecurring: boolean;
  frequencyId?: string;
  frequencyName?: string;
  createdAt: string;
}
