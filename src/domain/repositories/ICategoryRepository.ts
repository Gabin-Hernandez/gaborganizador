import { Category } from '../entities/Category';

export interface ICategoryRepository {
  getCategories(uid: string): Promise<Category[]>;
  createCategory(uid: string, name: string, icon?: string, color?: string): Promise<Category>;
  updateCategory(uid: string, categoryId: string, data: Partial<Category>): Promise<void>;
  deactivateCategory(uid: string, categoryId: string): Promise<void>;
  deleteCategoryIfUnused(uid: string, categoryId: string): Promise<boolean>;
}
