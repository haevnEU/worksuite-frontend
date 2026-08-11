import {
  TemplatePlatform,
  TemplateTags,
} from "../types/templateResource.type.ts";

export interface TemplateFormData {
  title: string;
  content: string;
  platform: TemplatePlatform;
  tags: TemplateTags;
}
