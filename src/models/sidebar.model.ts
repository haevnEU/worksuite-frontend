import { LucideIcon } from "lucide-react";
import { LicensePlan } from "../types/license.type.ts";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
  requiredPlan?: LicensePlan;
}

export type StatusDotVariant = "emerald" | "amber" | "rose" | "blue" | "purple";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
  requiredPlan?: LicensePlan;
  statusDot?: {
    variant: StatusDotVariant;
    pulse?: boolean;
    tooltip?: string;
  };
}
