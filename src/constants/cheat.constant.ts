import { CheatsheetTopic } from "../models/cheat.model.ts";

export const CHEATSHEET_TOPICS: CheatsheetTopic[] = [
  {
    id: "git",
    title: "Git Version Control",
    iconName: "GitBranch",
    category: "Git & VCS",
    summary:
      "Branching, inspection, stash, interactive rebase, and history rewriting.",
    sections: [
      {
        id: "branching",
        title: "Branching & Switching",
        description:
          "Creating, listing, and switching local and remote branches.",
        items: [
          {
            id: "git-switch-create",
            title: "Create & switch branch",
            syntax: "git switch -c <branch-name>",
            description:
              "Creates a new branch from current HEAD and switches to it directly.",
            language: "bash",
            level: "basic",
            tags: ["branch", "switch", "checkout"],
            examples: [
              {
                title: "Create feature branch",
                code: "git switch -c feat/user-service-reauth",
              },
            ],
          },
          {
            id: "git-delete-branch",
            title: "Delete branch safely / force",
            syntax: "git branch -d <branch-name>  # or -D to force",
            description:
              "Deletes local branch. Use -D if unmerged changes exist.",
            language: "bash",
            level: "basic",
            tags: ["branch", "delete", "cleanup"],
            flags: [
              {
                flag: "-d",
                description: "Deletes branch only if already fully merged",
              },
              {
                flag: "-D",
                description: "Force delete branch regardless of merge status",
              },
            ],
          },
        ],
      },
      {
        id: "inspection",
        title: "History & Inspection",
        description:
          "Viewing log graphs, staged diffs, and specific commit details.",
        items: [
          {
            id: "git-log-graph",
            title: "Compact commit graph",
            syntax: "git log --oneline --graph --decorate --all",
            description: "Shows clean visual ASCII branch topology graph.",
            language: "bash",
            level: "intermediate",
            tags: ["log", "history", "graph"],
          },
          {
            id: "git-diff-staged",
            title: "Inspect staged changes",
            syntax: "git diff --staged",
            description:
              "Shows the exact diff staged in index vs the last commit.",
            language: "bash",
            level: "basic",
            tags: ["diff", "index", "staged"],
          },
        ],
      },
    ],
  },
  {
    id: "docker",
    title: "Docker & Compose",
    iconName: "Container",
    category: "Docker & Containers",
    summary:
      "Container management, image building, volume prunes, and compose commands.",
    sections: [
      {
        id: "containers",
        title: "Container Operations",
        description: "Starting, inspecting, logs, and shell execution.",
        items: [
          {
            id: "docker-exec-it",
            title: "Interactive bash in container",
            syntax: "docker exec -it <container_id_or_name> /bin/bash",
            description:
              "Opens interactive TTY shell session inside running container.",
            language: "bash",
            level: "basic",
            tags: ["exec", "shell", "debug"],
            flags: [
              { flag: "-i", description: "Keep STDIN open" },
              { flag: "-t", description: "Allocate pseudo-TTY" },
            ],
          },
          {
            id: "docker-logs-tail",
            title: "Follow live container logs",
            syntax: "docker logs -f --tail 100 <container_name>",
            description:
              "Follows container stdout/stderr output in real-time with initial tail.",
            language: "bash",
            level: "basic",
            tags: ["logs", "tail", "monitor"],
            flags: [
              { flag: "-f", description: "Follow live log stream" },
              {
                flag: "--tail",
                description: "Number of lines to show from end of logs",
              },
            ],
          },
        ],
      },
      {
        id: "system-prune",
        title: "Cleanup & Disk Space",
        description:
          "Freeing up host storage from dangling layers, volumes, and images.",
        items: [
          {
            id: "docker-system-prune",
            title: "System deep prune",
            syntax: "docker system prune -a --volumes -f",
            description:
              "Removes unused containers, networks, dangling images, and build cache.",
            language: "bash",
            level: "intermediate",
            tags: ["prune", "cleanup", "storage"],
          },
        ],
      },
    ],
  },
  {
    id: "postgres",
    title: "PostgreSQL & SQL",
    iconName: "Database",
    category: "PostgreSQL & SQL",
    summary:
      "Connection queries, locking inspection, index tuning, and vacuum commands.",
    sections: [
      {
        id: "locks-performance",
        title: "Performance & Activity",
        description: "Inspecting long running queries and locked tables.",
        items: [
          {
            id: "pg-stat-activity",
            title: "Show active slow queries",
            syntax:
              "SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state FROM pg_stat_activity WHERE state != 'idle' ORDER BY duration DESC;",
            description:
              "Lists all actively executing statements and their current runtime.",
            language: "sql",
            level: "intermediate",
            tags: ["performance", "slowquery", "pg_stat_activity"],
          },
          {
            id: "pg-terminate-backend",
            title: "Kill stuck connection by PID",
            syntax: "SELECT pg_terminate_backend(<pid>);",
            description:
              "Gracefully terminates a stuck backend database worker thread.",
            language: "sql",
            level: "advanced",
            tags: ["kill", "pid", "locks"],
          },
        ],
      },
    ],
  },
];
