import { LucideIcon } from "lucide-react";
import { LicensePlan } from "../types/license.type.ts";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
  requiredPlan?: LicensePlan;
}
