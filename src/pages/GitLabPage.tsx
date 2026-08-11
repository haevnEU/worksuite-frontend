import React, { useState, useEffect } from "react";
import { GitLabHeader } from "../components/gitlab/GitLabHeader.tsx";
import { GitLabKpiCards } from "../components/gitlab/GitLabKpiCards.tsx";
import { MergeRequestList } from "../components/gitlab/MergeRequestList.tsx";
import { PipelineMonitorWidget } from "../components/gitlab/PipelineMonitorWidget.tsx";
import {
  MergeRequestModel,
  ProtectedBranchPipeline,
} from "../models/gitlab.model.ts";
import { RedmineTicket } from "../models/ticket.model.ts";
import { gitlabService } from "../services/network/gitlab.service.ts";

export const GitLabPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<MergeRequestModel[]>([]);
  const [myMrs, setMyMrs] = useState<MergeRequestModel[]>([]);
  const [pipelines, setPipelines] = useState<ProtectedBranchPipeline[]>([]);

  const fetchGitlabData = async () => {
    setIsLoading(true);
    try {
      const [reviews, mrs, pipeData] = await Promise.all([
        gitlabService.fetchPendingReviews(),
        gitlabService.fetchMergeRequests(),
        gitlabService.fetchPipelines(),
      ]);

      setPendingReviews(reviews || []);
      setMyMrs(mrs || []);
      setPipelines(pipeData || []);
    } catch (e) {
      console.error("Failed to load GitLab data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGitlabData();
  }, []);

  const failedPipelinesCount = pipelines.filter(
    (p) => p.status === "failed",
  ).length;

  return (
    <div className="space-y-4 font-sans text-slate-100 max-w-full">
      <GitLabHeader onRefresh={fetchGitlabData} isLoading={isLoading} />

      <GitLabKpiCards
        pendingReviewsCount={pendingReviews.length}
        myMrCount={myMrs.length}
        failedPipelinesCount={failedPipelinesCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Main MR Section */}
        <div className="lg:col-span-2">
          <MergeRequestList pendingReviews={pendingReviews} myMrs={myMrs} />
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-4">
          <PipelineMonitorWidget pipelines={pipelines} />
        </div>
      </div>
    </div>
  );
};

export default GitLabPage;
