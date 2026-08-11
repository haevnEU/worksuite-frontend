import { ValidationSchema } from "../../models/validationSchema.model.ts";
import { NetworkService } from "./network.service.ts";

export class ValidationService extends NetworkService {
  constructor() {
    super("/validation");
  }

  public async generateXml(schema: ValidationSchema): Promise<string> {
    try {
      return await this.post<string, ValidationSchema>("", schema, {
        headers: {
          Accept: "application/xml, text/plain, */*",
        },
      });
    } catch (error) {
      console.error("Failed to generate XML schema from backend:", error);
      throw error;
    }
  }
}

export const validationService = new ValidationService();
