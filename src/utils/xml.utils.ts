import {
  ValidationRuleItem,
  ValidationSchema,
} from "../models/validationSchema.model.ts";

export const parseXmlToSchema = (xmlText: string): ValidationSchema => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  const parseError = xmlDoc.querySelector("parsererror");
  if (parseError) {
    throw new Error(
      `Ungültiges XML: ${parseError.textContent?.split("\n")[0] || "Syntaxfehler"}`,
    );
  }

  const validationEl = xmlDoc.querySelector("validation");
  if (!validationEl) {
    throw new Error("Kein <validation> Root-Element im XML gefunden.");
  }

  // 1. Attribute auflösen (inkl. Fallbacks wie headerIdentifierColumn vs. idColumn)
  const readableName = validationEl.getAttribute("readableName") ?? "";
  const schemaName = validationEl.getAttribute("schemaName") ?? "";
  const headerIdentifier = validationEl.getAttribute("headerIdentifier") ?? "";

  const rawIdCol =
    validationEl.getAttribute("headerIdentifierColumn") ??
    validationEl.getAttribute("idColumn");
  const idColumn =
    rawIdCol !== null && !isNaN(Number(rawIdCol)) ? Number(rawIdCol) : 0;

  const idName = validationEl.getAttribute("idName") ?? "";

  // 2. Alle <rule>-Elemente erfassen (egal ob direkt unter <validation> oder in <rules>)
  const ruleNodes = Array.from(xmlDoc.getElementsByTagName("rule"));

  const rules: ValidationRuleItem[] = ruleNodes.map((ruleEl, index) => {
    const getNodeText = (tagName: string): string => {
      const nodes = ruleEl.getElementsByTagName(tagName);
      return nodes.length > 0 ? (nodes[0].textContent?.trim() ?? "") : "";
    };

    const fieldName = getNodeText("fieldName") || `Column_${index + 1}`;
    const description = getNodeText("description");
    const regex = getNodeText("regex");
    const choice = getNodeText("choice");

    const rawCol = getNodeText("column");
    const column =
      rawCol !== "" && !isNaN(Number(rawCol)) ? Number(rawCol) : index;

    const optionalStr = getNodeText("optional");
    const optional = optionalStr.toLowerCase() === "true";

    return {
      id: `rule-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      fieldName,
      description,
      regex,
      choice: choice || "",
      column,
      optional,
    };
  });

  const rawTotalColumns = validationEl.getAttribute("totalColumns");
  const totalColumns =
    rawTotalColumns !== null && !isNaN(Number(rawTotalColumns))
      ? Number(rawTotalColumns)
      : rules.length;

  return {
    readableName,
    schemaName,
    headerIdentifier,
    idColumn,
    idName,
    totalColumns,
    rules,
  };
};
