import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import {aboutService} from "../services/about.service.ts";
import {AboutSystemInfo} from "../model/about.model.ts";
import {routeService, RouteUsageMetric} from "../services/route.service.ts";


interface AboutContextType {
    systemInfo: AboutSystemInfo | null;
    isLoading: boolean;
    error: string | null;
    clientUptime: number;
    routeMetrics: RouteUsageMetric[];
    isLoadingRoutes: boolean;
    refreshSystemInfo: () => Promise<void>;
    refreshRouteMetrics: () => Promise<void>;
    resetRouteMetric: (httpMethod: string, pattern: string) => Promise<void>;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

export const AboutProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                           children,
                                                                       }) => {
    const [systemInfo, setSystemInfo] = useState<AboutSystemInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [clientUptime, setClientUptime] = useState<number>(0);

    const [routeMetrics, setRouteMetrics] = useState<RouteUsageMetric[]>([]);
    const [isLoadingRoutes, setIsLoadingRoutes] = useState<boolean>(false);

    // Client Session Uptime Timer
    useEffect(() => {
        const timer = setInterval(() => setClientUptime((prev) => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const refreshSystemInfo = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await aboutService.fetchSystemInfo();
            setSystemInfo(data);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to load system telemetry data.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshRouteMetrics = useCallback(async () => {
        setIsLoadingRoutes(true);
        try {
            const data = await routeService.fetchAll();
            setRouteMetrics(data || []);
        } catch (err) {
            console.error("[AboutContext] Failed to load route metrics:", err);
        } finally {
            setIsLoadingRoutes(false);
        }
    }, []);

    const resetRouteMetric = useCallback(
        async (httpMethod: string, pattern: string) => {
            await routeService.resetMetric(httpMethod, pattern);
            await refreshRouteMetrics();
        },
        [refreshRouteMetrics],
    );

    useEffect(() => {
        refreshSystemInfo();
        refreshRouteMetrics();
    }, [refreshSystemInfo, refreshRouteMetrics]);

    return (
        <AboutContext.Provider
            value={{
                systemInfo,
                isLoading,
                error,
                clientUptime,
                routeMetrics,
                isLoadingRoutes,
                refreshSystemInfo,
                refreshRouteMetrics,
                resetRouteMetric,
            }}
        >
            {children}
        </AboutContext.Provider>
    );
};

export const useAbout = (): AboutContextType => {
    const context = useContext(AboutContext);
    if (!context) {
        throw new Error("useAbout must be used within an AboutProvider");
    }
    return context;
};