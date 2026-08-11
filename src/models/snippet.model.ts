import { SnippetLanguage } from "../types/snippet.type.ts";

export interface SnippetFormDraft {
  id?: string;
  title: string;
  language: SnippetLanguage;
  content: string;
  tagsStr: string;
}
