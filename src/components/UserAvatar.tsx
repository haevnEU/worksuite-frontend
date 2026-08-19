import React from "react";
import { useSettings } from "../context/SettingsContext.tsx";
import { useLicense } from "../context/LicenseContext.tsx";
import { LicensePlan } from "../types/license.type.ts";
import { AuthenticatedImage } from "./AuthenticatedImage.tsx";
import { getAvatarPlanStyles } from "../utils/license.util.ts";

interface UserAvatarProps {
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  className = "w-8 h-8",
}) => {
  const { user, getAvatarUrl } = useSettings();
  const { plan } = useLicense();

  if (user.avatarUrl) {
    return (
      <div
        className={`${className} rounded-lg overflow-hidden shrink-0 border border-slate-700/80`}
      >
        <AuthenticatedImage
          src={getAvatarUrl()}
          alt={user.firstName || "User"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  const planStyles = getAvatarPlanStyles(plan);

  return (
    <div
      className={`${className} rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${planStyles}`}
    >
      {user.firstName?.[0] || "U"}
    </div>
  );
};
