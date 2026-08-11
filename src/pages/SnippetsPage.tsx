import React, { useEffect, useState } from "react";
import { useLocalStorageDraft } from "../hooks/useLocalStorageDraft.ts";
import { ShareableResource } from "../models/shareableResource.model.ts";
import { snippetService } from "../services/network/snippet.service.ts";
import { SnippetCard } from "../components/snippets/SnippetCard.tsx";
import { SnippetModal } from "../components/snippets/SnippetModal.tsx";
import { SnippetsHeader } from "../components/snippets/SnippetsHeader.tsx";
import { SnippetLanguage } from "../types/snippet.type.ts";
import { SnippetFormDraft } from "../models/snippet.model.ts";

export const SnippetsPage: React.FC = () => {
  const [snippets, setSnippets] = useState<ShareableResource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm, clearForm] = useLocalStorageDraft<SnippetFormDraft>(
    "snippets_form_draft",
    {
      title: "",
      language: "text",
      content: "",
      tagsStr: "",
    },
  );

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    const data = await snippetService.fetchAll();
    setSnippets(data || []);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    const tags = form.tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (form.id) {
      const payload: ShareableResource = {
        id: form.id,
        title: form.title.trim(),
        language: form.language,
        content: form.content.trim(),
        tags,
      };
      await snippetService.update(payload);
    } else {
      const payload: Partial<ShareableResource> = {
        title: form.title.trim(),
        language: form.language,
        content: form.content.trim(),
        tags,
      };
      await snippetService.create(payload as ShareableResource);
    }

    setIsModalOpen(false);
    clearForm();
    await fetchSnippets();
  };

  const editSnippet = (snippet: ShareableResource) => {
    setForm({
      id: snippet.id,
      title: snippet.title,
      language: (snippet.language as SnippetLanguage) || "text",
      content: snippet.content,
      tagsStr: snippet.tags ? snippet.tags.join(", ") : "",
    });
    setIsModalOpen(true);
  };

  const deleteSnippet = async (snippet: ShareableResource) => {
    await snippetService.deleteById(snippet.id);
    await fetchSnippets();
  };

  const openCreateModal = () => {
    clearForm();
    setIsModalOpen(true);
  };

  const filteredSnippets = snippets.filter((s) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const matchesTitle = s.title?.toLowerCase().includes(query) ?? false;
    const matchesContent = s.content?.toLowerCase().includes(query) ?? false;
    const matchesTags =
      s.tags?.some((t) => t.toLowerCase().includes(query)) ?? false;

    return matchesTitle || matchesContent || matchesTags;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      <SnippetsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={openCreateModal}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSnippets.map((snip) => (
          <SnippetCard
            key={snip.id}
            snippet={snip}
            onEdit={editSnippet}
            onDelete={deleteSnippet}
          />
        ))}
      </div>

      <SnippetModal
        isOpen={isModalOpen}
        form={form}
        onFormChange={setForm}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};
