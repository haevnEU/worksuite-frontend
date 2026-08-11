import {
  TEMPLATE_PLATFORMS,
  TEMPLATE_TAGS,
} from "../constants/templateResource.constant.ts";

export type TemplatePlatform = (typeof TEMPLATE_PLATFORMS)[number];
export type TemplateTags = (typeof TEMPLATE_TAGS)[number];
