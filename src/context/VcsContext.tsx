import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GitLabRepository,
  MergeRequestModel,
  ProtectedBranchPipeline,
} from "../models/vcs.model.ts";
import { vcsService } from "../services/network/vcs.service.ts";
import { useSettings } from "./SettingsContext.tsx";
import {VCS_URL} from "../constants/url.constant.ts";

interface VcsContextType {
  vcsLink: string;
  repos: GitLabRepository[];
  myMrs: MergeRequestModel[];
  pendingReviews: MergeRequestModel[];
  pipelines: ProtectedBranchPipeline[];
  isLoading: boolean;
  isRefreshing: boolean;
  fetchRepos: () => Promise<void>;
  fetchVscData: (isBackground?: boolean) => Promise<void>;
  fetchAll: (isBackground?: boolean) => Promise<void>;
}

const VcsContext = createContext<VcsContextType | undefined>(undefined);

export const VcsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { hasVcsKey, vcsProvider } = useSettings();
  const vcsLink: string = VCS_URL;

  const [repos, setRepos] = useState<GitLabRepository[]>([]);
  const [myMrs, setMyMrs] = useState<MergeRequestModel[]>([]);
  const [pendingReviews, setPendingReviews] = useState<MergeRequestModel[]>([]);
  const [pipelines, setPipelines] = useState<ProtectedBranchPipeline[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchRepos = useCallback(async () => {
    if (!hasVcsKey) {
      setRepos([]);
      return;
    }

    try {
      const data = await vcsService.fetchRepos(vcsProvider);
      setRepos(data || []);
    } catch (error) {
      console.error("Failed to fetch repos:", error);
    }
  }, [hasVcsKey, vcsProvider]);

  const fetchVscData = useCallback(
    async (isBackground = false) => {
      if (!hasVcsKey) {
        setPendingReviews([]);
        setMyMrs([]);
        setPipelines([]);
        return;
      }

      if (isBackground) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const [reviews, mrs, pipeData] = await Promise.all([
          vcsService.fetchPendingReviews(vcsProvider),
          vcsService.fetchMergeRequests(vcsProvider),
          vcsService.fetchPipelines(vcsProvider),
        ]);

        setPendingReviews(reviews || []);
        setMyMrs(mrs || []);
        setPipelines(pipeData || []);
      } catch (error) {
        console.error("Failed to load VCS data:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [hasVcsKey, vcsProvider],
  );

  const fetchAll = useCallback(
    async (isBackground = false) => {
      if (!hasVcsKey) return;

      await Promise.allSettled([fetchRepos(), fetchVscData(isBackground)]);
    },
    [hasVcsKey, fetchRepos, fetchVscData],
  );

  // WICHTIG: Reagiert dynamisch, sobald der API-Key / Provider geladen ist!
  useEffect(() => {
    if (hasVcsKey) {
      fetchAll();
    }
  }, [hasVcsKey, vcsProvider, fetchAll]);

  const contextValue = useMemo<VcsContextType>(
    () => ({
      vcsLink,
      repos,
      myMrs,
      pendingReviews,
      pipelines,
      isLoading,
      isRefreshing,
      fetchRepos,
      fetchVscData,
      fetchAll,
    }),
    [
      vcsLink,
      repos,
      myMrs,
      pendingReviews,
      pipelines,
      isLoading,
      isRefreshing,
      fetchRepos,
      fetchVscData,
      fetchAll,
    ],
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
