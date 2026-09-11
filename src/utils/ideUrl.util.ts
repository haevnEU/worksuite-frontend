import { IdeConfig, StackFrame } from "../models/stacktraceAnalyzer.model";

export const buildIdeUrl = (
  frame: StackFrame,
  config: IdeConfig,
): string | null => {
  if (!frame.fileName) return null;

  // 1. Base-Pfad bereinigen und Slashes normalisieren
  let basePath = config.projectBasePath
    .trim()
    .replace(/\\/g, "/")
    .replace(/\/+$/, "");

  // 2. Automatisch 'src/main/java' anhängen, falls es im Base-Pfad noch fehlt
  if (basePath && !basePath.endsWith("src/main/java")) {
    basePath = `${basePath}/src/main/java`;
  }

  // 3. Relativen Paketpfad aus Klassennamen bilden
  // "de.haevn.worksuite.settings.UserService" -> "de/haevn/worksuite/settings"
  const packageParts = frame.className.split(".");
  packageParts.pop(); // Dateiname/Klasse entfernen
  const relativeDir = packageParts.join("/");

  const relativeFilePath = `${relativeDir}/${frame.fileName}`;
  const fullPath = basePath
    ? `${basePath}/${relativeFilePath}`
    : relativeFilePath;
  const line = frame.lineNumber ?? 1;

  if (config.target === "idea") {
    // IntelliJ URL-Schema
    return `idea://open?file=${fullPath}&line=${line}`;
  }

  if (config.target === "vscode") {
    return `vscode://file/${fullPath}:${line}`;
  }

  return null;
};
