import { collection, getDocs, doc, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from './firebaseClient';
import { Category } from '@/domain/entities/Category';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';

export class CategoryRepositoryFirebase implements ICategoryRepository {
  async getCategories(uid: string): Promise<Category[]> {
    if (!uid) return [];
    const categoriesRef = collection(db, 'users', uid, 'categories');
    const snap = await getDocs(categoriesRef);
    const categories: Category[] = [];
    snap.forEach((d) => {
      categories.push({ id: d.id, ...d.data() } as Category);
    });
    return categories;
  }

  async createCategory(uid: string, name: string, icon = 'Tag', color = '#3b82f6'): Promise<Category> {
    const categoriesRef = collection(db, 'users', uid, 'categories');
    const now = new Date().toISOString();
    const docRef = await addDoc(categoriesRef, {
      userId: uid,
      name,
      icon,
      color,
      isDefault: false,
      isActive: true,
      createdAt: now
    });

    return {
      id: docRef.id,
      userId: uid,
      name,
      icon,
      color,
      isDefault: false,
      isActive: true,
      createdAt: now
    };
  }

  async updateCategory(uid: string, categoryId: string, data: Partial<Category>): Promise<void> {
    const categoryRef = doc(db, 'users', uid, 'categories', categoryId);
    await updateDoc(categoryRef, data);
  }

  async deactivateCategory(uid: string, categoryId: string): Promise<void> {
    const categoryRef = doc(db, 'users', uid, 'categories', categoryId);
    await updateDoc(categoryRef, { isActive: false });
  }

  async deleteCategoryIfUnused(uid: string, categoryId: string): Promise<boolean> {
    // Check if expenses exist for this category
    const expensesRef = collection(db, 'users', uid, 'expenses');
    const q = query(expensesRef, where('categoryId', '==', categoryId));
    const snap = await getDocs(q);

    if (!snap.empty) {
      // Deactivate instead of deleting to preserve history
      await this.deactivateCategory(uid, categoryId);
      return false; // Not hard deleted
    }

    // Hard delete if safe
    const categoryRef = doc(db, 'users', uid, 'categories', categoryId);
    await updateDoc(categoryRef, { isActive: false });
    return true;
  }
}
