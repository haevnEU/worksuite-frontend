export interface RecordConverterOptions {
  rootRecordName: string;
  useJacksonAnnotations: boolean;
  useBeanValidation: boolean;
  usePrimitiveTypes: boolean;
}

interface ParsedField {
  jsonKey: string;
  javaFieldName: string;
  javaType: string;
  isCustomRecord: boolean;
  childJson?: any;
  childRecordName?: string;
  isList: boolean;
  isNullable: boolean;
}

interface GeneratedRecord {
  recordName: string;
  fields: ParsedField[];
}

const toCamelCase = (str: string): string => {
  return str
    .replace(/[-_]([a-z0-9])/gi, (_, letter) => letter.toUpperCase())
    .replace(/^[A-Z]/, (letter) => letter.toLowerCase());
};

const toPascalCase = (str: string): string => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const inferPrimitiveOrWrapper = (val: any, usePrimitives: boolean): string => {
  if (typeof val === "boolean") return usePrimitives ? "boolean" : "Boolean";
  if (typeof val === "number") {
    if (Number.isInteger(val)) {
      if (val > 2147483647 || val < -2147483648) {
        return usePrimitives ? "long" : "Long";
      }
      return usePrimitives ? "int" : "Integer";
    }
    return usePrimitives ? "double" : "Double";
  }
  if (typeof val === "string") {
    // Optional: ISO Timestamp Check
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
      return "Instant";
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return "LocalDate";
    }
    return "String";
  }
  return "Object";
};

/**
 * Wandelt ein JSON-Objekt in einen oder mehrere Java Records um
 */
export const convertJsonToJavaRecords = (
  jsonString: string,
  options: RecordConverterOptions,
): { code: string; error?: string } => {
  if (!jsonString.trim()) {
    return { code: "" };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err: any) {
    return { code: "", error: `Invalid JSON: ${err.message}` };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return {
      code: "",
      error: "JSON must be an object or an array of objects.",
    };
  }

  const recordsToGenerate: GeneratedRecord[] = [];
  const processedNames = new Set<string>();

  const parseObject = (
    obj: Record<string, any>,
    recordName: string,
  ): string => {
    const validRecordName = toPascalCase(recordName);
    const fields: ParsedField[] = [];

    for (const [key, val] of Object.entries(obj)) {
      const javaFieldName = toCamelCase(key);

      if (val === null || val === undefined) {
        fields.push({
          jsonKey: key,
          javaFieldName,
          javaType: "Object",
          isCustomRecord: false,
          isList: false,
          isNullable: true,
        });
      } else if (Array.isArray(val)) {
        if (val.length === 0) {
          fields.push({
            jsonKey: key,
            javaFieldName,
            javaType: "List<Object>",
            isCustomRecord: false,
            isList: true,
            isNullable: false,
          });
        } else {
          const firstElem = val[0];
          if (typeof firstElem === "object" && firstElem !== null) {
            const childName = toPascalCase(
              key.endsWith("s") ? key.slice(0, -1) : `${key}Item`,
            );
            parseObject(firstElem, childName);
            fields.push({
              jsonKey: key,
              javaFieldName,
              javaType: `List<${childName}>`,
              isCustomRecord: true,
              isList: true,
              isNullable: false,
            });
          } else {
            const elemType = inferPrimitiveOrWrapper(firstElem, false);
            fields.push({
              jsonKey: key,
              javaFieldName,
              javaType: `List<${elemType}>`,
              isCustomRecord: false,
              isList: true,
              isNullable: false,
            });
          }
        }
      } else if (typeof val === "object") {
        const childName = toPascalCase(key);
        parseObject(val, childName);
        fields.push({
          jsonKey: key,
          javaFieldName,
          javaType: childName,
          isCustomRecord: true,
          isList: false,
          isNullable: false,
        });
      } else {
        const javaType = inferPrimitiveOrWrapper(
          val,
          options.usePrimitiveTypes,
        );
        fields.push({
          jsonKey: key,
          javaFieldName,
          javaType,
          isCustomRecord: false,
          isList: false,
          isNullable: false,
        });
      }
    }

    if (!processedNames.has(validRecordName)) {
      processedNames.add(validRecordName);
      recordsToGenerate.push({ recordName: validRecordName, fields });
    }

    return validRecordName;
  };

  const targetObj = Array.isArray(parsed)
    ? parsed.length > 0
      ? parsed[0]
      : {}
    : parsed;
  parseObject(targetObj, options.rootRecordName || "RootDto");

  // Code Rendering
  let imports = new Set<string>();
  if (options.useJacksonAnnotations) {
    imports.add("import com.fasterxml.jackson.annotation.JsonProperty;");
  }
  if (options.useBeanValidation) {
    imports.add("import jakarta.validation.constraints.NotNull;");
    imports.add("import jakarta.validation.constraints.NotBlank;");
  }

  const recordStrings = recordsToGenerate.map(({ recordName, fields }) => {
    const fieldLines = fields.map((f) => {
      const annotations: string[] = [];

      if (options.useJacksonAnnotations && f.jsonKey !== f.javaFieldName) {
        annotations.push(`@JsonProperty("${f.jsonKey}")`);
      }

      if (options.useBeanValidation) {
        if (f.javaType === "String") {
          annotations.push("@NotBlank");
        } else if (!f.isNullable) {
          annotations.push("@NotNull");
        }
      }

      const annoPrefix =
        annotations.length > 0 ? `${annotations.join(" ")} ` : "";
      return `    ${annoPrefix}${f.javaType} ${f.javaFieldName}`;
    });

    return `public record ${recordName}(\n${fieldLines.join(",\n")}\n) {}`;
  });

  const importBlock =
    imports.size > 0 ? `${Array.from(imports).sort().join("\n")}\n\n` : "";
  return { code: `${importBlock}${recordStrings.join("\n\n")}` };
};

