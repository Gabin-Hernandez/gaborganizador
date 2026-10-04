import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseClient';
import { InvestmentConfig, InvestmentContribution } from '@/domain/entities/InvestmentConfig';
import { IInvestmentRepository } from '@/domain/repositories/IInvestmentRepository';

export class InvestmentRepositoryFirebase implements IInvestmentRepository {
  async getInvestmentConfig(uid: string): Promise<InvestmentConfig | null> {
    if (!uid) return null;
    const configRef = doc(db, 'users', uid, 'investmentConfig', 'main');
    const snap = await getDoc(configRef);
    if (snap.exists()) {
      return snap.data() as InvestmentConfig;
    }
    return null;
  }

  async saveInvestmentConfig(
    uid: string,
    config: Omit<InvestmentConfig, 'userId' | 'updatedAt'>
  ): Promise<InvestmentConfig> {
    const configRef = doc(db, 'users', uid, 'investmentConfig', 'main');
    const now = new Date().toISOString();
    const payload: InvestmentConfig = {
      userId: uid,
      type: config.type,
      value: config.value,
      updatedAt: now
    };
    await setDoc(configRef, payload);
    return payload;
  }

  async getInvestmentContributions(uid: string): Promise<InvestmentContribution[]> {
    if (!uid) return [];
    const contribRef = collection(db, 'users', uid, 'investmentContributions');
    const snap = await getDocs(contribRef);
    const result: InvestmentContribution[] = [];
    snap.forEach((d) => {
      result.push({ id: d.id, ...d.data() } as InvestmentContribution);
    });
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addInvestmentContribution(
    uid: string,
    contribution: Omit<InvestmentContribution, 'id' | 'userId' | 'createdAt'>
  ): Promise<InvestmentContribution> {
    const contribRef = collection(db, 'users', uid, 'investmentContributions');
    const now = new Date().toISOString();
    const payload = {
      userId: uid,
      ...contribution,
      createdAt: now
    };
    const docRef = await addDoc(contribRef, payload);
    return {
      id: docRef.id,
      ...payload
    };
  }

  async deleteInvestmentContribution(uid: string, contributionId: string): Promise<void> {
    const contribRef = doc(db, 'users', uid, 'investmentContributions', contributionId);
    await deleteDoc(contribRef);
  }
}
