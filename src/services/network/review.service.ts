import { NetworkService } from "./network.service.ts";
import { CreateReviewRequest, ReviewModel } from "../../models/review.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";

export class ReviewService extends NetworkService {
  constructor() {
    super("/reviews");
  }

  public async fetchAll(archived: boolean = false): Promise<ReviewModel[]> {
    try {
      console.log(
        `[ReviewService] Fetching all reviews (archived: ${archived})...`,
      );
      const params = this.buildParams({ archived });
      return await this.get<ReviewModel[]>(`${params}`);
    } catch (error) {
      ToastManager.toastBad("Could not fetch reviews");
      console.error("[ReviewService] Error fetching reviews:", error);
      return [];
    }
  }

  public async create(payload: CreateReviewRequest): Promise<void> {
    try {
      console.log("[ReviewService] Creating review:", payload);
      await this.post<void, CreateReviewRequest>("", payload);
      ToastManager.toastGood(
        `Review ${payload.ticketNumber} created successfully.`,
      );
    } catch (error) {
      ToastManager.toastBad("Could not create review");
      console.error("[ReviewService] Error creating review:", error);
    }
  }

  public async update(id: string, payload: CreateReviewRequest): Promise<void> {
    try {
      console.log(`[ReviewService] Updating review with id: ${id}`, payload);
      if (!id) {
        ToastManager.toastBad("The Review ID is missing!");
      }
      await this.put<ReviewModel, CreateReviewRequest>(`/${id}`, payload);
      ToastManager.toastGood(
        `Review ${payload.ticketNumber} updated successfully.`,
      );
    } catch (error) {
      ToastManager.toastBad(`Could not update review with id ${id}`);
      console.error(
        `[ReviewService] Error updating review with id ${id}:`,
        error,
      );
    }
  }

  public async toggleArchive(id: string): Promise<void> {
    try {
      console.log(
        `[ReviewService] Toggling archive state for review id: ${id}`,
      );
      if (!id) {
        ToastManager.toastBad("The Review ID is missing!");
        return;
      }

      await this.executeRequest<ReviewModel>(`/${id}/archive`, {
        method: "PATCH",
      });

      ToastManager.toastGood(`Review archived successfully.`);
    } catch (error) {
      ToastManager.toastBad(`Could not update archive status for review ${id}`);
      console.error(
        `[ReviewService] Error toggling archive for review ${id}:`,
        error,
      );
    }
  }

  public async deleteById(id: string): Promise<void> {
    try {
      console.log(`[ReviewService] Deleting review with id: ${id}`);
      if (!id) {
        ToastManager.toastBad("The Review ID is missing!");
      }

      await this.delete<void>(`/${id}`);
      ToastManager.toastGood("Review deleted successfully.");
    } catch (error) {
      ToastManager.toastBad(`Could not delete review with id ${id}`);
      console.error(`[ReviewService] Error deleting review ${id}:`, error);
    }
  }
}

export const reviewService = new ReviewService();
