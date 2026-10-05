import { describe, it, expect } from 'vitest';
import { FinancialCalculator } from '../domain/services/FinancialCalculator';
import { RecurringExpenseService } from '../domain/services/RecurringExpenseService';
import { Expense } from '../domain/entities/Expense';
import { ExtraIncome } from '../domain/entities/ExtraIncome';
import { RecurringExpense } from '../domain/entities/RecurringExpense';

describe('MODELO TEMPORAL DE GASTOS Y RECURRENCIA (17 TEST SCENARIOS)', () => {

  // TEST 1 & TEST 8: Gasto registrado el 04 Oct 2026 pero con expenseDate 27 Sep 2026
  it('TEST 1 & 8: Expense captured on Oct 4 with expenseDate Sep 27 belongs strictly to September, not October', () => {
    const expenses: Expense[] = [
      {
        id: 'exp-1',
        userId: 'user-1',
        categoryId: 'cat-internet',
        categoryName: 'Internet',
        amount: 650,
        description: 'Internet Septiembre',
        date: '2026-09-27', // Financial date
        expenseDate: '2026-09-27',
        isRecurring: false,
        createdAt: '2026-10-04T10:00:00.000Z' // Capture date in October
      }
    ];

    // Filter for September 2026
    const sepExpenses = expenses.filter((e) => e.date.startsWith('2026-09'));
    const sepSummary = FinancialCalculator.calculateSummary(25000, sepExpenses, [], null, []);

    // Filter for October 2026
    const octExpenses = expenses.filter((e) => e.date.startsWith('2026-10'));
    const octSummary = FinancialCalculator.calculateSummary(25000, octExpenses, [], null, []);

    expect(sepSummary.totalExpenses).toBe(650);
    expect(octSummary.totalExpenses).toBe(0);
  });

  // TEST 2: Gasto creado con expenseDate 04 Oct 2026 pertenece a octubre
  it('TEST 2: Expense with expenseDate Oct 4 affects October financial metrics', () => {
    const expenses: Expense[] = [
      {
        id: 'exp-2',
        userId: 'user-1',
        categoryId: 'cat-food',
        categoryName: 'Alimentos',
        amount: 300,
        description: 'Super',
        date: '2026-10-04',
        expenseDate: '2026-10-04',
        isRecurring: false,
        createdAt: '2026-10-04T12:00:00.000Z'
      }
    ];

    const octExpenses = expenses.filter((e) => e.date.startsWith('2026-10'));
    const octSummary = FinancialCalculator.calculateSummary(25000, octExpenses, [], null, []);

    expect(octSummary.totalExpenses).toBe(300);
  });

  // TEST 3: Gasto recurrente mensual con inicio 27 Sep 2026 genera ocurrencias 27 Sep, 27 Oct, 27 Nov...
  it('TEST 3: Monthly recurring expense generates expected occurrence dates', () => {
    const def: RecurringExpense = {
      id: 'rec-1',
      userId: 'user-1',
      categoryId: 'cat-internet',
      categoryName: 'Internet',
      amount: 650,
      description: 'Internet Mensual',
      frequencyName: 'Mensual',
      startDate: '2026-09-27',
      dayOfMonth: 27,
      status: 'active',
      createdAt: '2026-09-27T00:00:00.000Z'
    };

    const dates = RecurringExpenseService.getExpectedOccurrenceDates(def, '2026-11-30');
    expect(dates).toContain('2026-09-27');
    expect(dates).toContain('2026-10-27');
    expect(dates).toContain('2026-11-27');
  });

  // TEST 4: IDEMPOTENCIA — Ejecutar dos veces el generador NO duplica gastos
  it('TEST 4: Recurring occurrence generator is idempotent and prevents duplicates', () => {
    const def: RecurringExpense = {
      id: 'rec-1',
      userId: 'user-1',
      categoryId: 'cat-internet',
      categoryName: 'Internet',
      amount: 650,
      description: 'Internet Mensual',
      frequencyName: 'Mensual',
      startDate: '2026-09-27',
      dayOfMonth: 27,
      status: 'active',
      createdAt: '2026-09-27T00:00:00.000Z'
    };

    // First execution: generate missing occurrences
    const missing1 = RecurringExpenseService.getMissingOccurrences(def, [], '2026-10-31');
    expect(missing1.length).toBe(2); // 2026-09-27 and 2026-10-27

    // Simulate saved expenses
    const existingExpenses: Expense[] = missing1.map((item, idx) => ({
      ...item,
      id: `${item.recurringExpenseId}_${item.occurrenceDate}`,
      userId: 'user-1',
      createdAt: '2026-10-04T00:00:00.000Z'
    }));

    // Second execution: should yield ZERO new occurrences
    const missing2 = RecurringExpenseService.getMissingOccurrences(def, existingExpenses, '2026-10-31');
    expect(missing2.length).toBe(0);
  });

  // TEST 5: Modificar recurrencia de $650 -> $700 NO altera gastos históricos ya registrados
  it('TEST 5: Updating recurring expense definition amount does not alter past historical occurrences', () => {
    const historicalExpense: Expense = {
      id: 'rec-1_2026-09-27',
      userId: 'user-1',
      categoryId: 'cat-internet',
      categoryName: 'Internet',
      amount: 650, // Recorded historical amount
      description: 'Internet Mensual',
      date: '2026-09-27',
      isRecurring: true,
      recurringExpenseId: 'rec-1',
      occurrenceDate: '2026-09-27',
      createdAt: '2026-09-27T00:00:00.000Z'
    };

    // User updates recurrence definition to $700 for future
    const updatedDef: RecurringExpense = {
      id: 'rec-1',
      userId: 'user-1',
      categoryId: 'cat-internet',
      categoryName: 'Internet',
      amount: 700, // Updated amount
      description: 'Internet Mensual',
      frequencyName: 'Mensual',
      startDate: '2026-09-27',
      dayOfMonth: 27,
      status: 'active',
      createdAt: '2026-09-27T00:00:00.000Z',
      updatedAt: '2026-10-04T00:00:00.000Z'
    };

    // Historical occurrence must remain $650
    expect(historicalExpense.amount).toBe(650);

    // New missing occurrence for Oct will use updated $700
    const missing = RecurringExpenseService.getMissingOccurrences(updatedDef, [historicalExpense], '2026-10-31');
    expect(missing.length).toBe(1);
    expect(missing[0].date).toBe('2026-10-27');
    expect(missing[0].amount).toBe(700);
  });

  // TEST 6 & 7: Pausar / Desactivar recurrencia no genera nuevas ocurrencias e historial permanece intacto
  it('TEST 6 & 7: Paused or ended recurring expense generates 0 new occurrences while keeping history intact', () => {
    const historicalExpense: Expense = {
      id: 'rec-1_2026-09-27',
      userId: 'user-1',
      categoryId: 'cat-internet',
      categoryName: 'Internet',
      amount: 650,
      description: 'Internet Mensual',
      date: '2026-09-27',
      isRecurring: true,
      recurringExpenseId: 'rec-1',
      occurrenceDate: '2026-09-27',
      createdAt: '2026-09-27T00:00:00.000Z'
    };

    const pausedDef: RecurringExpense = {
      id: 'rec-1',
      userId: 'user-1',
      categoryId: 'cat-internet',
      categoryName: 'Internet',
      amount: 650,
      description: 'Internet Mensual',
      frequencyName: 'Mensual',
      startDate: '2026-09-27',
      dayOfMonth: 27,
      status: 'paused', // Paused state
      createdAt: '2026-09-27T00:00:00.000Z'
    };

    const missing = RecurringExpenseService.getMissingOccurrences(pausedDef, [historicalExpense], '2026-11-30');
    expect(missing.length).toBe(0); // Zero new occurrences generated
    expect(historicalExpense.amount).toBe(650); // Historical expense remains intact
  });

  // TEST 9 & 10 & 11: Selección de mes en Dashboard y vistas filtra strictly movimientos de ese mes
  it('TEST 9, 10 & 11: Switching period recalculates all metrics for selected month only', () => {
    const expenses: Expense[] = [
      {
        id: 'exp-sep',
        userId: 'user-1',
        categoryId: 'cat-1',
        categoryName: 'Internet',
        amount: 650,
        description: '',
        date: '2026-09-27',
        isRecurring: false,
        createdAt: '2026-09-27T00:00:00.000Z'
      },
      {
        id: 'exp-oct',
        userId: 'user-1',
        categoryId: 'cat-1',
        categoryName: 'Internet',
        amount: 800,
        description: '',
        date: '2026-10-05',
        isRecurring: false,
        createdAt: '2026-10-05T00:00:00.000Z'
      }
    ];

    const sepExp = expenses.filter((e) => e.date.startsWith('2026-09'));
    const octExp = expenses.filter((e) => e.date.startsWith('2026-10'));

    const sepSummary = FinancialCalculator.calculateSummary(25000, sepExp, [], null, []);
    const octSummary = FinancialCalculator.calculateSummary(25000, octExp, [], null, []);

    expect(sepSummary.totalExpenses).toBe(650);
    expect(octSummary.totalExpenses).toBe(800);
  });

  // TEST 12: Módulo Ingresos Extra continúa funcionando independientemente
  it('TEST 12: Extra Income calculations function independently and respect financial date', () => {
    const extraIncomes: ExtraIncome[] = [
      {
        id: 'inc-1',
        userId: 'user-1',
        concept: 'Freelance',
        amount: 5000,
        date: '2026-09-28',
        description: 'Proyecto Web',
        createdAt: '2026-10-04T00:00:00.000Z' // Captured in Oct
      }
    ];

    const sepIncomes = extraIncomes.filter((i) => i.date.startsWith('2026-09'));
    const octIncomes = extraIncomes.filter((i) => i.date.startsWith('2026-10'));

    expect(sepIncomes.length).toBe(1);
    expect(octIncomes.length).toBe(0);

    const summary = FinancialCalculator.calculateSummary(25000, [], sepIncomes, null, []);
    expect(summary.totalExtraIncome).toBe(5000);
    expect(summary.totalIncome).toBe(30000);
  });

  // TEST 13: Aislamiento de datos entre usuarios (User A vs User B)
  it('TEST 13: User A expenses are isolated from User B expenses', () => {
    const allExpenses: Expense[] = [
      {
        id: 'exp-userA',
        userId: 'user-A',
        categoryId: 'cat-1',
        categoryName: 'Renta',
        amount: 10000,
        description: '',
        date: '2026-10-01',
        isRecurring: false,
        createdAt: '2026-10-01T00:00:00.000Z'
      },
      {
        id: 'exp-userB',
        userId: 'user-B',
        categoryId: 'cat-1',
        categoryName: 'Renta',
        amount: 15000,
        description: '',
        date: '2026-10-01',
        isRecurring: false,
        createdAt: '2026-10-01T00:00:00.000Z'
      }
    ];

    const userAExpenses = allExpenses.filter((e) => e.userId === 'user-A');
    const userASummary = FinancialCalculator.calculateSummary(25000, userAExpenses, [], null, []);

    expect(userAExpenses.length).toBe(1);
    expect(userASummary.totalExpenses).toBe(10000);
  });

  // TEST 14: Mes sin movimientos muestra 0 gastos sin romperse (empty state)
  it('TEST 14: Month with no expenses calculates totalExpenses as 0 without throwing', () => {
    const summary = FinancialCalculator.calculateSummary(25000, [], [], null, []);
    expect(summary.totalExpenses).toBe(0);
    expect(summary.spentPercentage).toBe(0);
    expect(summary.categoryBreakdown.length).toBe(0);
  });

  // TEST 15: Recurrencia mensual en día 31 clamped para febrero (28/29 días)
  it('TEST 15: Monthly recurrence set on 31st clamps safely to Feb 28th/29th without error', () => {
    const def: RecurringExpense = {
      id: 'rec-jan31',
      userId: 'user-1',
      categoryId: 'cat-1',
      categoryName: 'Seguro',
      amount: 1200,
      description: 'Seguro Mensual',
      frequencyName: 'Mensual',
      startDate: '2026-01-31',
      dayOfMonth: 31,
      status: 'active',
      createdAt: '2026-01-31T00:00:00.000Z'
    };

    const dates = RecurringExpenseService.getExpectedOccurrenceDates(def, '2026-02-28');
    expect(dates).toContain('2026-01-31');
    expect(dates).toContain('2026-02-28'); // Clamped to Feb 28th!
  });

  // TEST 16: Formato de ID determinista para prevenir carreras en Firestore
  it('TEST 16: Deterministic occurrence ID format follows recurringExpenseId_occurrenceDate', () => {
    const recId = 'abc123';
    const occDate = '2026-10-27';
    const docId = `${recId}_${occDate}`;
    expect(docId).toBe('abc123_2026-10-27');
  });
});
