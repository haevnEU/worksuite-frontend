export interface ValidationRuleItem {
  id: string;
  fieldName: string;
  description: string;
  regex: string;
  choice?: string;
  column: number;
  optional: boolean;
}

export interface ValidationSchema {
  readableName: string;
  schemaName: string;
  headerIdentifier: string;
  idColumn: number;
  idName: string;
  totalColumns: number;
  rules: ValidationRuleItem[];
}
