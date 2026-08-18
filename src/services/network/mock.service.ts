import { NetworkService } from "./network.service.ts";
import { MockResponse } from "../../models/mock.model.ts";

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

  public async generateMockData(
    type: string,
    amount: number,
  ): Promise<MockResponse> {
    try {
      const queryParam = new URLSearchParams({
        amount: amount.toString(),
      }).toString();
      return await this.get<MockResponse>(
        `/${encodeURIComponent(type)}?${queryParam}`,
      );
    } catch (error) {
      console.error(`Failed to generate mock data for '${type}':`, error);
      throw error;
    }
  }
}

export const mockService = new MockService();
