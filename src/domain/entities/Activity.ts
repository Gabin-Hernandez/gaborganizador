export type ActivityType = 'EXPENSE' | 'EXTRA_INCOME' | 'INVESTMENT';

export interface FinancialActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  categoryOrConcept: string;
  description?: string;
  amount: number;
  date: string; // ISO date string
}
