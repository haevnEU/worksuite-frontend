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
  login: (token: string, user: UserModel) => void;
  logout: () => void;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                        children,
                                                                      }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialer Restore beim App-Start
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: UserModel) => {
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  }, []);

  const changePassword = useCallback(
      async (currentPassword: string, newPassword: string) => {
        await fetch("/api/v1/user-service/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user?.id,
            currentPassword,
            newPassword,
          }),
        });
      },
      [token, user?.id],
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
        login,
        logout,
        changePassword,
        register,
      }),
      [user, token, isLoading, login, logout, changePassword, register],
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