import { RecurringExpense } from '../entities/RecurringExpense';
import { Expense } from '../entities/Expense';

export class RecurringExpenseService {
  /**
   * Given a target date or period (e.g. up to current date or end of selected month YYYY-MM),
   * calculates all expected occurrence dates for a RecurringExpense definition.
   */
  static getExpectedOccurrenceDates(
    def: RecurringExpense,
    untilDateStr: string // YYYY-MM-DD
  ): string[] {
    if (def.status !== 'active') return [];

    const dates: string[] = [];
    const startDate = new Date(def.startDate + 'T00:00:00');
    const untilDate = new Date(untilDateStr + 'T23:59:59');

    if (isNaN(startDate.getTime()) || isNaN(untilDate.getTime())) return [];
    if (startDate > untilDate) return [];

    const endDate = def.endDate ? new Date(def.endDate + 'T23:59:59') : null;
    const effectiveUntil = endDate && endDate < untilDate ? endDate : untilDate;

    const freq = (def.frequencyName || 'Mensual').toLowerCase();

    if (freq.includes('mensual')) {
      // Monthly recurrence
      let currentYear = startDate.getFullYear();
      let currentMonth = startDate.getMonth(); // 0-based
      const targetDay = def.dayOfMonth || startDate.getDate();

      const limitYear = effectiveUntil.getFullYear();
      const limitMonth = effectiveUntil.getMonth();

      while (
        currentYear < limitYear ||
        (currentYear === limitYear && currentMonth <= limitMonth)
      ) {
        // Calculate max days in currentMonth
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const actualDay = Math.min(targetDay, daysInMonth);

        const occDate = new Date(currentYear, currentMonth, actualDay);
        if (occDate >= startDate && occDate <= effectiveUntil) {
          const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(actualDay).padStart(2, '0')}`;
          dates.push(formatted);
        }

        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
      }
    } else if (freq.includes('semanal')) {
      // Weekly recurrence (every 7 days)
      const current = new Date(startDate);
      while (current <= effectiveUntil) {
        const formatted = current.toISOString().split('T')[0];
        dates.push(formatted);
        current.setDate(current.getDate() + 7);
      }
    } else if (freq.includes('quincenal')) {
      // Quincenal recurrence (every 14 days)
      const current = new Date(startDate);
      while (current <= effectiveUntil) {
        const formatted = current.toISOString().split('T')[0];
        dates.push(formatted);
        current.setDate(current.getDate() + 14);
      }
    } else if (freq.includes('diario')) {
      // Daily recurrence (every day)
      const current = new Date(startDate);
      while (current <= effectiveUntil) {
        const formatted = current.toISOString().split('T')[0];
        dates.push(formatted);
        current.setDate(current.getDate() + 1);
      }
    }

    return dates;
  }

  /**
   * Filters out occurrence dates that ALREADY exist in existingExpenses.
   * Ensures IDEMPOTENCY.
   */
  static getMissingOccurrences(
    def: RecurringExpense,
    existingExpenses: Expense[],
    untilDateStr: string
  ): Omit<Expense, 'id' | 'userId' | 'createdAt'>[] {
    const expectedDates = this.getExpectedOccurrenceDates(def, untilDateStr);
    const missing: Omit<Expense, 'id' | 'userId' | 'createdAt'>[] = [];

    // Map of existing occurrences by recurringExpenseId + occurrenceDate (or date)
    const existingSet = new Set<string>();
    existingExpenses.forEach((exp) => {
      if (exp.recurringExpenseId === def.id && (exp.occurrenceDate || exp.date)) {
        existingSet.add(exp.occurrenceDate || exp.date);
      }
    });

    for (const occDateStr of expectedDates) {
      if (!existingSet.has(occDateStr)) {
        missing.push({
          categoryId: def.categoryId,
          categoryName: def.categoryName,
          amount: def.amount,
          description: def.description,
          date: occDateStr,
          expenseDate: occDateStr,
          isRecurring: true,
          frequencyName: def.frequencyName,
          recurringExpenseId: def.id,
          occurrenceDate: occDateStr
        });
      }
    }

    return missing;
  }
}
