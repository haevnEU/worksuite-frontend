import {
  TemplatePlatform,
  TemplateTags,
} from "../types/templateResource.type.ts";

export interface TemplateResource {
  id?: string;
  title: string;
  content: string;
  tags: TemplateTags[];
  platform: TemplatePlatform;
  createdAt?: string;
}
