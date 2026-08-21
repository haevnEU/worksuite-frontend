import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserModel } from "../models/user.model.ts";

interface AuthContextType {
  user: UserModel | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isReauthRequired: boolean;
  setIsReauthRequired: (required: boolean) => void;
  login: (token: string, user: UserModel) => void;
  logout: () => void;
  reauth: (password: string) => Promise<void>;
  updateToken: (newToken: string) => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  register: (
    username: string,
    password: string,
    firstname: string,
    lastname: string,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Utility: Prüft, ob ein JWT-Token abgelaufen ist
 */
export const isTokenExpired = (jwtToken: string | null): boolean => {
  if (!jwtToken) return true;
  try {
    const parts = jwtToken.split(".");
    if (parts.length !== 3) return true;

    // Base64URL decodieren
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (!payload.exp) return false;

    // exp ist in Sekunden, Date.now() in Millisekunden
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= currentTimeInSeconds;
  } catch {
    return true;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReauthRequired, setIsReauthRequired] = useState<boolean>(false);

  // Initialer Restore beim App-Start
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);

        // Prüfen, ob das gespeicherte Token bereits abgelaufen ist
        if (isTokenExpired(storedToken)) {
          setIsReauthRequired(true);
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Zyklischer Check zur Laufzeit (alle 15 Sekunden)
  useEffect(() => {
    if (!token) {
      setIsReauthRequired(false);
      return;
    }

    const checkTokenValidity = () => {
      if (isTokenExpired(token)) {
        setIsReauthRequired(true);
      }
    };

    // Sofort und periodisch ausführen
    checkTokenValidity();
    const intervalId = setInterval(checkTokenValidity, 15_000);

    return () => clearInterval(intervalId);
  }, [token]);

  const login = useCallback((newToken: string, newUser: UserModel) => {
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsReauthRequired(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    setIsReauthRequired(false);
  }, []);

  const updateToken = useCallback((newToken: string) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    setIsReauthRequired(false);
  }, []);

  // Re-Authentication mit Passwort
  const reauth = useCallback(
    async (password: string): Promise<void> => {
      if (!user) {
        throw new Error("No user found to re-authenticate.");
      }

      const userId = user.id;

      const response = await fetch("/api/v1/user-service/login/id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid password");
      }

      const data = await response.json();
      const newToken = data.token || data.accessToken;

      if (newToken) {
        localStorage.setItem("access_token", newToken);
        setToken(newToken);
        setIsReauthRequired(false);
      }
    },
    [user],
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const username = (user as any)?.username || (user as any)?.email;

      await fetch("/api/v1/user-service/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword,
        }),
      });
    },
    [token, user],
  );

  const register = useCallback(
    async (
      username: string,
      password: string,
      firstname: string,
      lastname: string,
    ): Promise<void> => {
      const response = await fetch("/api/v1/user-service/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          firstname,
          lastname,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }
    },
    [],
  );

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      isReauthRequired,
      setIsReauthRequired,
      login,
      logout,
      reauth,
      updateToken,
      changePassword,
      register,
    }),
    [
      user,
      token,
      isLoading,
      isReauthRequired,
      login,
      logout,
      reauth,
      updateToken,
      changePassword,
      register,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
