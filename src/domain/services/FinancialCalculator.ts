import { Expense } from '../entities/Expense';
import { ExtraIncome } from '../entities/ExtraIncome';
import { InvestmentConfig, InvestmentContribution } from '../entities/InvestmentConfig';

export interface CategoryExpenseBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color?: string;
}

export interface FinancialPeriodSummary {
  salary: number;
  totalExtraIncome: number;
  totalIncome: number;
  totalExpenses: number;
  investmentTarget: number;
  totalInvested: number;
  remainingMoney: number; // Salary - Expenses - Investment Target
  netCashFlow: number; // Total Income - Expenses - Total Invested
  spentPercentage: number;
  investmentPercentage: number;
  categoryBreakdown: CategoryExpenseBreakdown[];
  investmentStatus: 'FULFILLED' | 'PARTIAL' | 'PENDING';
}

export class FinancialCalculator {
  static calculateInvestmentTarget(salary: number, config: InvestmentConfig | null): number {
    if (!config || config.value <= 0) return 0;
    if (config.type === 'PERCENTAGE') {
      return (salary * config.value) / 100;
    }
    return config.value;
  }

  static calculateSummary(
    salary: number,
    expenses: Expense[],
    extraIncomes: ExtraIncome[],
    investmentConfig: InvestmentConfig | null,
    investmentContributions: InvestmentContribution[] = []
  ): FinancialPeriodSummary {
    const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalExtraIncome = extraIncomes.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalIncome = salary + totalExtraIncome;
    const investmentTarget = this.calculateInvestmentTarget(salary, investmentConfig);
    const totalInvested = investmentContributions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const remainingMoney = salary - totalExpenses - investmentTarget;
    const netCashFlow = totalIncome - totalExpenses - totalInvested;

    const spentPercentage = salary > 0 ? (totalExpenses / salary) * 100 : 0;
    const investmentPercentage = salary > 0 ? (investmentTarget / salary) * 100 : 0;

    // Group expenses by category
    const categoryMap = new Map<string, { categoryId: string; name: string; total: number }>();
    expenses.forEach((expense) => {
      const key = expense.categoryId || expense.categoryName || 'General';
      const existing = categoryMap.get(key);
      if (existing) {
        existing.total += expense.amount;
      } else {
        categoryMap.set(key, {
          categoryId: expense.categoryId || expense.categoryName || `cat-${key}`,
          name: expense.categoryName || 'General',
          total: expense.amount
        });
      }
    });

    const categoryBreakdown: CategoryExpenseBreakdown[] = Array.from(categoryMap.values()).map((cat) => ({
      categoryId: cat.categoryId,
      categoryName: cat.name,
      amount: cat.total,
      percentage: totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0
    }));

    // Sort category breakdown descending
    categoryBreakdown.sort((a, b) => b.amount - a.amount);

    let investmentStatus: 'FULFILLED' | 'PARTIAL' | 'PENDING' = 'PENDING';
    if (totalInvested >= investmentTarget && investmentTarget > 0) {
      investmentStatus = 'FULFILLED';
    } else if (totalInvested > 0) {
      investmentStatus = 'PARTIAL';
    }

    return {
      salary,
      totalExtraIncome,
      totalIncome,
      totalExpenses,
      investmentTarget,
      totalInvested,
      remainingMoney,
      netCashFlow,
      spentPercentage,
      investmentPercentage,
      categoryBreakdown,
      investmentStatus
    };
  }
}
