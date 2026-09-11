import React, { useMemo, useState } from "react";
import {
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Terminal,
  Layers,
  Flag,
  Eye,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import {
  CheatSheetLevel,
  CheatSheetRequestDto,
  CheatSheetResponseDto,
  FlagDto,
  ExampleDto,
} from "../../models/cheatSheet.model.ts";
import { getLevelBadgeClass } from "../../utils/cheat.util.ts";
import { cheatSheetService } from "../../services/network/cheatSheet.service.ts";

interface CreateCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const SUPPORTED_LANGUAGES = [
  { label: "Bash / Shell", value: "BASH" },
  { label: "curl", value: "CURL" },
  { label: "SQL", value: "SQL" },
  { label: "Java", value: "JAVA" },
  { label: "TypeScript", value: "TYPESCRIPT" },
  { label: "JavaScript", value: "JAVASCRIPT" },
  { label: "Docker / Dockerfile", value: "DOCKER" },
  { label: "Git", value: "GIT" },
  { label: "Python", value: "PYTHON" },
  { label: "YAML", value: "YAML" },
  { label: "JSON", value: "JSON" },
  { label: "Markdown", value: "MARKDOWN" },
  { label: "Gradle / Groovy / Kotlin", value: "GRADLE" },
  { label: "Other / Custom", value: "OTHER" },
] as const;

const INITIAL_FORM: CheatSheetRequestDto = {
  category: "git",
  subcategory: "",
  title: "",
  language: "BASH",
  level: "BASIC",
  syntax: "",
  explanation: "",
  flags: [],
  examples: [],
  tags: [],
  destructive: false,
  warning: "",
  docUrl: "",
};

export const CreateCheatSheetModal: React.FC<CreateCheatSheetModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [form, setForm] = useState<CheatSheetRequestDto>(INITIAL_FORM);
  const [selectedLangOption, setSelectedLangOption] = useState<string>("BASH");
  const [customLanguage, setCustomLanguage] = useState<string>("");
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);

  const currentLanguage =
    selectedLangOption === "OTHER"
      ? customLanguage.trim().toUpperCase() || "TEXT"
      : form.language;

  const previewItem: CheatSheetResponseDto = useMemo(() => {
    return {
      id: "preview-id",
      title: form.title.trim() || "Untitled Command",
      category: form.category.trim() || "general",
      subcategory: form.subcategory?.trim() || undefined,
      language: currentLanguage,
      level: form.level,
      syntax: form.syntax.trim() || "# your command will appear here",
      explanation:
        form.explanation.trim() ||
        "Enter a detailed explanation to see the live rendering...",
      flags:
        form.flags?.filter((f) => f.flag.trim() || f.description.trim()) || [],
      examples:
        form.examples?.filter((ex) => ex.title.trim() || ex.command.trim()) ||
        [],
      tags: form.tags || [],
      destructive: form.destructive,
      warning: form.destructive
        ? form.warning?.trim() || "Warning: destructive operation"
        : undefined,
      docUrl: form.docUrl?.trim() || undefined,
    };
  }, [form, currentLanguage]);

  if (!isOpen) return null;

  const handleCopyPreview = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 1500);
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLangOption(value);
    if (value !== "OTHER") {
      setForm((prev) => ({ ...prev, language: value }));
    } else {
      setForm((prev) => ({ ...prev, language: customLanguage.toUpperCase() }));
    }
  };

  const handleCustomLanguageChange = (value: string) => {
    setCustomLanguage(value);
    setForm((prev) => ({ ...prev, language: value.trim().toUpperCase() }));
  };

  const handleAddFlag = () => {
    setForm((prev) => ({
      ...prev,
      flags: [...(prev.flags || []), { flag: "", description: "" }],
    }));
  };

  const handleUpdateFlag = (
    index: number,
    field: keyof FlagDto,
    value: string,
  ) => {
    setForm((prev) => {
      const updated = [...(prev.flags || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, flags: updated };
    });
  };

  const handleRemoveFlag = (index: number) => {
    setForm((prev) => ({
      ...prev,
      flags: (prev.flags || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddExample = () => {
    setForm((prev) => ({
      ...prev,
      examples: [...(prev.examples || []), { title: "", command: "" }],
    }));
  };

  const handleUpdateExample = (
    index: number,
    field: keyof ExampleDto,
    value: string,
  ) => {
    setForm((prev) => {
      const updated = [...(prev.examples || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, examples: updated };
    });
  };

  const handleRemoveExample = (index: number) => {
    setForm((prev) => ({
      ...prev,
      examples: (prev.examples || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, "");
      if (!form.tags?.includes(cleanTag)) {
        setForm((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), cleanTag],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: CheatSheetRequestDto = {
        ...form,
        language: currentLanguage,
        flags: form.flags?.filter((f) => f.flag.trim() && f.description.trim()),
        examples: form.examples?.filter(
          (ex) => ex.title.trim() && ex.command.trim(),
        ),
        warning: form.destructive ? form.warning : undefined,
      };

      const result = await cheatSheetService.create(payload);
      if (result) {
        setForm(INITIAL_FORM);
        setSelectedLangOption("BASH");
        setCustomLanguage("");
        onCreated();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Create Cheat Sheet
              </h2>
              <p className="text-[11px] text-slate-400">
                Configure command metadata with real-time drawer preview
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split: Formular (Links) & Live Preview (Rechts) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Linke Seite: Formular */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 overflow-y-auto p-6 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Create & switch branch"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Language *
                </label>
                <div className="space-y-2">
                  <select
                    value={selectedLangOption}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>

                  {selectedLangOption === "OTHER" && (
                    <input
                      required
                      type="text"
                      placeholder="Custom language (e.g. RUST, GO)"
                      value={customLanguage}
                      onChange={(e) =>
                        handleCustomLanguageChange(e.target.value)
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 placeholder-slate-600 uppercase focus:outline-none focus:border-blue-500"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Category *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. git, docker, database"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value.toLowerCase() })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  placeholder="e.g. branching, volumes"
                  value={form.subcategory || ""}
                  onChange={(e) =>
                    setForm({ ...form, subcategory: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Level *
                </label>
                <select
                  value={form.level}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      level: e.target.value as CheatSheetLevel,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="BASIC">BASIC</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
              </div>
            </div>

            {/* Syntax */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Syntax / Command *
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. git switch -c <branch-name>"
                value={form.syntax}
                onChange={(e) => setForm({ ...form, syntax: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Explanation *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Detailed description of what this command accomplishes..."
                value={form.explanation}
                onChange={(e) =>
                  setForm({ ...form, explanation: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Flags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-slate-400">
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  Flags & Options
                </span>
                <button
                  type="button"
                  onClick={handleAddFlag}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Flag
                </button>
              </div>

              {form.flags?.map((f, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Flag (-c)"
                    value={f.flag}
                    onChange={(e) =>
                      handleUpdateFlag(i, "flag", e.target.value)
                    }
                    className="w-28 font-mono bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-emerald-400"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={f.description}
                    onChange={(e) =>
                      handleUpdateFlag(i, "description", e.target.value)
                    }
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFlag(i)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Examples */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Practical Examples
                </span>
                <button
                  type="button"
                  onClick={handleAddExample}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Example
                </button>
              </div>

              {form.examples?.map((ex, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2"
                >
                  <div className="flex justify-between items-center gap-2">
                    <input
                      type="text"
                      placeholder="Example Title (e.g. Create feature branch)"
                      value={ex.title}
                      onChange={(e) =>
                        handleUpdateExample(i, "title", e.target.value)
                      }
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExample(i)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Command (git switch -c feat/test)"
                    value={ex.command}
                    onChange={(e) =>
                      handleUpdateExample(i, "command", e.target.value)
                    }
                    className="w-full font-mono text-[11px] bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-blue-300"
                  />
                </div>
              ))}
            </div>

            {/* Destructive Action */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={form.destructive}
                  onChange={(e) =>
                    setForm({ ...form, destructive: e.target.checked })
                  }
                  className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Destructive Command
                </span>
              </label>

              {form.destructive && (
                <input
                  type="text"
                  placeholder="Warning message (e.g. Irreversibly drops database table)"
                  value={form.warning || ""}
                  onChange={(e) =>
                    setForm({ ...form, warning: e.target.value })
                  }
                  className="w-full bg-rose-950/20 border border-rose-900/40 rounded-lg px-3 py-1.5 text-rose-300 placeholder-rose-700/60"
                />
              )}
            </div>

            {/* Tags & Documentation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Tags (Press Enter)
                </label>
                <input
                  type="text"
                  placeholder="Type tag and press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {form.tags?.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-400 ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Documentation URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.docUrl || ""}
                  onChange={(e) => setForm({ ...form, docUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </form>

          {/* Rechte Seite: Live Preview */}
          <div className="lg:col-span-5 bg-slate-950/60 flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between text-slate-400 bg-slate-900/40">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-300">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                Live Preview (Detail Drawer)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Real-time
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
              {/* Preview Header */}
              <div className="pb-3 border-b border-slate-800 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">
                    {previewItem.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${getLevelBadgeClass(
                      previewItem.level,
                    )}`}
                  >
                    {previewItem.level}
                  </span>
                  {previewItem.destructive && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border bg-rose-500/10 text-rose-400 border-rose-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> Destructive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
                  <span>Language: {previewItem.language}</span>
                  <span>• {previewItem.category}</span>
                  {previewItem.subcategory && (
                    <span>/ {previewItem.subcategory}</span>
                  )}
                </div>
              </div>

              {/* Warning Preview */}
              {previewItem.warning && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span className="text-[11px] leading-relaxed">
                    {previewItem.warning}
                  </span>
                </div>
              )}

              {/* Syntax Preview */}
              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Syntax & Command
                </span>
                <div className="relative group">
                  <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed pr-10">
                    {previewItem.syntax}
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopyPreview(previewItem.syntax)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
                    title="Copy Syntax"
                  >
                    {copiedPreview ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Explanation Preview */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Explanation
                </span>
                <p className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 leading-relaxed">
                  {previewItem.explanation}
                </p>
              </div>

              {/* Flags Preview */}
              {previewItem.flags.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <Flag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Options & Flags</span>
                  </div>
                  <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                    {previewItem.flags.map((f, idx) => (
                      <div key={idx} className="p-2.5 flex items-start gap-3">
                        <code className="font-mono text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                          {f.flag || "--flag"}
                        </code>
                        <span className="text-[11px] text-slate-400 leading-relaxed">
                          {f.description || "Description..."}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples Preview */}
              {previewItem.examples.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Practical Examples</span>
                  </div>
                  {previewItem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1.5"
                    >
                      <div className="font-semibold text-slate-300 text-[11px]">
                        {ex.title || "Example Title"}
                      </div>
                      <pre className="font-mono text-[11px] text-blue-300 overflow-x-auto">
                        {ex.command || "# command here"}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer Preview */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap text-[11px]">
                {previewItem.docUrl ? (
                  <span className="inline-flex items-center gap-1.5 text-indigo-400">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Official Documentation</span>
                  </span>
                ) : (
                  <span className="text-slate-600 text-[10px]">
                    No doc link provided
                  </span>
                )}
                {previewItem.tags && previewItem.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap ml-auto">
                    {previewItem.tags.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-2 shrink-0 bg-slate-900/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !form.title.trim() || !form.syntax.trim()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Create Cheat Sheet"}
          </button>
        </div>
      </div>
    </div>
  );
};
