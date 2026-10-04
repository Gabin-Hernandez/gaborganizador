export interface ExtraIncome {
  id: string;
  userId: string;
  amount: number;
  concept: string;
  description?: string;
  date: string; // ISO String or YYYY-MM-DD
  createdAt: string;
}
