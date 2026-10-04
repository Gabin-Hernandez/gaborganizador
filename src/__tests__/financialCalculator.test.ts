import { describe, it, expect } from 'vitest';
import { FinancialCalculator } from '../domain/services/FinancialCalculator';
import { Expense } from '../domain/entities/Expense';
import { ExtraIncome } from '../domain/entities/ExtraIncome';
import { InvestmentConfig, InvestmentContribution } from '../domain/entities/InvestmentConfig';

describe('FinancialCalculator Domain Service', () => {
  it('should correctly calculate summary with salary, expenses, extra income and percentage investment', () => {
    const salary = 25000;

    const expenses: Expense[] = [
      {
        id: 'exp-1',
        userId: 'user-a',
        categoryId: 'cat-1',
        categoryName: 'Gasolina',
        amount: 3200,
        description: 'Gasolina mes',
        date: '2026-10-01',
        isRecurring: false,
        createdAt: '2026-10-01T00:00:00Z'
      },
      {
        id: 'exp-2',
        userId: 'user-a',
        categoryId: 'cat-2',
        categoryName: 'Comida',
        amount: 4500,
        description: 'Súper mercado',
        date: '2026-10-02',
        isRecurring: false,
        createdAt: '2026-10-02T00:00:00Z'
      }
    ];

    const extraIncomes: ExtraIncome[] = [
      {
        id: 'inc-1',
        userId: 'user-a',
        amount: 2500,
        concept: 'Proyecto Freelance',
        date: '2026-10-03',
        createdAt: '2026-10-03T00:00:00Z'
      }
    ];

    const investmentConfig: InvestmentConfig = {
      userId: 'user-a',
      type: 'PERCENTAGE',
      value: 10, // 10% of 25,000 = 2,500
      updatedAt: '2026-10-01T00:00:00Z'
    };

    const contributions: InvestmentContribution[] = [
      {
        id: 'inv-1',
        userId: 'user-a',
        amount: 2500,
        note: 'Cetes',
        date: '2026-10-04',
        createdAt: '2026-10-04T00:00:00Z'
      }
    ];

    const summary = FinancialCalculator.calculateSummary(
      salary,
      expenses,
      extraIncomes,
      investmentConfig,
      contributions
    );

    // 1. Total expenses = 3200 + 4500 = 7700
    expect(summary.totalExpenses).toBe(7700);

    // 2. Extra income = 2500
    expect(summary.totalExtraIncome).toBe(2500);

    // 3. Total income = 25000 (salary) + 2500 (extra) = 27500
    expect(summary.totalIncome).toBe(27500);

    // 4. Investment target = 10% of 25000 = 2500
    expect(summary.investmentTarget).toBe(2500);

    // 5. Remaining money formula: Salary - Expenses - InvestmentTarget
    // 25000 - 7700 - 2500 = 14800
    expect(summary.remainingMoney).toBe(14800);

    // 6. Spent percentage = (7700 / 25000) * 100 = 30.8%
    expect(summary.spentPercentage).toBeCloseTo(30.8, 1);

    // 7. Investment status: target 2500, contributed 2500 => FULFILLED
    expect(summary.investmentStatus).toBe('FULFILLED');

    // 8. Category breakdown check
    expect(summary.categoryBreakdown).toHaveLength(2);
    expect(summary.categoryBreakdown[0].categoryName).toBe('Comida');
    expect(summary.categoryBreakdown[0].amount).toBe(4500);
  });

  it('should correctly handle fixed amount investment target', () => {
    const salary = 20000;
    const investmentConfig: InvestmentConfig = {
      userId: 'user-a',
      type: 'FIXED_AMOUNT',
      value: 3000,
      updatedAt: '2026-10-01T00:00:00Z'
    };

    const target = FinancialCalculator.calculateInvestmentTarget(salary, investmentConfig);
    expect(target).toBe(3000);
  });
});
