import React, { useEffect, useState } from "react";
import { useLocalStorageDraft } from "../hooks/useLocalStorageDraft.ts";
import {
  TemplateResource,
  TemplateTags,
} from "../models/templateResource.model.ts";
import { templateService } from "../services/network/template.service.ts";
import { TemplatesHeader } from "../components/template/TemplatesHeader.tsx";
import { TemplateCard } from "../components/template/TemplateCard.tsx";
import { CreateTemplateModal } from "../components/template/CreateTemplateModal.tsx";
import { TemplatePlatform } from "../types/templateResource.type.ts";

export const TemplatePage: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateResource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm, clearDraft] = useLocalStorageDraft<{
    title: string;
    content: string;
    platform: TemplatePlatform;
    tags: TemplateTags;
  }>("template_create_form_draft", {
    title: "",
    content: "",
    platform: "redmine",
    tags: "General",
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await templateService.fetchAll();
      setTemplates(response || []);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  };

  const deleteTemplate = async (template: TemplateResource) => {
    await templateService.deleteById(template.id);
    await fetchTemplates();
  };

  const createTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = form?.title?.trim() || "";
    const content = form?.content?.trim() || "";
    const platform: TemplatePlatform =
      form?.platform?.trim() || ("redmine" as TemplatePlatform);
    const tagValue: TemplateTags =
      form?.tags?.trim() || ("General" as TemplateTags);

    if (!title || !content) return;

    const template: TemplateResource = {
      title: title,
      content: content,
      platform: platform,
      tags: [tagValue],
    };
    await templateService.create(template);
    clearDraft();
    setIsModalOpen(false);
    await fetchTemplates();
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesPlatform =
      selectedPlatform === "all" || template.platform === selectedPlatform;
    const matchesCategory =
      selectedCategory === "all" ||
      template.tags?.includes(selectedCategory as TemplateTags);

    if (!matchesPlatform || !matchesCategory) {
      return false;
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const matchesTitle = template.title?.toLowerCase().includes(query) ?? false;
    const matchesContent =
      template.content?.toLowerCase().includes(query) ?? false;

    return matchesTitle || matchesContent;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      <TemplatesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        totalTemplatesCount={templates.length}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onDelete={deleteTemplate}
          />
        ))}
      </div>

      <CreateTemplateModal
        isOpen={isModalOpen}
        form={form}
        onFormChange={setForm}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createTemplate}
      />
    </div>
  );
};
