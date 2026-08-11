import { NetworkService } from "./network.service.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";

export interface RouteUsageMetric {
    id: string;
    controllerClass: string;
    controllerMethod: string;
    httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | string;
    pattern: string;
    invocationCount: number;
    firstSeenAt: string;
    lastInvokedAt?: string | null;
}

export class RouteService extends NetworkService {
    constructor() {
        super("/metrics/routes");
    }

    /**
     * Fetches all registered route usage metrics.
     */
    public async fetchAll(): Promise<RouteUsageMetric[]> {
        try {
            return await this.get<RouteUsageMetric[]>("");
        } catch {
            return [];
        }
    }

    /**
     * Fetches all unused routes (dead code candidates with invocation count = 0).
     */
    public async fetchUnused(): Promise<RouteUsageMetric[]> {
        try {
            return await this.get<RouteUsageMetric[]>("/unused");
        } catch {
            return [];
        }
    }

    /**
     * Fetches the most frequently accessed routes sorted by invocation count descending.
     */
    public async fetchTop(): Promise<RouteUsageMetric[]> {
        try {
            return await this.get<RouteUsageMetric[]>("/top");
        } catch {
            return [];
        }
    }

    /**
     * Resets invocation metrics for a specific HTTP method and URL pattern.
     *
     * @param httpMethod HTTP method (e.g., 'GET', 'POST')
     * @param pattern Endpoint path pattern (e.g., '/api/v1/notes/{id}')
     */
    public async resetMetric(httpMethod: string, pattern: string): Promise<void> {
        if (!httpMethod || !pattern) {
            return ToastManager.toastBad("HTTP method and pattern are required.");
        }

        try {
            const queryParams = this.buildParams({ httpMethod, pattern });
            await this.put<void>(`/reset${queryParams}`);
            ToastManager.toastGood(`Metric for [${httpMethod} ${pattern}] reset successfully.`);
        } catch {
            ToastManager.toastBad(`Failed to reset metric for [${httpMethod} ${pattern}].`);
        }
    }
}

export const routeService = new RouteService();