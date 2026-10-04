export interface UserProfile {
  uid: string;
  email: string;
  salary: number;
  onboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingData {
  salary: number;
  selectedCategories: string[];
  hasRecurringExpenses: boolean;
  recurringExpenses?: {
    categoryName: string;
    frequencyName: string;
  }[];
}
