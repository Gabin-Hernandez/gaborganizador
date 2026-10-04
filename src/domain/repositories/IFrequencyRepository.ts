import { Frequency } from '../entities/Frequency';

export interface IFrequencyRepository {
  getFrequencies(uid: string): Promise<Frequency[]>;
  createFrequency(uid: string, name: string, daysInterval: number): Promise<Frequency>;
  updateFrequency(uid: string, frequencyId: string, data: Partial<Frequency>): Promise<void>;
  deactivateFrequency(uid: string, frequencyId: string): Promise<void>;
}
