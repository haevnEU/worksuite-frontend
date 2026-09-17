import type { MrCreatorState } from "../models/mrCreator.model";

export const generateMrCreatorMarkdown = (state: MrCreatorState): string => {
  const cleanTicketId = state.ticketId.trim().replace(/^#/, "");
  const ticketDisplay = cleanTicketId ? `#${cleanTicketId}` : "[TICKET-ID]";
  const ticketUrl = cleanTicketId
    ? `https://pm.hausheld.info/issues/${cleanTicketId}`
    : "https://pm.hausheld.info/issues/12345";
  const title = state.shortTitle.trim() || "Kurztitel des Merge Requests";

  // Komponenten
  const componentsFormatted =
    state.affectedComponents.length > 0
      ? state.affectedComponents.map((c) => `  * ${c}`).join("\n")
      : "  * `Modul/Klasse`: Was wurde konkret angepasst?";

  // Breaking Changes
  const breakingChangesFormatted =
    state.breakingChanges.length > 0
      ? state.breakingChanges.map((b) => `  * ${b}`).join("\n")
      : "Keine";

  // Akzeptanzkriterien
  const akFormatted =
    state.acceptanceCriteria.length > 0
      ? state.acceptanceCriteria
          .map((ak) => `- [${ak.completed ? "x" : " "}] ${ak.text}`)
          .join("\n")
      : "- [ ] Kriterium 1 erfüllt\n- [ ] Kriterium 2 erfüllt";

  // Unit-Tests als Liste
  let unitTestBlock = "### Automatisierte Tests\n";
  if (state.unitTestsChecked) {
    if (state.unitTestClasses.length > 0) {
      unitTestBlock += state.unitTestClasses
        .map((tc) => `* \`${tc}\``)
        .join("\n");
    } else {
      unitTestBlock += "* Unit-Tests ergänzt / angepasst (`MyServiceTest`)";
    }
  } else {
    unitTestBlock += "* _Keine Unit-Tests ergänzt_";
  }

  // CI/CD-Pipeline
  const pipelineBlock = state.itestsChecked
    ? "- [x] CI/CD-Pipeline lief erfolgreich durch (`PASSED`)"
    : `- [ ] CI/CD-Pipeline: ${state.itestsDetails.trim() || "Wurde übersprungen (Begründung angeben)"}`;

  const pipelineStatusValue = state.itestsChecked
    ? "PASSED"
    : state.itestsDetails.trim() || "Wurde übersprungen (Begründung angeben)";

  // Manuelle Testschritte (Ergebnis optional)
  const manualStepsFormatted =
    state.manualTestSteps.length > 0
      ? state.manualTestSteps
          .map((s, idx) => {
            const base = `${idx + 1}. **${s.step || `Schritt ${idx + 1}`}:** ${s.action}`;
            return s.expected && s.expected.trim()
              ? `${base}\n   * **Erwartetes Ergebnis:** ${s.expected.trim()}`
              : base;
          })
          .join("\n")
      : "1. **Schritt 1:** Vorbereitung / Testdaten\n2. **Schritt 2:** Ausführung (z. B. API-Call, CLI-Befehl oder UI-Klick)\n3. **Erwartetes Ergebnis:** Soll-Zustand prüfen";

  // Testdateien
  const testFilesFormatted =
    state.testFiles.length > 0
      ? state.testFiles.map((f) => `> * ${f}`).join("\n")
      : "> * Keine <!-- oder Dateinamen auflisten -->";

  // Konfiguration & Deployment
  const configFormatted = state.hasConfigChanges
    ? state.configChanges.trim() || "Neue Properties / Env-Vars eingepflegt"
    : "Keine";

  const dbFormatted = state.hasDatabaseNotes
    ? state.databaseNotes.trim() || "Neues Flyway-Skript / DDL-Änderung"
    : "Keine Migrationen";

  const rolloutFormatted = state.hasRolloutNotes
    ? state.rolloutNotes.trim() || "Besondere Reihenfolge erforderlich"
    : "Standard";

  return `# [${ticketDisplay}] ${title}

## Kontext & Motivation
* **Ticket:** [${ticketDisplay}](${ticketUrl})
* **Typ:** \`${state.type}\`
* **Projekt:** \`${state.project}\`
* **Zusammenfassung:** ${state.summary.trim() || "Kurze Beschreibung des Problems und der gewählten Lösung."}

---

## Technische Änderungen
* **Architektur & Refactoring:** 
  * ${state.architectureRefactoring.trim() || "Wichtige Designentscheidungen (z. B. neue Patterns, Kapselung)."}
* **Betroffene Komponenten:**
${componentsFormatted}
* **Breaking Changes / Nebeneffekte:**
${breakingChangesFormatted.startsWith("  *") ? breakingChangesFormatted : `* ${breakingChangesFormatted}`}

---

## Verifikation & Tests

### Akzeptanzkriterien
${akFormatted}

${unitTestBlock}

### CI/CD-Pipeline
${pipelineBlock}

### Manuelle Testanleitung (für Reviewer)
${manualStepsFormatted}

> **Testdateien im Ticket:**
${testFilesFormatted}

---

## CI/CD & Deployment
* **Pipeline:** \`${pipelineStatusValue}\`
* **Konfigurationsanpassungen:** ${configFormatted}
* **Datenbank-Hinweise:** ${dbFormatted}
* **Rollout-Hinweise:** ${rolloutFormatted}
`;
};
