export interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  description: string;
  date: string; // Financial date (YYYY-MM-DD). Used for all financial calculations.
  expenseDate?: string; // Optional alias for date
  isRecurring: boolean;
  frequencyId?: string;
  frequencyName?: string;
  recurringExpenseId?: string; // Links occurrence to its RecurringExpense definition
  occurrenceDate?: string; // Key YYYY-MM-DD for occurrence uniqueness & idempotency
  createdAt: string; // Timestamp when user captured/registered the expense
  updatedAt?: string;
}
