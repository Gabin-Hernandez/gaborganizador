export type InvestmentType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface InvestmentConfig {
  id?: string;
  userId: string;
  type: InvestmentType;
  value: number; // e.g. 10 (%) or 3000 ($)
  updatedAt: string;
}

export interface InvestmentContribution {
  id: string;
  userId: string;
  amount: number;
  note?: string;
  date: string;
  createdAt: string;
}
