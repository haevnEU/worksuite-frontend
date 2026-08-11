import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  MergeRequestList,
  PipelineMonitorWidget,
  VcsHeader,
  VcsKpiCards,
} from "../components/vcs";
import { useSettings } from "../context/SettingsContext.tsx";
import { useVCS } from "../context/VcsContext.tsx";
import { MissingApiKeyCard } from "../components/MissingApiKeyCard.tsx";

export const VcsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab"); // "reviews" | "my-mrs" | null

  const { hasVcsKey } = useSettings();
  const { pendingReviews, myMrs, pipelines, isLoading, fetchVscData } =
    useVCS();

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
      <VcsHeader onRefresh={() => fetchVscData(true)} isLoading={isLoading} />

      <VcsKpiCards
        pendingReviewsCount={pendingReviews.length}
        myMrCount={myMrs.length}
        failedPipelinesCount={failedPipelinesCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2">
          <MergeRequestList
            pendingReviews={pendingReviews}
            myMrs={myMrs}
            initialTab={tabParam === "my-mrs" ? "MY_MRS" : "PENDING_REVIEWS"}
          />
        </div>

        <div className="space-y-5">
          <PipelineMonitorWidget pipelines={pipelines} />
        </div>
      </div>
    </div>
  );
};
