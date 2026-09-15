import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { DaySummaryDTO, WeeklyMeetingDTO } from "../models/weekly.model.ts";
import { weeklyService } from "../services/weekly.service.ts";
import { isWeekend } from "../utils/weekly.util.ts";
import { useSettings } from "../../../context/SettingsContext.tsx";

interface WeeklyContextType {
    allMeetings: WeeklyMeetingDTO[];
    selectionMeetings: WeeklyMeetingDTO[];
    activeMeeting: WeeklyMeetingDTO | null;
    selectedMeetingId: string | null;
    selectedDayDate: string;
    activeDaySummary?: DaySummaryDTO;
    activeDayIndex: number;
    isLoading: boolean;
    isGenerating: boolean;
    isExporting: boolean;

    selectMeeting: (id: string) => void;
    selectDay: (date: string) => void;
    reloadMeetings: (preferredId?: string) => Promise<void>;
    generateNextWeek: () => Promise<void>;
    updateWeeklySummary: (summary: string) => Promise<void>;
    saveDaySummary: (day: string, summary: string) => Promise<void>;
    addTaskToDay: (day: string, task: string) => Promise<void>;
    exportPdf: () => Promise<void>;
}

const WeeklyContext = createContext<WeeklyContextType | null>(null);

const sanitizeMeeting = (m: WeeklyMeetingDTO): WeeklyMeetingDTO => ({
    ...m,
    daySummaries: (m.daySummaries || [])
        .filter((d) => !isWeekend(d.date))
        .sort((a, b) => a.date.localeCompare(b.date)),
});

export const WeeklyProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                            children,
                                                                        }) => {
    const { isDraft } = useSettings();
    const [allMeetings, setAllMeetings] = useState<WeeklyMeetingDTO[]>([]);
    const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
    const [selectedDayDate, setSelectedDayDate] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const reloadMeetings = useCallback(
        async (preferredId?: string) => {
            setIsLoading(true);
            try {
                const raw = await weeklyService.fetchAll();
                if (raw && raw.length > 0) {
                    const sorted = raw
                        .map(sanitizeMeeting)
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

                    setAllMeetings(sorted);

                    const nextId =
                        preferredId ||
                        (selectedMeetingId && sorted.some((m) => m.id === selectedMeetingId)
                            ? selectedMeetingId
                            : sorted[0].id);

                    setSelectedMeetingId(nextId);

                    const currentMeeting = sorted.find((m) => m.id === nextId) || sorted[0];
                    if (currentMeeting.daySummaries && currentMeeting.daySummaries.length > 0) {
                        setSelectedDayDate((prevDay) => {
                            const dayExists = currentMeeting.daySummaries.some((d) => d.date === prevDay);
                            return dayExists ? prevDay : currentMeeting.daySummaries[0].date;
                        });
                    }
                } else {
                    setAllMeetings([]);
                    setSelectedMeetingId(null);
                    setSelectedDayDate("");
                }
            } finally {
                setIsLoading(false);
            }
        },
        [selectedMeetingId],
    );

    useEffect(() => {
        reloadMeetings();
    }, []);

    const activeMeeting = useMemo(() => {
        return (
            allMeetings.find((m) => m.id === selectedMeetingId) ||
            allMeetings[0] ||
            null
        );
    }, [allMeetings, selectedMeetingId]);

    const selectionMeetings = useMemo(() => {
        return allMeetings.slice(0, 4);
    }, [allMeetings]);

    const activeDaySummary = useMemo(() => {
        return activeMeeting?.daySummaries?.find((d) => d.date === selectedDayDate);
    }, [activeMeeting, selectedDayDate]);

    const activeDayIndex = useMemo(() => {
        return (
            activeMeeting?.daySummaries?.findIndex((d) => d.date === selectedDayDate) ?? -1
        );
    }, [activeMeeting, selectedDayDate]);

    const selectMeeting = useCallback(
        (id: string) => {
            setSelectedMeetingId(id);
            const target = allMeetings.find((m) => m.id === id);
            if (target?.daySummaries && target.daySummaries.length > 0) {
                setSelectedDayDate(target.daySummaries[0].date);
            }
        },
        [allMeetings],
    );

    const selectDay = useCallback((date: string) => {
        setSelectedDayDate(date);
    }, []);

    const generateNextWeek = useCallback(async () => {
        try {
            setIsGenerating(true);
            await weeklyService.generateNextWeek();
            await reloadMeetings();
        } finally {
            setIsGenerating(false);
        }
    }, [reloadMeetings]);

    const updateWeeklySummary = useCallback(
        async (summary: string) => {
            if (!activeMeeting?.id) return;
            await weeklyService.updateWeeklySummary(activeMeeting.id, summary);
            await reloadMeetings(activeMeeting.id);
        },
        [activeMeeting?.id, reloadMeetings],
    );

    const saveDaySummary = useCallback(
        async (day: string, summary: string) => {
            if (!activeMeeting?.id) return;
            await weeklyService.updateDaySummary(activeMeeting.id, day, summary);
            await reloadMeetings(activeMeeting.id);
        },
        [activeMeeting?.id, reloadMeetings],
    );

    const addTaskToDay = useCallback(
        async (day: string, task: string) => {
            if (!activeMeeting?.id) return;
            await weeklyService.addTaskToDay(activeMeeting.id, day, task);
            await reloadMeetings(activeMeeting.id);
        },
        [activeMeeting?.id, reloadMeetings],
    );

    const exportPdf = useCallback(async () => {
        if (!activeMeeting?.id) return;
        try {
            setIsExporting(true);
            await weeklyService.exportPdf(activeMeeting.id, isDraft);
        } finally {
            setIsExporting(false);
        }
    }, [activeMeeting?.id, isDraft]);

    return (
        <WeeklyContext.Provider
            value={{
                allMeetings,
                selectionMeetings,
                activeMeeting,
                selectedMeetingId,
                selectedDayDate,
                activeDaySummary,
                activeDayIndex,
                isLoading,
                isGenerating,
                isExporting,
                selectMeeting,
                selectDay,
                reloadMeetings,
                generateNextWeek,
                updateWeeklySummary,
                saveDaySummary,
                addTaskToDay,
                exportPdf,
            }}
        >
            {children}
        </WeeklyContext.Provider>
    );
};

export const useWeekly = () => {
    const ctx = useContext(WeeklyContext);
    if (!ctx) {
        throw new Error("useWeekly must be used within a <WeeklyProvider>.");
    }
    return ctx;
};