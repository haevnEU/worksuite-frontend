export interface RegexMatchResult {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexTestOutput {
  isValid: boolean;
  error?: string;
  matches: RegexMatchResult[];
  highlightedHtml: string;
}

/**
 * Wandelt einen Standard-Regex in ein gültiges Java String-Literal um.
 * Bsp: \d+ -> "\\d+"
 */
export const toJavaRegexLiteral = (pattern: string): string => {
  return pattern.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
};

/**
 * Wandelt einen aus Java kopierten String (Double-Escaped) wieder in Standard-Regex zurück.
 * Bsp: "\\d+" oder \\d+ -> \d+
 */
export const fromJavaRegexLiteral = (javaLiteral: string): string => {
  let cleaned = javaLiteral.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }
  return cleaned.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
};

/**
 * Erzeugt einsatzbereiten Java-Code für Pattern / Matcher.
 */
export const generateJavaSnippet = (
  pattern: string,
  flags: {
    global: boolean;
    caseInsensitive: boolean;
    multiline: boolean;
    dotAll: boolean;
  },
  varName = "pattern",
): string => {
  const javaString = toJavaRegexLiteral(pattern);
  const flagList: string[] = [];

  if (flags.caseInsensitive) flagList.push("Pattern.CASE_INSENSITIVE");
  if (flags.multiline) flagList.push("Pattern.MULTILINE");
  if (flags.dotAll) flagList.push("Pattern.DOTALL");

  const flagArgs = flagList.length > 0 ? `, ${flagList.join(" | ")}` : "";

  return `// Pattern Compilation
private static final Pattern ${varName.toUpperCase()}_PATTERN = 
    Pattern.compile("${javaString}"${flagArgs});

// Usage Example
Matcher matcher = ${varName.toUpperCase()}_PATTERN.matcher(input);
while (matcher.find()) {
    String fullMatch = matcher.group();
    // String group1 = matcher.group(1);
}`;
};

/**
 * Führt den Match-Test durch und erzeugt hervorgehobenen Text.
 */
export const executeRegexTest = (
  patternStr: string,
  flags: { caseInsensitive: boolean; multiline: boolean; dotAll: boolean },
  testString: string,
): RegexTestOutput => {
  if (!patternStr) {
    return {
      isValid: true,
      matches: [],
      highlightedHtml: escapeHtml(testString),
    };
  }

  let flagStr = "g";
  if (flags.caseInsensitive) flagStr += "i";
  if (flags.multiline) flagStr += "m";
  if (flags.dotAll) flagStr += "s";

  try {
    const regex = new RegExp(patternStr, flagStr);
    const matches: RegexMatchResult[] = [];
    let match: RegExpExecArray | null;

    // Schutz vor Endlosschleifen bei Zero-Width Matches (z. B. ^, $)
    let lastIndex = -1;
    while ((match = regex.exec(testString)) !== null) {
      if (regex.lastIndex === lastIndex) {
        regex.lastIndex++;
      }
      lastIndex = regex.lastIndex;

      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1),
      });

      if (!regex.global) break;
    }

    // HTML Highlighter generieren
    let highlightedHtml = "";
    let currentIndex = 0;

    matches.forEach((m, idx) => {
      // Unmatched Text davor
      highlightedHtml += escapeHtml(
        testString.substring(currentIndex, m.index),
      );
      // Gematchter Text mit Badge
      highlightedHtml += `<mark class="bg-emerald-500/30 text-emerald-300 rounded px-1 border border-emerald-500/40 font-mono" title="Match #${idx + 1}">${escapeHtml(
        m.match || " ",
      )}</mark>`;
      currentIndex = m.index + m.match.length;
    });
    highlightedHtml += escapeHtml(testString.substring(currentIndex));

    return {
      isValid: true,
      matches,
      highlightedHtml,
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: err.message,
      matches: [],
      highlightedHtml: escapeHtml(testString),
    };
  }
};

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
