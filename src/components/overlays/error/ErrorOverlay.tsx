import React, { useEffect, useState } from "react";
import { HttpError } from "../../../exception/http.error.ts";
import { GlobalErrorManager } from "../../../state/error.state.ts";
import { ErrorHeader } from "./ErrorHeader.tsx";
import { CorrelationIdCard } from "./CorrelationIdCard.tsx";
import { TroubleshootingSteps } from "../no-connection/TroubleshootingSteps.tsx";
import { ErrorPayloadViewer } from "./ErrorPayloadViewer.tsx";
import { ErrorActions } from "./ErrorActions.tsx";

export const GlobalErrorOverlay: React.FC = () => {
  const [error, setError] = useState<HttpError | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showRawHtml, setShowRawHtml] = useState<boolean>(false);

  useEffect(() => {
    return GlobalErrorManager.subscribe((err) => setError(err));
  }, []);

  if (!error) return null;

  const correlationId =
    error.correlationId ||
    error.responseBody.match(
      /correlation[-_]?id["']?\s*[:=]\s*["']?([a-f0-9-]+)/i,
    )?.[1] ||
    "N/A (Check Server Logs)";

  const handleCopy = () => {
    navigator.clipboard.writeText(correlationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#070c18]/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#10192c] border border-rose-500/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl text-slate-200">
        <ErrorHeader status={error.status} statusText={error.statusText} />
        <CorrelationIdCard
          correlationId={correlationId}
          copied={copied}
          onCopy={handleCopy}
        />
        <TroubleshootingSteps />
        <ErrorPayloadViewer
          responseBody={error.responseBody}
          showRawHtml={showRawHtml}
          onToggle={() => setShowRawHtml(!showRawHtml)}
        />
        <ErrorActions
          onDismiss={() => GlobalErrorManager.clearError()}
          onReload={() => window.location.reload()}
        />
      </div>
    </div>
  );
};
