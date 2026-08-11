import React, { useState } from "react";
import { Camera, Upload, User } from "lucide-react";
import { useSettings } from "../../context/SettingsContext.tsx";
import { AuthenticatedImage } from "../AuthenticatedImage.tsx";

export const AvatarSection: React.FC = () => {
  const { user, updateAvatar, getAvatarUrl } = useSettings();
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await updateAvatar(file);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const avatarUrl = getAvatarUrl();

  return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-extrabold text-white">Avatar</h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
          Profile Picture
        </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-xs">
          {/* HIER STRIKTE GRÖSSE (80x80px) FESTLEGEN */}
          <div className="relative shrink-0 w-20 h-20 max-w-20 max-h-20">
            <div className="w-full h-full rounded-2xl bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center text-slate-400 shadow-md">
              {user?.avatarUrl && avatarUrl ? (
                  <AuthenticatedImage
                      src={avatarUrl}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                  />
              ) : (
                  <User className="w-8 h-8 text-slate-500" />
              )}
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div>
              <h3 className="font-bold text-white text-xs">Upload new avatar</h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Allowed formats: PNG, JPG or WebP.
              </p>
            </div>

            <div className="pt-1">
              <label className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-md">
                <Upload className="w-4 h-4" />
                <span>{isUploading ? "Uploading..." : "Choose Image"}</span>
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleAvatarChange}
                    disabled={isUploading}
                    className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
  );
};