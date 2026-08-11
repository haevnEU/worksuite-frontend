import { NetworkService } from "./network.service.ts";

export interface GenerateMockPayload {
  amount: number;
}

export class MockService extends NetworkService {
  constructor() {
    super("/mock");
  }

  public async fetchMockTypes(): Promise<string[]> {
    try {
      const types = await this.get<string[]>("");
      return types || [];
    } catch {
      return [];
    }
  }

  public async generateMockData(type: string, amount: number): Promise<string> {
    try {
      return await this.post<string, GenerateMockPayload>(
        `/${encodeURIComponent(type)}`,
        { amount },
      );
    } catch (error) {
      console.error(`Failed to generate mock data for '${type}':`, error);
      throw error;
    }
  }
}

export const mockService = new MockService();