/**
 * Erzeugt aus einem Java-Record Definitionstext ein beispielhaftes JSON
 */
export const convertJavaRecordToJson = (
  recordCode: string,
): { json: string; error?: string } => {
  if (!recordCode.trim()) return { json: "" };

  try {
    // Regex für `public record Name( ... )`
    const recordMatch = recordCode.match(
      /record\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)/,
    );
    if (!recordMatch) {
      return {
        json: "",
        error:
          "No valid Java Record declaration found (e.g. 'public record User(String name, int age) {}')",
      };
    }

    const body = recordMatch[2];
    const rawFields = body
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result: Record<string, any> = {};

    for (const rawField of rawFields) {
      // Prüfen auf @JsonProperty("key")
      const jsonPropMatch = rawField.match(
        /@JsonProperty\s*\(\s*["']([^"']+)["']\s*\)/,
      );

      // Bereinigen von Annotationen
      const cleanField = rawField
        .replace(/@[A-Za-z0-9_]+(\([^)]*\))?/g, "")
        .trim();
      const parts = cleanField.split(/\s+/);

      if (parts.length >= 2) {
        const type = parts[parts.length - 2];
        const fieldName = parts[parts.length - 1];
        const finalKey = jsonPropMatch ? jsonPropMatch[1] : fieldName;

        result[finalKey] = getSampleValueForType(type);
      }
    }

    return { json: JSON.stringify(result, null, 2) };
  } catch (err: any) {
    return { json: "", error: `Parsing failed: ${err.message}` };
  }
};

const getSampleValueForType = (type: string): any => {
  const normalized = type.replace(/<.*>/, "").toLowerCase();
  if (type.startsWith("List") || type.startsWith("Set")) return [];
  if (["int", "integer", "long", "short", "byte"].includes(normalized))
    return 0;
  if (["double", "float", "bigdecimal"].includes(normalized)) return 0.0;
  if (["boolean"].includes(normalized)) return true;
  if (["instant", "localdate", "localdatetime"].includes(normalized))
    return "2026-09-12T00:00:00Z";
  if (["uuid"].includes(normalized))
    return "123e4567-e89b-12d3-a456-426614174000";
  return "sample_value";
};
