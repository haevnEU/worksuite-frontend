import type { TicketHandoverState } from "../models/ticketHandover.model";

export const formatRecipient = (name: string, company: string): string => {
  const cleanName = name.trim();
  const cleanCompany = company.trim();

  if (cleanName && cleanCompany) {
    return `${cleanName}@${cleanCompany}`;
  }
  if (cleanName) {
    return cleanName;
  }
  return "vorname.nachname@company";
};

export const generateTicketHandoverTextile = (
  state: TicketHandoverState,
): string => {
  const recipient = formatRecipient(
    state.recipientName,
    state.recipientCompany,
  );

  if (state.scenario === "to-review") {
    return `Hi ${recipient},

Ich habe ein Review für dich, kannst du dieses bitte durchführen. In GitLab findest du die Details dazu.`;
  }

  if (state.scenario === "back-to-dev") {
    const lines: string[] = [
      `Hi ${recipient},`,
      "",
      "ich habe das Review für dich durchgeführt.",
    ];

    const additionalNotes: string[] = [];
    if (state.hintsCount > 0) {
      additionalNotes.push(
        `Ich habe ${state.hintsCount} ${state.hintsCount === 1 ? "Hinweis" : "Hinweise"} hinterlassen.`,
      );
    }
    if (state.criticalHintsCount > 0) {
      additionalNotes.push(
        `Ich habe ${state.criticalHintsCount} kritische ${
          state.criticalHintsCount === 1 ? "Hinweis" : "Hinweise"
        } hinterlassen.`,
      );
    }

    if (additionalNotes.length > 0) {
      lines.push("");
      lines.push(...additionalNotes);
    }

    lines.push("");
    const pipelineStatus = state.pipelinePassed
      ? "*%{color:green}SUCCEED%*"
      : "*%{color:red}FAILED%*";
    lines.push(`CI/CD-Pipeline: ${pipelineStatus}`);

    lines.push("");
    const hasBlockers = state.criticalHintsCount > 0 || !state.pipelinePassed;
    if (hasBlockers) {
      lines.push(
        "Es gibt *%{color:red}Blocker%* die zu beheben sind, bitte anschauen.",
      );
    } else if (state.isApprovalGranted && state.hintsCount > 0) {
      lines.push(
        "Die Anmerkungen sind noch zu bewerten, aber ein erneutes Review ist nicht notwendig mein *%{color:green}Approval%* ist erteilt.",
      );
    } else if (state.isApprovalGranted) {
      lines.push("Ich habe mein *%{color:green}Approval%* erteilt.");
    } else {
      lines.push("Bitte die Anmerkungen prüfen.");
    }

    return lines.join("\n");
  }

  // Scenario: to-qa
  const introSummary = state.qaSummary.trim();
  const confirmationText =
    "Das Ticket steht nun für die Qualitätssicherung bereit. Die Akzeptanzkriterien wurden vorab geprüft und verifiziert.";

  const lines: string[] = [`Hi ${recipient},`, ""];

  if (introSummary) {
    lines.push(introSummary, "");
  }

  lines.push(
    confirmationText,
    "",
    "---",
    "",
    "h4. Automatisierte Tests / Unit-Tests",
  );

  if (state.qaUnitTests.length > 0) {
    state.qaUnitTests.forEach((t) => {
      lines.push(`* @${t}@`);
    });
  } else {
    lines.push("* _Keine Unit-Tests ergänzt_");
  }

  lines.push("", "h4. Manueller Testablauf");
  if (state.qaManualSteps.length > 0) {
    state.qaManualSteps.forEach((s) => {
      const stepLine = `# ${s.action}`;
      if (s.expected && s.expected.trim()) {
        lines.push(`${stepLine}\n** Soll: ${s.expected.trim()}`);
      } else {
        lines.push(stepLine);
      }
    });
  } else {
    lines.push(
      "Die Testschritte und Akzeptanzkriterien können direkt anhand der Ticketbeschreibung verifiziert werden.",
    );
  }

  if (state.qaTestFiles.length > 0) {
    lines.push("", "> *Angehängte Testdateien:*");
    state.qaTestFiles.forEach((f) => {
      lines.push(`> * @${f}@`);
    });
  }

  lines.push("", "h4. CI/CD-Pipeline");
  if (state.qaPipelinePassed) {
    lines.push("Status: *%{color:green}SUCCEED%*");
  } else if (state.qaPipelineOverridden) {
    lines.push("Status: *%{color:orange}FAILED (Überschrieben)%*");
    const reason =
      state.qaPipelineOverrideReason.trim() || "Keine Begründung angegeben";
    lines.push(`* Begründung für Override: ${reason}`);
  } else {
    lines.push("Status: *%{color:red}FAILED%*");
  }

  return lines.join("\n");
};
