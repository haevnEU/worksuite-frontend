import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { GitLabRepository } from "../models/vcs.model.ts";
import { vcsService } from "../services/network/vcs.service.ts";

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
  const vcsLink: string = "git/";
  const [repos, setRepos] = useState<GitLabRepository[]>([]);

  const fetchRepos = useCallback(async () => {
    try {
      const data = await vcsService.fetchRepos();
      setRepos(data || []);
    } catch (error) {
      console.error("Failed to fetch repos:", error);
    }
  }, []);

  const fetchPipeline = useCallback(async () => {}, []);
  const fetchMergeRequests = useCallback(async () => {}, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return (
    <VcsContext.Provider
      value={{
        vcsLink,
        repos,
        fetchRepos,
        fetchMergeRequests,
        fetchPipeline,
      }}
    >
      {children}
    </VcsContext.Provider>
  );
};

export const useVCS = (): VcsContextType => {
  const context = useContext(VcsContext);
  if (!context) {
    throw new Error("useVCS must be used within a VcsProvider");
  }
  return context;
};
