import { InvestmentConfig, InvestmentContribution } from '../entities/InvestmentConfig';

export interface IInvestmentRepository {
  getInvestmentConfig(uid: string): Promise<InvestmentConfig | null>;
  saveInvestmentConfig(uid: string, config: Omit<InvestmentConfig, 'userId' | 'updatedAt'>): Promise<InvestmentConfig>;
  getInvestmentContributions(uid: string): Promise<InvestmentContribution[]>;
  addInvestmentContribution(uid: string, contribution: Omit<InvestmentContribution, 'id' | 'userId' | 'createdAt'>): Promise<InvestmentContribution>;
  deleteInvestmentContribution(uid: string, contributionId: string): Promise<void>;
}
