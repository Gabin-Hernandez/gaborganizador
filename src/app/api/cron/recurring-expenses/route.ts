import { NextResponse } from 'next/server';
import { RecurringExpenseRepositoryFirebase } from '@/infrastructure/firebase/recurringExpenseRepositoryFirebase';
import { ExpenseRepositoryFirebase } from '@/infrastructure/firebase/expenseRepositoryFirebase';
import { RecurringExpenseService } from '@/domain/services/RecurringExpenseService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Verify optional authorization secret if configured
    const authHeader = request.headers.get('authorization');
    const secret = process.env.CRON_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recRepo = new RecurringExpenseRepositoryFirebase();
    const expRepo = new ExpenseRepositoryFirebase();

    // 1. Fetch all active recurring expense definitions
    const activeRecs = await recRepo.getAllActiveRecurringExpenses();

    const todayStr = new Date().toISOString().split('T')[0];
    let createdCount = 0;

    // 2. Iterate through each active recurring expense definition
    for (const rec of activeRecs) {
      if (!rec.userId) continue;

      // Fetch user's current expenses
      const existingExpenses = await expRepo.getExpenses(rec.userId);

      // Determine missing occurrence dates up to today
      const missingOccurrences = RecurringExpenseService.getMissingOccurrences(rec, existingExpenses, todayStr);

      // Persist missing occurrences atomically using deterministic document IDs
      for (const occ of missingOccurrences) {
        await expRepo.createExpense(rec.userId, occ);
        createdCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Weekly recurring expenses run completed successfully`,
      activeDefinitionsCount: activeRecs.length,
      createdOccurrencesCount: createdCount,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error in weekly recurring expenses cron job:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
