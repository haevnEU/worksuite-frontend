import { LicensePlan } from "../types/license.type.ts";

export const getPlanBadge = (plan: LicensePlan) => {
  switch (plan) {
    case "ENTERPRISE":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "PRO":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    case "COMMUNITY":
      return "bg-green-500/10 text-green-400 border-green-500/30";
    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
};
