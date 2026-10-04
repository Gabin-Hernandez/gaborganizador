import { ExtraIncome } from '../entities/ExtraIncome';

export interface IExtraIncomeRepository {
  getExtraIncomes(uid: string): Promise<ExtraIncome[]>;
  getExtraIncomesByDateRange(uid: string, startDate: string, endDate: string): Promise<ExtraIncome[]>;
  createExtraIncome(uid: string, income: Omit<ExtraIncome, 'id' | 'userId' | 'createdAt'>): Promise<ExtraIncome>;
  updateExtraIncome(uid: string, incomeId: string, income: Partial<ExtraIncome>): Promise<void>;
  deleteExtraIncome(uid: string, incomeId: string): Promise<void>;
}
