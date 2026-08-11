import React, { useRef } from "react";
import { Eye, Sparkles, X } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MarkdownPreview } from "./MarkdownPreview.tsx";
import {
  TemplatePlatform,
  TemplateTags,
} from "../../types/templateResource.type.ts";
import { TemplateFormData } from "../../models/templae.model.ts";
import {
  TEMPLATE_PLATFORMS,
  TEMPLATE_TAGS,
} from "../../constants/templateResource.constant.ts";

interface CreateTemplateModalProps {
  isOpen: boolean;
  form: TemplateFormData;
  onFormChange: (updated: TemplateFormData) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  form,
  onFormChange,
  onClose,
  onSubmit,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const highlighterRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (textareaRef.current && highlighterRef.current) {
      highlighterRef.current.scrollTop = textareaRef.current.scrollTop;
      highlighterRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-white font-extrabold text-base">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>Create new template</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Template Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              placeholder="e.g. Release Deployment Checklist"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) => onFormChange({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Platform
              </label>
              <select
                value={form.platform}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white capitalize"
                onChange={(e) =>
                  onFormChange({
                    ...form,
                    platform: e.target.value as TemplatePlatform,
                  })
                }
              >
                {TEMPLATE_PLATFORMS.map((platform) => (
                  <option
                    key={platform}
                    value={platform}
                    className="capitalize"
                  >
                    {platform}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Category
              </label>
              <select
                value={form.tags}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                onChange={(e) =>
                  onFormChange({
                    ...form,
                    tags: e.target.value as TemplateTags,
                  })
                }
              >
                {TEMPLATE_TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Editor Container */}
            <div className="space-y-1">
              <label className="block text-slate-300 font-semibold">
                Template Content (Markdown Editor) *
              </label>
              <p className="text-[11px] text-slate-400 mb-1">
                Platzhalter wie{" "}
                <code className="text-blue-400 font-mono">
                  &#123;DATE&#125;
                </code>{" "}
                oder{" "}
                <code className="text-blue-400 font-mono">
                  &#123;USER&#125;
                </code>{" "}
                erlaubt.
              </p>
              <div className="relative h-64 w-full rounded-xl border border-slate-700 bg-slate-950 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20">
                <div
                  ref={highlighterRef}
                  className="absolute inset-0 pointer-events-none overflow-hidden p-3"
                  style={{ boxSizing: "border-box" }}
                >
                  <SyntaxHighlighter
                    language="markdown"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: 0,
                      fontSize: "12px",
                      lineHeight: "1.6",
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                      background: "transparent",
                      tabSize: 2,
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                        fontSize: "12px",
                        lineHeight: "1.6",
                      },
                    }}
                    wrapLongLines={false}
                  >
                    {form.content ? form.content + "\n" : " "}
                  </SyntaxHighlighter>
                </div>

                <textarea
                  ref={textareaRef}
                  required
                  value={form.content}
                  onScroll={handleScroll}
                  onChange={(e) =>
                    onFormChange({ ...form, content: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const target = e.currentTarget;
                      const start = target.selectionStart;
                      const end = target.selectionEnd;
                      const val = target.value;
                      const newValue =
                        val.substring(0, start) + "  " + val.substring(end);
                      onFormChange({ ...form, content: newValue });
                      setTimeout(() => {
                        target.selectionStart = target.selectionEnd = start + 2;
                      }, 0);
                    }
                  }}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  placeholder={`## Problem Description\n\n## Steps to Reproduce\n1. \n2. \n\n## System\nDate: {DATE}\nTester: {USER}`}
                  className="absolute inset-0 w-full h-full p-3 bg-transparent text-transparent caret-white font-mono text-xs leading-relaxed resize-none focus:outline-none whitespace-pre overflow-auto"
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    fontSize: "12px",
                    lineHeight: "1.6",
                    tabSize: 2,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Live Markdown Preview</span>
              </label>
              <p className="text-[11px] text-slate-400 mb-1">
                Formatierte Ansicht für Dokumentationen & Tickets.
              </p>
              <div className="h-64 w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 overflow-auto text-xs font-sans">
                <MarkdownPreview text={form.content} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-md"
            >
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
