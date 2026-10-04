import { doc, getDoc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseClient';
import { UserProfile, OnboardingData } from '@/domain/entities/UserProfile';
import { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository';
import { INITIAL_DEFAULT_CATEGORIES } from '@/domain/entities/Category';
import { DEFAULT_FREQUENCIES } from '@/domain/entities/Frequency';

export class UserProfileRepositoryFirebase implements IUserProfileRepository {
  async getProfile(uid: string): Promise<UserProfile | null> {
    if (!uid) return null;
    const profileRef = doc(db, 'users', uid, 'profile', 'main');
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  }

  async saveProfile(profile: Partial<UserProfile> & { uid: string }): Promise<void> {
    const profileRef = doc(db, 'users', profile.uid, 'profile', 'main');
    const now = new Date().toISOString();
    const existing = await getDoc(profileRef);

    if (existing.exists()) {
      await updateDoc(profileRef, {
        ...profile,
        updatedAt: now
      });
    } else {
      await setDoc(profileRef, {
        salary: 0,
        onboarded: false,
        createdAt: now,
        updatedAt: now,
        ...profile
      });
    }
  }

  async completeOnboarding(uid: string, data: OnboardingData): Promise<void> {
    const now = new Date().toISOString();

    // 1. Save salary and set onboarded = true
    const profileRef = doc(db, 'users', uid, 'profile', 'main');
    await setDoc(profileRef, {
      uid,
      salary: data.salary,
      onboarded: true,
      updatedAt: now,
      createdAt: now
    }, { merge: true });

    // 2. Initialize categories
    const categoriesRef = collection(db, 'users', uid, 'categories');
    
    // Combine initial default categories + any selected categories in onboarding
    const categoryNamesToCreate = new Set<string>();
    INITIAL_DEFAULT_CATEGORIES.forEach(c => categoryNamesToCreate.add(c.name));
    if (data.selectedCategories) {
      data.selectedCategories.forEach(c => categoryNamesToCreate.add(c));
    }

    for (const catName of Array.from(categoryNamesToCreate)) {
      const defaultIcon = INITIAL_DEFAULT_CATEGORIES.find(ic => ic.name === catName);
      await addDoc(categoriesRef, {
        userId: uid,
        name: catName,
        icon: defaultIcon?.icon || 'Tag',
        color: defaultIcon?.color || '#3b82f6',
        isDefault: true,
        isActive: true,
        createdAt: now
      });
    }

    // 3. Initialize default frequencies
    const frequenciesRef = collection(db, 'users', uid, 'frequencies');
    for (const freq of DEFAULT_FREQUENCIES) {
      await addDoc(frequenciesRef, {
        userId: uid,
        ...freq,
        createdAt: now
      });
    }

    // 4. Create recurring expenses if user indicated recurring expenses during onboarding
    if (data.hasRecurringExpenses && data.recurringExpenses && data.recurringExpenses.length > 0) {
      const expensesRef = collection(db, 'users', uid, 'expenses');
      for (const rec of data.recurringExpenses) {
        await addDoc(expensesRef, {
          userId: uid,
          categoryId: '',
          categoryName: rec.categoryName,
          amount: 0, // Initial placeholder amount for recurring item configured in onboarding
          description: `Gasto recurrente: ${rec.categoryName}`,
          date: now.split('T')[0],
          isRecurring: true,
          frequencyName: rec.frequencyName,
          createdAt: now
        });
      }
    }
  }

  async updateSalary(uid: string, salary: number): Promise<void> {
    const profileRef = doc(db, 'users', uid, 'profile', 'main');
    const now = new Date().toISOString();
    await updateDoc(profileRef, {
      salary,
      updatedAt: now
    });
  }
}
