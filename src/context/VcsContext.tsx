import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GitLabRepository } from "../models/vcs.model.ts";
import { vcsService } from "../services/network/vcs.service.ts";
import { useSettings } from "./SettingsContext.tsx";

interface VcsContextType {
  vcsLink: string;
  repos: GitLabRepository[];
  fetchRepos: () => Promise<void>;
  fetchPipeline: () => Promise<void>;
  fetchMergeRequests: () => Promise<void>;
}

const VcsContext = createContext<VcsContextType | undefined>(undefined);

export const VcsProvider: React.FC<{ children: ReactNode }> = ({
                                                                 children,
                                                               }) => {
  const { hasVcsKey } = useSettings();
  const vcsLink: string = "git/";
  const [repos, setRepos] = useState<GitLabRepository[]>([]);

  const fetchRepos = useCallback(async () => {
    // 🛑 Guard: Nicht fetchen, wenn kein VCS Key konfiguriert ist
    if (!hasVcsKey) {
      setRepos([]);
      return;
    }

    try {
      const data = await vcsService.fetchRepos();
      setRepos(data || []);
    } catch (error) {
      console.error("Failed to fetch repos:", error);
    }
  }, [hasVcsKey]);

  const fetchPipeline = useCallback(async () => {}, []);
  const fetchMergeRequests = useCallback(async () => {}, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const contextValue = useMemo<VcsContextType>(
      () => ({
        vcsLink,
        repos,
        fetchRepos,
        fetchMergeRequests,
        fetchPipeline,
      }),
      [vcsLink, repos, fetchRepos, fetchMergeRequests, fetchPipeline],
  );

  return (
      <VcsContext.Provider value={contextValue}>{children}</VcsContext.Provider>
  );
};

export const useVCS = (): VcsContextType => {
  const context = useContext(VcsContext);
  if (!context) {
    throw new Error("useVCS must be used within a VcsProvider");
  }
  return context;
};