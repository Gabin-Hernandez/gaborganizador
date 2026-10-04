import { UserProfile, OnboardingData } from '../entities/UserProfile';

export interface IUserProfileRepository {
  getProfile(uid: string): Promise<UserProfile | null>;
  saveProfile(profile: Partial<UserProfile> & { uid: string }): Promise<void>;
  completeOnboarding(uid: string, data: OnboardingData): Promise<void>;
  updateSalary(uid: string, salary: number): Promise<void>;
}
