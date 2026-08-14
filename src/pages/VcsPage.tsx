import React, { useEffect, useState } from "react";
import {
  MergeRequestList,
  PipelineMonitorWidget,
  VcsHeader,
  VcsKpiCards,
} from "../components/vcs";
import {
  MergeRequestModel,
  ProtectedBranchPipeline,
} from "../models/vcs.model.ts";
import { vcsService } from "../services/network/vcs.service.ts";

export const VcsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<MergeRequestModel[]>([]);
  const [myMrs, setMyMrs] = useState<MergeRequestModel[]>([]);
  const [pipelines, setPipelines] = useState<ProtectedBranchPipeline[]>([]);

  const fetchVscData = async () => {
    setIsLoading(true);
    try {
      const [reviews, mrs, pipeData] = await Promise.all([
        vcsService.fetchPendingReviews(),
        vcsService.fetchMergeRequests(),
        vcsService.fetchPipelines(),
      ]);

      setPendingReviews(reviews || []);
      setMyMrs(mrs || []);
      setPipelines(pipeData || []);
    } catch (e) {
      console.error("Failed to load Vcs data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVscData();
  }, []);

  const failedPipelinesCount = pipelines.filter(
    (p) => p.status === "failed",
  ).length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      <VcsHeader onRefresh={fetchVscData} isLoading={isLoading} />

      <VcsKpiCards
        pendingReviewsCount={pendingReviews.length}
        myMrCount={myMrs.length}
        failedPipelinesCount={failedPipelinesCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2">
          <MergeRequestList pendingReviews={pendingReviews} myMrs={myMrs} />
        </div>

        <div className="space-y-5">
          <PipelineMonitorWidget pipelines={pipelines} />
        </div>
      </div>
    </div>
  );
};
