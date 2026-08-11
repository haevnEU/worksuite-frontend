import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface GitLabContextType {
  gitlabLink: string;
  repos: GitLabRepository[];
  fetchRepos: () => Promise<void>;
  fetchPipeline: () => Promise<void>;
  fetchMergeRequests: () => Promise<void>;
}

const GitLabContext = createContext<GitLabContextType | undefined>(undefined);

export const GitLabProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const gitlabLink: string = "git/";
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
    <GitLabContext.Provider
      value={{
        gitlabLink,
        repos,
        fetchRepos,
        fetchMergeRequests,
        fetchPipeline,
      }}
    >
      {children}
    </GitLabContext.Provider>
  );
};

export const useVCS = (): GitLabContextType => {
  const context = useContext(GitLabContext);
  if (!context) {
    throw new Error("useVCS must be used within a GitLabProvider");
  }
  return context;
};
