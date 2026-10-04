import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseClient';
import { ExtraIncome } from '@/domain/entities/ExtraIncome';
import { IExtraIncomeRepository } from '@/domain/repositories/IExtraIncomeRepository';

export class ExtraIncomeRepositoryFirebase implements IExtraIncomeRepository {
  async getExtraIncomes(uid: string): Promise<ExtraIncome[]> {
    if (!uid) return [];
    const incomesRef = collection(db, 'users', uid, 'extraIncome');
    const snap = await getDocs(incomesRef);
    const incomes: ExtraIncome[] = [];
    snap.forEach((d) => {
      incomes.push({ id: d.id, ...d.data() } as ExtraIncome);
    });
    return incomes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getExtraIncomesByDateRange(uid: string, startDate: string, endDate: string): Promise<ExtraIncome[]> {
    const all = await this.getExtraIncomes(uid);
    return all.filter((inc) => inc.date >= startDate && inc.date <= endDate);
  }

  async createExtraIncome(uid: string, income: Omit<ExtraIncome, 'id' | 'userId' | 'createdAt'>): Promise<ExtraIncome> {
    const incomesRef = collection(db, 'users', uid, 'extraIncome');
    const now = new Date().toISOString();
    const payload = {
      userId: uid,
      ...income,
      createdAt: now
    };
    const docRef = await addDoc(incomesRef, payload);
    return {
      id: docRef.id,
      ...payload
    };
  }

  async updateExtraIncome(uid: string, incomeId: string, income: Partial<ExtraIncome>): Promise<void> {
    const incomeRef = doc(db, 'users', uid, 'extraIncome', incomeId);
    await updateDoc(incomeRef, income);
  }

  async deleteExtraIncome(uid: string, incomeId: string): Promise<void> {
    const incomeRef = doc(db, 'users', uid, 'extraIncome', incomeId);
    await deleteDoc(incomeRef);
  }
}
