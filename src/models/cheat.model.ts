import {
  CheatCategory,
  CheatLanguage,
  CheatLevel,
} from "../types/cheat.type.ts";

export interface CheatFlag {
  flag: string;
  description: string;
}

export interface CheatExample {
  title: string;
  code: string;
  output?: string;
}

export interface CheatItem {
  id: string;
  title: string;
  syntax: string;
  description: string;
  language: CheatLanguage;
  level?: CheatLevel;
  tags: string[];
  flags?: CheatFlag[];
  examples?: CheatExample[];
}

export interface CheatSection {
  id: string;
  title: string;
  description?: string;
  items: CheatItem[];
}

export interface CheatsheetTopic {
  id: string;
  title: string;
  iconName: string;
  category: CheatCategory;
  summary: string;
  sections: CheatSection[];
}
