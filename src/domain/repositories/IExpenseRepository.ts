import { Expense } from '../entities/Expense';

export interface IExpenseRepository {
  getExpenses(uid: string): Promise<Expense[]>;
  getExpensesByDateRange(uid: string, startDate: string, endDate: string): Promise<Expense[]>;
  createExpense(uid: string, expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<Expense>;
  updateExpense(uid: string, expenseId: string, expense: Partial<Expense>): Promise<void>;
  deleteExpense(uid: string, expenseId: string): Promise<void>;
  hasExpensesWithCategory(uid: string, categoryId: string): Promise<boolean>;
}
