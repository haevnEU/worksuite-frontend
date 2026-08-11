import { GitLabRepository } from "../models/vcs.model.ts";

export const mockGitLabRepositories: GitLabRepository[] = [
  {
    id: 101,
    name: "user-service",
    path: "worksuite/backend/user-service",
    webUrl: "https://gitlab.example.com/worksuite/backend/user-service",
    lastPipelineStatus: "success",
    openMRCount: 2,
    mergeRequests: [
      {
        id: "mr-101",
        iid: 42,
        title: "feat(auth): Add OIDC Centralized Login Flow",
        author: {
          name: "Nils Milewski",
          avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=Nils",
        },
        description:
          "Implement Central Centralized Identity Provider for SSO handling.",
        sourceBranch: "feature/oidc-sso",
        targetBranch: "main",
        webUrl:
          "https://gitlab.example.com/worksuite/backend/user-service/-/merge_requests/42",
        pipelineStatus: "success",
        userNotesCount: 5,
        hasConflicts: false,
        isDraft: false,
        approved: true,
        updatedAt: "2026-08-11T20:15:00Z",
        projectName: "user-service",
      },
      {
        id: "mr-102",
        iid: 43,
        title: "refactor(flyway): Add GDPR data export migration",
        author: {
          name: "Sarah Dev",
          avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=Sarah",
        },
        description: "Migration scripts for dynamic user export endpoints.",
        sourceBranch: "feature/gdpr-export",
        targetBranch: "main",
        webUrl:
          "https://gitlab.example.com/worksuite/backend/user-service/-/merge_requests/43",
        pipelineStatus: "running",
        userNotesCount: 1,
        hasConflicts: false,
        isDraft: false,
        approved: false,
        updatedAt: "2026-08-11T22:00:00Z",
        projectName: "user-service",
      },
    ],
  },
  {
    id: 102,
    name: "csv-validator",
    path: "worksuite/libs/csv-validator",
    webUrl: "https://gitlab.example.com/worksuite/libs/csv-validator",
    lastPipelineStatus: "failed",
    openMRCount: 1,
    mergeRequests: [
      {
        id: "mr-201",
        iid: 15,
        title: "Draft: refactor(stream): Parallel chunking pipeline",
        author: {
          name: "Alex Dev",
          avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=Alex",
        },
        description:
          "Optimizing memory footprint when parsing large CSV chunks via Reflection.",
        sourceBranch: "refactor/csv-parallel-chunking",
        targetBranch: "main",
        webUrl:
          "https://gitlab.example.com/worksuite/libs/csv-validator/-/merge_requests/15",
        pipelineStatus: "failed",
        userNotesCount: 3,
        hasConflicts: true,
        isDraft: true,
        approved: false,
        updatedAt: "2026-08-11T21:10:00Z",
        projectName: "csv-validator",
      },
    ],
  },
  {
    id: 103,
    name: "worksuite-frontend",
    path: "worksuite/frontend/worksuite-frontend",
    webUrl: "https://gitlab.example.com/worksuite/frontend/worksuite-frontend",
    lastPipelineStatus: "success",
    openMRCount: 1,
    mergeRequests: [
      {
        id: "mr-301",
        iid: 88,
        title: "fix(ui): Align AuthenticatedImage fallbacks & rounded borders",
        author: {
          name: "Nils Milewski",
          avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=Nils",
        },
        description:
          "Unify image placeholder states and container inheritance for avatars.",
        sourceBranch: "fix/image-avatar-border-radius",
        targetBranch: "main",
        webUrl:
          "https://gitlab.example.com/worksuite/frontend/worksuite-frontend/-/merge_requests/88",
        pipelineStatus: "success",
        userNotesCount: 0,
        hasConflicts: false,
        isDraft: false,
        approved: true,
        updatedAt: "2026-08-11T23:05:00Z",
        projectName: "worksuite-frontend",
      },
    ],
  },
];
