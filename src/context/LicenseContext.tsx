import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { licenseService } from "../services/network/license.service.ts";
import { LicenseStatusResponse } from "../models/license.model.ts";
import { useAuth } from "./AuthContext.tsx";

export type LicensePlan = "NONE" | "COMMUNITY" | "PRO" | "ENTERPRISE";

const PLAN_HIERARCHY: Record<LicensePlan, number> = {
  NONE: 0,
  COMMUNITY: 1,
  PRO: 2,
  ENTERPRISE: 3,
};

interface LicenseContextType {
  license: LicenseStatusResponse | null;
  plan: LicensePlan;
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
  refreshLicense: () => Promise<void>;
  renewLicense: (key: string) => Promise<LicenseStatusResponse>;
  hasAccess: (minPlan: LicensePlan) => boolean;
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

export const LicenseProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                           children,
                                                                         }) => {
  const { token, isAuthenticated } = useAuth();
  const [license, setLicense] = useState<LicenseStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshLicense = useCallback(async () => {
    // 🛑 Wenn nicht authentifiziert, State leeren und keinen Request senden
    if (!token || !isAuthenticated) {
      setLicense(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await licenseService.getStatus();
      setLicense(data);
    } catch (err: any) {
      setError(err.message || "Failed to load license.");
      setLicense(null);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated]);

  // 🔄 Bei Login, Logout oder Token-Wechsel Lizenz neu synchronisieren
  useEffect(() => {
    refreshLicense();
  }, [refreshLicense]);

  const renewLicense = async (key: string): Promise<LicenseStatusResponse> => {
    const updated = await licenseService.renewLicense(key);
    setLicense(updated);
    return updated;
  };

  // Fallback ist "NONE", falls keine Lizenz vorliegt oder kein User eingeloggt ist
  const plan: LicensePlan =
      (license?.plan?.toUpperCase() as LicensePlan) || (isAuthenticated ? "COMMUNITY" : "NONE");
  const isValid = license?.valid ?? false;

  const hasAccess = useCallback(
      (minPlan: LicensePlan): boolean => {
        if (!isAuthenticated || !isValid) return false;
        const userLevel = PLAN_HIERARCHY[plan] || 0;
        const requiredLevel = PLAN_HIERARCHY[minPlan] || 1;
        return userLevel >= requiredLevel;
      },
      [plan, isAuthenticated, isValid],
  );

  return (
      <LicenseContext.Provider
          value={{
            license,
            plan,
            isValid,
            isLoading,
            error,
            refreshLicense,
            renewLicense,
            hasAccess,
          }}
      >
        {children}
      </LicenseContext.Provider>
  );
};

export const useLicense = (): LicenseContextType => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error("useLicense must be used within a LicenseProvider");
  }
  return context;
};