import React, { useState } from "react";
import { Database, Eye, EyeOff, Key, Save, ShieldCheck } from "lucide-react";
import { useSettings } from "../../context/SettingsContext.tsx";

export const RedmineKeySection: React.FC = () => {
  const { updateRedmineKey, hasRedmineKey } = useSettings();
  const [redmineApiKey, setRedmineApiKeyInput] = useState<string>("");
  const [showRedmineToken, setShowRedmineToken] = useState(false);

  const handleRedmineSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateRedmineKey(redmineApiKey);
    setRedmineApiKeyInput("");
  };

  return (
    <form
      onSubmit={handleRedmineSubmit}
      className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-extrabold text-white">Redmine</h2>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/60">
          Issue Tracking
        </span>
      </div>

      {hasRedmineKey && (
        <div className="p-3.5 bg-rose-950/30 border border-rose-800/50 rounded-xl flex items-start space-x-3 text-xs text-rose-200">
          <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-300">
              API Key already configured
            </p>
            <p className="text-rose-200/80 mt-0.5">
              For security reasons, the current access token is hidden. Saving a
              new value will replace the existing key.
            </p>
          </div>
        </div>
      )}

      <div className="text-xs">
        <label className="block font-bold text-slate-300 mb-1.5 flex items-center space-x-1">
          <Key className="w-3.5 h-3.5 text-slate-400" />
          <span>Redmine API Key (Access Token)</span>
        </label>
        <div className="relative">
          <input
            type={showRedmineToken ? "text" : "password"}
            value={redmineApiKey}
            onChange={(e) => setRedmineApiKeyInput(e.target.value)}
            placeholder={
              hasRedmineKey
                ? "Enter new key to overwrite..."
                : "40a1b2c3d4e5f67890abcdef..."
            }
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pr-10 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          />
          <button
            type="button"
            onClick={() => setShowRedmineToken(!showRedmineToken)}
            className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
          >
            {showRedmineToken ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors text-xs flex items-center space-x-2 cursor-pointer shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>
            {hasRedmineKey ? "Overwrite Redmine Key" : "Save Redmine API Key"}
          </span>
        </button>
      </div>
    </form>
  );
};
