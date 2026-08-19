import { LicensePlan } from "../types/license.type.ts";

export const getAvatarPlanStyles = (plan: LicensePlan): string => {
  switch (plan) {
    case "ENTERPRISE":
      return "bg-purple-600/20 border-purple-500/40 text-purple-400";
    case "PRO":
      return "bg-cyan-600/20 border-cyan-500/40 text-cyan-400";
    case "COMMUNITY":
      return "bg-emerald-600/20 border-emerald-500/40 text-emerald-400";
    default:
      return "bg-rose-600/20 border-rose-500/40 text-rose-400";
  }
};

export const getPlanBadge = (plan: LicensePlan) => {
  switch (plan) {
    case "ENTERPRISE":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "PRO":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    case "COMMUNITY":
      return "bg-green-500/10 text-green-400 border-green-500/30";
    default:
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  }
};

export const getLogoStyles = (plan: LicensePlan): string => {
  switch (plan) {
    case "ENTERPRISE":
      return "bg-gradient-to-br from-purple-600 to-purple-800 shadow-purple-600/30 text-white";
    case "PRO":
      return "bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-cyan-500/30 text-white";
    case "COMMUNITY":
      return "bg-gradient-to-br from-emerald-500 to-green-700 shadow-green-600/30 text-white";
    default:
      return "bg-gradient-to-br from-rose-600 to-red-800 shadow-rose-600/30 text-white";
  }
};

export const getAppBackgroundStyles = (plan: LicensePlan): string => {
  switch (plan) {
    case "ENTERPRISE":
      return "bg-gradient-to-br from-slate-950 via-slate-950/90 to-purple-900/35";
    case "PRO":
      return "bg-gradient-to-br from-slate-950 via-slate-950/90 to-cyan-900/35";
    case "COMMUNITY":
      return "bg-gradient-to-br from-slate-950 via-slate-950/85 to-emerald-900/40";
    default:
      return "bg-gradient-to-br from-slate-950 via-slate-950/85 to-rose-950/45";
  }
};
