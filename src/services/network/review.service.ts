import { CreateReviewRequest, ReviewModel } from "../../models/review.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { NetworkService } from "./network.service.ts";

export class ReviewService extends NetworkService {
  constructor() {
    super("/reviews");
  }

  public async fetchAll(archived: boolean = false): Promise<ReviewModel[]> {
    try {
      const params = this.buildParams({ archived });
      return await this.get<ReviewModel[]>(params);
    } catch {
      return [];
    }
  }

  public async create(payload: CreateReviewRequest): Promise<void> {
    await this.post<void, CreateReviewRequest>("", payload);
    ToastManager.toastGood(
      `Review ${payload.ticketNumber} created successfully.`,
    );
  }

  public async update(id: string, payload: CreateReviewRequest): Promise<void> {
    if (!id) {
      ToastManager.toastBad("The Review ID is missing!");
      return;
    }

    await this.put<ReviewModel, CreateReviewRequest>(
      `/${encodeURIComponent(id)}`,
      payload,
    );
    ToastManager.toastGood(
      `Review ${payload.ticketNumber} updated successfully.`,
    );
  }

  public async toggleArchive(id: string): Promise<void> {
    if (!id) {
      ToastManager.toastBad("The Review ID is missing!");
      return;
    }

    await this.patch<ReviewModel>(`/${encodeURIComponent(id)}/archive`);
    ToastManager.toastGood("Review archive status updated successfully.");
  }

  public async deleteById(id: string): Promise<void> {
    if (!id) {
      ToastManager.toastBad("The Review ID is missing!");
      return;
    }

    await this.delete<void>(`/${encodeURIComponent(id)}`);
    ToastManager.toastGood("Review deleted successfully.");
  }
}

export const reviewService = new ReviewService();
