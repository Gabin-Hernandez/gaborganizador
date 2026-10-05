import { collection, getDocs, doc, addDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebaseClient';
import { Expense } from '@/domain/entities/Expense';
import { IExpenseRepository } from '@/domain/repositories/IExpenseRepository';

export class ExpenseRepositoryFirebase implements IExpenseRepository {
  async getExpenses(uid: string): Promise<Expense[]> {
    if (!uid) return [];
    const expensesRef = collection(db, 'users', uid, 'expenses');
    const snap = await getDocs(expensesRef);
    const expenses: Expense[] = [];
    snap.forEach((d) => {
      expenses.push({ id: d.id, ...d.data() } as Expense);
    });
    return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getExpensesByDateRange(uid: string, startDate: string, endDate: string): Promise<Expense[]> {
    const all = await this.getExpenses(uid);
    return all.filter((exp) => exp.date >= startDate && exp.date <= endDate);
  }

  async createExpense(uid: string, expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<Expense> {
    const expensesRef = collection(db, 'users', uid, 'expenses');
    const now = new Date().toISOString();
    const payload = {
      userId: uid,
      ...expense,
      createdAt: now
    };

    // If occurrence has a deterministic recurring ID and date, enforce Firestore document ID determinism
    if (expense.recurringExpenseId && expense.occurrenceDate) {
      const deterministicId = `${expense.recurringExpenseId}_${expense.occurrenceDate}`;
      const docRef = doc(db, 'users', uid, 'expenses', deterministicId);
      await setDoc(docRef, payload, { merge: true });
      return {
        id: deterministicId,
        ...payload
      };
    }

    const docRef = await addDoc(expensesRef, payload);
    return {
      id: docRef.id,
      ...payload
    };
  }

  async updateExpense(uid: string, expenseId: string, expense: Partial<Expense>): Promise<void> {
    const expenseRef = doc(db, 'users', uid, 'expenses', expenseId);
    await updateDoc(expenseRef, expense);
  }

  async deleteExpense(uid: string, expenseId: string): Promise<void> {
    const expenseRef = doc(db, 'users', uid, 'expenses', expenseId);
    await deleteDoc(expenseRef);
  }

  async hasExpensesWithCategory(uid: string, categoryId: string): Promise<boolean> {
    const expensesRef = collection(db, 'users', uid, 'expenses');
    const q = query(expensesRef, where('categoryId', '==', categoryId));
    const snap = await getDocs(q);
    return !snap.empty;
  }
}
