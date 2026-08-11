import React from "react";
import { X } from "lucide-react";
import { SnippetCodeEditor } from "./SnippetCodeEditor.tsx";
import { SnippetLanguage } from "../../types/snippet.type.ts";
import { SnippetFormDraft } from "../../models/snippet.model.ts";

interface SnippetModalProps {
  isOpen: boolean;
  form: SnippetFormDraft;
  onFormChange: (updated: SnippetFormDraft) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SnippetModal: React.FC<SnippetModalProps> = ({
  isOpen,
  form,
  onFormChange,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-800 space-y-4 text-xs font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              {form.id ? "Edit Snippet" : "Create a new Snippet"}
            </h3>
            {form.id && (
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                ID: {form.id}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) => onFormChange({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Language
            </label>
            <select
              value={form.language}
              onChange={(e) =>
                onFormChange({
                  ...form,
                  language: e.target.value as SnippetLanguage,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="text">Text / Plain</option>
              <option value="bash">Bash / Shell / zsh</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="css">CSS</option>
              <option value="docker">Docker / Dockerfile</option>
              <option value="go">Go</option>
              <option value="html">HTML</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="json">JSON</option>
              <option value="kotlin">Kotlin</option>
              <option value="markdown">Markdown</option>
              <option value="php">PHP</option>
              <option value="python">Python</option>
              <option value="ruby">Ruby</option>
              <option value="rust">Rust</option>
              <option value="sql">SQL</option>
              <option value="swift">Swift</option>
              <option value="typescript">TypeScript</option>
              <option value="xml">XML</option>
              <option value="yaml">YAML</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Content / Code *
            </label>
            <SnippetCodeEditor
              value={form.content}
              language={form.language}
              onChange={(val) => onFormChange({ ...form, content: val })}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. docker, spring, api"
              value={form.tagsStr}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) =>
                onFormChange({ ...form, tagsStr: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              className="px-4 py-2 text-slate-400 hover:text-white font-semibold cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              {form.id ? "Update snippet" : "Save snippet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
