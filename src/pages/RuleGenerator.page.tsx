import React, { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  RuleEditorList,
  RuleGeneratorHeader,
  SchemaMetaCard,
  XmlOutputModal,
} from "../components/validation";
import {
  ValidationRuleItem,
  ValidationSchema,
} from "../models/validationSchema.model.ts";
import { validationService } from "../services/network/validation.service.ts";
import { parseXmlToSchema } from "../utils/xml.utils.ts";

const INITIAL_SCHEMA: ValidationSchema = {
  readableName: "Smart-Meter Restanten",
  schemaName: "SMLeftover",
  headerIdentifier: "MELO",
  idColumn: 0,
  idName: "MELO",
  totalColumns: 4,
  rules: [
    {
      id: "r-1",
      fieldName: "MeLo",
      description: "",
      regex: "[A-Z]{2}[0-9]{6}[0-9]{5}[0-9A-Z]{20}",
      choice: "",
      column: 0,
      optional: false,
    },
    {
      id: "r-2",
      fieldName: "Altzählernummer",
      description: "",
      regex: "[A-Z]*[0-9]+|[0-9][A-Z]{3}[0-9A-F]{2}[0-9]{8}",
      choice: "",
      column: 1,
      optional: false,
    },
    {
      id: "r-3",
      fieldName: "Mechaniker-ID",
      description: "",
      regex: "\\d*",
      choice: "",
      column: 2,
      optional: false,
    },
    {
      id: "r-4",
      fieldName: "Termin",
      description: "",
      regex: "^\\d{2}\\.\\d{2}\\.\\d{4} \\d{2}:\\d{2}$",
      choice: "",
      column: 3,
      optional: false,
    },
  ],
};

export const RuleGeneratorPage: React.FC = () => {
  const [schema, setSchema] = useState<ValidationSchema>(INITIAL_SCHEMA);
  const [xmlContent, setXmlContent] = useState<string>("");
  const [isLoadingView, setIsLoadingView] = useState<boolean>(false);
  const [isLoadingExport, setIsLoadingExport] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState<boolean>(false);

  // XML vom Backend abfragen
  const fetchGeneratedXml = async (): Promise<string> => {
    const payload: ValidationSchema = {
      ...schema,
      totalColumns: schema.rules.length,
    };
    return await validationService.generateXml(payload);
  };

  // 1. View XML: Generieren und Modal öffnen
  const handleViewXml = async () => {
    setIsLoadingView(true);
    setError(null);
    try {
      const generated = await fetchGeneratedXml();
      setXmlContent(generated);
      setIsOutputModalOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate XML schema from backend.",
      );
    } finally {
      setIsLoadingView(false);
    }
  };

  // Helper zum Triggern des File-Downloads
  const triggerDownload = (content: string, filename: string) => {
    const blob = new Blob([content], {
      type: "application/xml;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename || "validation_schema"}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Export XML: Generieren und sofort herunterladen (ohne Modal)
  const handleExportXml = async () => {
    setIsLoadingExport(true);
    setError(null);
    try {
      const generated = await fetchGeneratedXml();
      setXmlContent(generated);
      triggerDownload(generated, schema.schemaName);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to export XML schema from backend.",
      );
    } finally {
      setIsLoadingExport(false);
    }
  };

  const handleImportXml = (importedXml: string, fileName: string) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const parsedSchema = parseXmlToSchema(importedXml);
      setSchema({ ...parsedSchema });
      setXmlContent(importedXml);
      setSuccessMessage(
        `Importiert: ${fileName} (${parsedSchema.rules.length} Regeln)`,
      );
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Fehler beim Parsen der XML-Datei.",
      );
    }
  };

  const handleMetaChange = (field: keyof ValidationSchema, value: any) => {
    setSchema((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddRule = () => {
    setSchema((prev) => {
      const nextCol = prev.rules.length;
      const newRule: ValidationRuleItem = {
        id: `rule-${Date.now()}`,
        fieldName: `Column_${nextCol + 1}`,
        description: "",
        regex: ".*",
        choice: "",
        column: nextCol,
        optional: false,
      };
      return {
        ...prev,
        rules: [...prev.rules, newRule],
      };
    });
  };

  const handleChangeRule = (
    id: string,
    field: keyof ValidationRuleItem,
    value: any,
  ) => {
    setSchema((prev) => ({
      ...prev,
      rules: prev.rules.map((r) =>
        r.id === id ? { ...r, [field]: value } : r,
      ),
    }));
  };

  const handleDeleteRule = (id: string) => {
    setSchema((prev) => ({
      ...prev,
      rules: prev.rules
        .filter((r) => r.id !== id)
        .map((r, idx) => ({ ...r, column: idx })),
    }));
  };

  const handleMoveRule = (index: number, direction: "up" | "down") => {
    setSchema((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.rules.length) return prev;

      const updated = [...prev.rules];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;

      return {
        ...prev,
        rules: updated.map((r, idx) => ({ ...r, column: idx })),
      };
    });
  };

  const handleCopy = () => {
    if (!xmlContent) return;
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-200">
      <RuleGeneratorHeader
        onAddRule={handleAddRule}
        onViewXml={handleViewXml}
        onExportXml={handleExportXml}
        onImportXml={handleImportXml}
        isLoadingView={isLoadingView}
        isLoadingExport={isLoadingExport}
        onLoadExample={() => setSchema(INITIAL_SCHEMA)}
      />

      {successMessage && (
        <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 px-4 py-3 rounded-xl text-xs transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-rose-950/40 border border-rose-800/60 text-rose-300 px-4 py-3 rounded-xl text-xs transition-all">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <SchemaMetaCard schema={schema} onChange={handleMetaChange} />

      <RuleEditorList
        rules={schema.rules}
        onChangeRule={handleChangeRule}
        onDeleteRule={handleDeleteRule}
        onMoveRule={handleMoveRule}
      />

      {/* Modal nur geöffnet bei 'View XML Output' */}
      <XmlOutputModal
        isOpen={isOutputModalOpen}
        onClose={() => setIsOutputModalOpen(false)}
        xmlContent={xmlContent}
        onCopy={handleCopy}
        onDownload={() => triggerDownload(xmlContent, schema.schemaName)}
        copied={copied}
        schemaName={schema.schemaName}
      />
    </div>
  );
};

export default RuleGeneratorPage;
