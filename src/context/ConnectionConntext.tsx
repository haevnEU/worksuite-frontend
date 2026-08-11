import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ConnectionStatus } from "../types/PushService.type";
import { pushService } from "../services/push/push.service.ts";

interface ConnectionContextType {
  isConnected: boolean;
  pushStatus: ConnectionStatus;
  retryConnection: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined,
);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pushStatus, setPushStatus] = useState<ConnectionStatus>(
    pushService.getStatus(),
  );

  useEffect(() => {
    const unsubscribe = pushService.subscribeStatus((status) => {
      setPushStatus(status);
    });

    return () => unsubscribe();
  }, []);

  const isConnected = pushStatus === "connected";

  const retryConnection = useCallback(() => {
    pushService.connect();
  }, []);

  const contextValue = useMemo<ConnectionContextType>(
    () => ({
      isConnected,
      pushStatus,
      retryConnection,
    }),
    [isConnected, pushStatus, retryConnection],
  );

  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};
