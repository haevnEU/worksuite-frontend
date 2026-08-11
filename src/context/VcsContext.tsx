import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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
  const fetchRepos = async () => {};

  const fetchPipeline = async () => {};

  const fetchMergeRequests = async () => {};

  useEffect(() => {
    setRepos([
      {
        id: Date.now(),
        name: "REPO#" + Date.now(),
        webUrl: "url",
        lastPipelineStatus: "failed",
        openMRCount: 1,
        mergeRequests: [
          {
            id: "id",
            webUrl: "...",
            iid: "iid",
            title: "Demo",
            description: "DEMO",
          },
        ],
      },
      {
        id: Date.now() * 2,
        name: "REPO#" + Date.now() * 2,
        webUrl: "url",
        lastPipelineStatus: "running",
        openMRCount: 1,
        mergeRequests: [
          {
            id: "id",
            webUrl: "...",
            iid: "iid",
            title: "Demo",
            description: "DEMO",
          },
          {
            id: "id",
            webUrl: "...",
            iid: "iid",
            title: "Demo",
            description: "DEMO",
          },
          {
            id: "id",
            webUrl: "...",
            iid: "iid",
            title: "Demo",
            description: "DEMO",
          },
        ],
      },
      {
        id: Date.now() * 3,
        name: "REPO#" + Date.now() * 3,
        webUrl: "url",
        lastPipelineStatus: "success",
        openMRCount: 1,
        mergeRequests: [
          {
            id: "id",
            webUrl: "...",
            iid: "iid",
            title: "Demo",
            description: "DEMO",
          },
        ],
      },
    ]);
  }, []);

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
