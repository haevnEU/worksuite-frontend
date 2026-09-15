import {WeeklyMeetingDTO} from "../models/weekly.model.ts";

export const TEAM_MEETING_SYSTEM_PROMPT = `Du bist ein erfahrener technischer Projektleiter und Lead Developer.
Deine Aufgabe ist es, aus den täglichen Arbeitsnotizen und erledigten Aufgaben eines wöchentlichen Dienstags-Zyklus einen professionellen, flüssigen Sprechtext auf Deutsch zu formulieren, der im Team-Meeting direkt laut vorgelesen werden kann.

Anforderungen an den Text:
- Sprache: Ausschließlich Deutsch.
- Tonalität: Professionell, fokussiert, klar und auf den Punkt.
- Stil: Ausformulierte, natürliche Sätze mit sauberen Übergängen. Keine Aufzählungszeichen, Markdown-Listen oder Tabellen im Fließtext.
- Struktur:
  1. Einleitung & Überblick: Kurze Begrüßung und Zusammenfassung des Fortschritts seit dem letzten Dienstag.
  2. Erreichte Ergebnisse: Wichtigste fertiggestellte Features, behobene Fehler und Meilensteine.
  3. Aktuelle Schwerpunkte & Blocker: Laufende Arbeiten, Abhängigkeiten oder offene Hürden.
  4. Nächste Schritte & Übergabe: Fokus für den kommenden Zyklus und direkte Überleitung zur Diskussionsrunde.`;

export const buildTeamMeetingSummaryPrompt = (
    meeting: WeeklyMeetingDTO,
): string => {
  const dayLogs = (meeting.daySummaries || [])
      .map((day) => {
        const dateStr = day.date.split("T")[0];
        const summaryText = day.summary?.trim() || "Keine Notizen erfasst.";
        const taskLines =
            day.tasks && day.tasks.length > 0
                ? day.tasks.map((t) => `  - ${t}`).join("\n")
                : "  - Keine Tasks eingetragen.";

        return `Tag ${dateStr}:\nNotizen: ${summaryText}\nAufgaben:\n${taskLines}`;
      })
      .join("\n\n");

  const totalTasks = (meeting.daySummaries || []).reduce(
      (acc, cur) => acc + (cur.tasks?.length || 0),
      0,
  );

  return `Meeting-Titel: ${meeting.title}
Zyklus-Datum: ${meeting.createdAt.split("T")[0]}
Bestehende Notizen: ${meeting.summary || "Keine"}
Gesamtzahl Tasks: ${totalTasks}

PROTOKOLL-EINTRÄGE DER ARBEITSTAGE:
${dayLogs || "Keine Tageseinträge vorhanden."}

Erstelle basierend auf diesen Daten einen zusammenhängenden deutschen Sprechtext für das Team-Sync, den ich direkt so vortragen kann.`;
};