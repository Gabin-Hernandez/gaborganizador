import { collection, getDocs, doc, addDoc, updateDoc, query, where, getDoc, collectionGroup } from 'firebase/firestore';
import { db } from './firebaseClient';
import { RecurringExpense } from '@/domain/entities/RecurringExpense';
import { IRecurringExpenseRepository } from '@/domain/repositories/IRecurringExpenseRepository';

export class RecurringExpenseRepositoryFirebase implements IRecurringExpenseRepository {
  async getRecurringExpenses(uid: string): Promise<RecurringExpense[]> {
    if (!uid) return [];
    const ref = collection(db, 'users', uid, 'recurring_expenses');
    const snap = await getDocs(ref);
    const items: RecurringExpense[] = [];
    snap.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as RecurringExpense);
    });
    return items;
  }

  async getRecurringExpenseById(uid: string, id: string): Promise<RecurringExpense | null> {
    if (!uid || !id) return null;
    const ref = doc(db, 'users', uid, 'recurring_expenses', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as RecurringExpense;
  }

  async createRecurringExpense(uid: string, data: Omit<RecurringExpense, 'id' | 'userId' | 'createdAt'>): Promise<RecurringExpense> {
    const ref = collection(db, 'users', uid, 'recurring_expenses');
    const now = new Date().toISOString();
    const payload = {
      userId: uid,
      ...data,
      createdAt: now
    };
    const docRef = await addDoc(ref, payload);
    return {
      id: docRef.id,
      ...payload
    };
  }

  async updateRecurringExpense(uid: string, id: string, data: Partial<RecurringExpense>): Promise<void> {
    const ref = doc(db, 'users', uid, 'recurring_expenses', id);
    const updatedAt = new Date().toISOString();
    await updateDoc(ref, { ...data, updatedAt });
  }

  async deleteRecurringExpense(uid: string, id: string): Promise<void> {
    const ref = doc(db, 'users', uid, 'recurring_expenses', id);
    await updateDoc(ref, { status: 'ended', updatedAt: new Date().toISOString() });
  }

  async getAllActiveRecurringExpenses(): Promise<RecurringExpense[]> {
    try {
      const q = query(collectionGroup(db, 'recurring_expenses'), where('status', '==', 'active'));
      const snap = await getDocs(q);
      const items: RecurringExpense[] = [];
      snap.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as RecurringExpense);
      });
      return items;
    } catch {
      return [];
    }
  }
}
