import React from "react";
import { useSettings } from "../../context/SettingsContext.tsx";
import { AuthenticatedImage } from "../AuthenticatedImage.tsx";

export const HeaderUserAvatar: React.FC = () => {
  const { user, getAvatarUrl } = useSettings();

  return (
    <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
      {user.avatarUrl ? (
        <AuthenticatedImage
          src={getAvatarUrl()}
          alt={user.firstName}
          className="w-8 h-8 rounded-lg object-cover border border-slate-600 shrink-0"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
          {user.firstName?.[0] || "U"}
        </div>
      )}
    </div>
  );
};
