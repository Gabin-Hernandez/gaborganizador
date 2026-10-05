import { RecurringExpense } from '../entities/RecurringExpense';

export interface IRecurringExpenseRepository {
  getRecurringExpenses(uid: string): Promise<RecurringExpense[]>;
  getRecurringExpenseById(uid: string, id: string): Promise<RecurringExpense | null>;
  createRecurringExpense(uid: string, data: Omit<RecurringExpense, 'id' | 'userId' | 'createdAt'>): Promise<RecurringExpense>;
  updateRecurringExpense(uid: string, id: string, data: Partial<RecurringExpense>): Promise<void>;
  deleteRecurringExpense(uid: string, id: string): Promise<void>;
  getAllActiveRecurringExpenses(): Promise<RecurringExpense[]>;
}
