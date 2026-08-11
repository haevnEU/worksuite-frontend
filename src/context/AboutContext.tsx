import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { aboutService } from "../services/network/about.service.ts";
import { AboutSystemInfo } from "../models/about.model.ts";

interface AboutContextType {
  systemInfo: AboutSystemInfo | null;
  isLoading: boolean;
  error: string | null;
  refreshSystemInfo: () => Promise<void>;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

export const AboutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [systemInfo, setSystemInfo] = useState<AboutSystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSystemInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await aboutService.fetchSystemInfo();
      setSystemInfo(data);
    } catch (err: any) {
      setError(err.message || "Failed to load system telemetry data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSystemInfo();
  }, [refreshSystemInfo]);

  return (
    <AboutContext.Provider
      value={{
        systemInfo,
        isLoading,
        error,
        refreshSystemInfo,
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
