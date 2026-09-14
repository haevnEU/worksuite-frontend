import type { ReviewState } from "../models/mrReview.model";

export const generateMrReviewMarkdown = (state: ReviewState): string => {
  const {
    checklist,
    positiveFeedback,
    negativeFeedback,
    blockers,
    isTentativeApproval,
  } = state;

  const validPositive = positiveFeedback.map((i) => i.trim()).filter(Boolean);
  const validNegative = negativeFeedback.map((i) => i.trim()).filter(Boolean);
  const validBlockers = blockers.map((i) => i.trim()).filter(Boolean);

  let summarySection = "";

  if (validBlockers.length > 0) {
    summarySection = "Folgende Blocker verhindern aktuell ein Approval:\n\n";
    summarySection += validBlockers.map((b) => `- ${b}`).join("\n");

    if (checklist.itestsOverridden && checklist.itestsOverrideReason.trim()) {
      summarySection += `\n\n> **Hinweis zur CI/CD-Pipeline:**\n> Die itests CI/CD-Pipeline läuft noch nicht erfolgreich durch, die Ursache hierfür: ${checklist.itestsOverrideReason.trim()}`;
    }

    summarySection += "\n\nBitte behebe die Blocker vor dem nächsten Review.";
  } else {
    if (checklist.itestsOverridden && checklist.itestsOverrideReason.trim()) {
      summarySection += `> **Hinweis zur CI/CD-Pipeline:**\n> Die itests CI/CD-Pipeline läuft noch nicht erfolgreich durch, die Ursache hierfür: ${checklist.itestsOverrideReason.trim()}\n\n`;
    }

    if (isTentativeApproval) {
      summarySection +=
        "Die offenen Anmerkungen sind keine kritischen, daher erteile ich mein Approval. Bei einfachen Änderungen ist kein erneutes Approval notwendig.";
    } else {
      summarySection +=
        "Alle Kriterien sind erfüllt und die CI/CD-Pipeline läuft erfolgreich durch, hierdurch ergibt sich kein Blocker und ich erteile mein Approval.";
    }
  }

  return `### Review-Übersicht

Ich habe das Review durchgeführt und habe mich auf folgende Punkte konzentriert: Clean Code, Wartbarkeit, Testbarkeit, Sicherheit sowie die Einhaltung unserer Dokumentations- und Architekturstandards.

---

### Checkliste

- [${checklist.styleguide ? "x" : " "}] Styleguide ist eingehalten
- [${checklist.itestsPassed ? "x" : " "}] Die itests CI/CD-Pipeline lief erfolgreich durch${
    checklist.itestsOverridden ? " *(Override aktiv)*" : ""
  }
- [${checklist.unitTestsPresent ? "x" : " "}] Unit Tests sind vorhanden
- [${checklist.acceptanceCriteriaFound ? "x" : " "}] Die Akzeptanzkriterien sind wiederfindbar
- [${checklist.acceptanceCriteriaVerified ? "x" : " "}] Die AK sind überprüft
- [${checklist.documentationPresent ? "x" : " "}] Es ist eine klare und verständliche Javadoc/JSDoc vorhanden
- [${checklist.modernLanguageFeatures ? "x" : " "}] Verwendung moderner Sprach-Features
- [${checklist.noOverEngineering ? "x" : " "}] Keine premature Optimizations / Over-Engineering
- [${checklist.noHardcodedSecrets ? "x" : " "}] Keine Hardcoded Secrets / Credentials
- [${checklist.noDeadCodeOrDebug ? "x" : " "}] Keine toten Codefragmente & Debug-Überbleibsel
- [${checklist.resourceLeakHygiene ? "x" : " "}] Resource Leak Hygiene (AutoCloseable / Streams)

---

### Positives Feedback

Besonders gut gefiel mir:

${validPositive.length > 0 ? validPositive.map((item) => `- ${item}`).join("\n") : "_Keine Anmerkungen erfasst._"}

---

### Verbesserungspotenzial & Anmerkungen

Folgende Punkte sollten noch angepasst oder überdacht werden:

${validNegative.length > 0 ? validNegative.map((item) => `- ${item}`).join("\n") : "_Keine offenen Anmerkungen._"}

---

### Fazit & Status

${summarySection}`;
};
