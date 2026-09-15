import React, { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { AiOverlayDrawer, useAI } from "../../ai-assistant";
import {
    buildTeamMeetingSummaryPrompt,
    TEAM_MEETING_SYSTEM_PROMPT,
} from "./prompts.ai";
import { useWeekly } from "../context/WeeklyContext";

export const TeamMeetingAiOverlay: React.FC = () => {
    const { assistantName } = useAI();
    const { activeMeeting, updateWeeklySummary } = useWeekly();

    const totalDays = activeMeeting?.daySummaries?.length || 0;
    const totalTasks = useMemo(() => {
        return (activeMeeting?.daySummaries || []).reduce(
            (acc, cur) => acc + (cur.tasks?.length || 0),
            0,
        );
    }, [activeMeeting?.daySummaries]);

    const handleApply = (generatedSpeechText: string) => {
        if (!activeMeeting?.summary?.trim()) {
            updateWeeklySummary(generatedSpeechText);
        }
    };

    return (
        <AiOverlayDrawer
            buttonLabel={`Summarize with ${assistantName}`}
            buttonBadge={totalTasks > 0 ? totalTasks : undefined}
            isDisabled={!activeMeeting || totalDays === 0}
            title={`${assistantName} Team Meeting Summary`}
            subtitle={
                <span>
          Context: <strong>{totalDays}</strong> workdays,{" "}
                    <strong>{totalTasks}</strong> tasks logged
        </span>
            }
            icon={<Sparkles className="w-4 h-4 text-purple-400" />}
            loadingSubtitle="Drafting German speech text and English translation via local LLM..."
            emptyMessage="No meeting entries or logs available to summarize."
            systemPrompt={TEAM_MEETING_SYSTEM_PROMPT}
            getPrompt={() => (activeMeeting ? buildTeamMeetingSummaryPrompt(activeMeeting) : "")}
            temperature={0.2}
            onSuccess={handleApply}
        />
    );
};