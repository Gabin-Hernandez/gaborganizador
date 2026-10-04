import { collection, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseClient';
import { Frequency } from '@/domain/entities/Frequency';
import { IFrequencyRepository } from '@/domain/repositories/IFrequencyRepository';

export class FrequencyRepositoryFirebase implements IFrequencyRepository {
  async getFrequencies(uid: string): Promise<Frequency[]> {
    if (!uid) return [];
    const frequenciesRef = collection(db, 'users', uid, 'frequencies');
    const snap = await getDocs(frequenciesRef);
    const result: Frequency[] = [];
    snap.forEach((d) => {
      result.push({ id: d.id, ...d.data() } as Frequency);
    });
    return result;
  }

  async createFrequency(uid: string, name: string, daysInterval: number): Promise<Frequency> {
    const frequenciesRef = collection(db, 'users', uid, 'frequencies');
    const now = new Date().toISOString();
    const docRef = await addDoc(frequenciesRef, {
      userId: uid,
      name,
      daysInterval,
      isDefault: false,
      isActive: true,
      createdAt: now
    });

    return {
      id: docRef.id,
      userId: uid,
      name,
      daysInterval,
      isDefault: false,
      isActive: true,
      createdAt: now
    };
  }

  async updateFrequency(uid: string, frequencyId: string, data: Partial<Frequency>): Promise<void> {
    const freqRef = doc(db, 'users', uid, 'frequencies', frequencyId);
    await updateDoc(freqRef, data);
  }

  async deactivateFrequency(uid: string, frequencyId: string): Promise<void> {
    const freqRef = doc(db, 'users', uid, 'frequencies', frequencyId);
    await updateDoc(freqRef, { isActive: false });
  }
}
