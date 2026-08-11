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
import { useSettings } from "../context/SettingsContext.tsx";
import { MissingApiKeyCard } from "../components/MissingApiKeyCard.tsx";

export const VcsPage: React.FC = () => {
  const { hasVcsKey } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<MergeRequestModel[]>([]);
  const [myMrs, setMyMrs] = useState<MergeRequestModel[]>([]);
  const [pipelines, setPipelines] = useState<ProtectedBranchPipeline[]>([]);

  const fetchVscData = async () => {
    if (!hasVcsKey) return;
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
  }, [hasVcsKey]);

  if (!hasVcsKey) {
    return (
        <div className="space-y-6 pb-12 font-sans">
          <VcsHeader onRefresh={() => {}} isLoading={false} />
          <MissingApiKeyCard
              title="VCS API Key Not Found"
              serviceName="GitLab / VCS"
              description="Your VCS workspace cannot fetch merge requests or pipeline status because no API key is configured."
              accentColor="orange"
          />
        </div>
    );
  }

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