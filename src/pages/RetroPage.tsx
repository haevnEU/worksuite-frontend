import React, { useEffect, useState } from "react";
import { useLocalStorageDraft } from "../hooks/useLocalStorageDraft.ts";
import { RetroResource } from "../models/retroResource.model.ts";
import { retroService } from "../services/network/retro.service.ts";
import { useToast } from "../toaster/ToastContext.tsx";
import { CategoryType } from "../types/retro.type.ts";
import { RetroHeader } from "../components/retro/RetroHeader.tsx";
import { RetroItemForm } from "../components/retro/RetroItemForm.tsx";
import { RetroColumnsGrid } from "../components/retro/RetroColumnsGrid.tsx";
import { useSettings } from "../context/SettingsContext.tsx";

export const RetroPage: React.FC = () => {
  const { toastInfo } = useToast();
  const [retros, setRetros] = useState<RetroResource[]>([]);
  const [selectedRetro, setSelectedRetro] = useState<RetroResource | null>(
    null,
  );

  const [formText, setFormText, clearFormText] = useLocalStorageDraft(
    "retro_form_text_draft",
    "",
  );
  const [newSprintName, setNewSprintName, clearNewSprintName] =
    useLocalStorageDraft("retro_new_sprint_name_draft", "");
  const [formType, setFormType] = useState<CategoryType>("positive");

  useEffect(() => {
    fetchAllRetros();
  }, []);

  const fetchAllRetros = async (preferredSprintName?: string) => {
    const data = await retroService.fetchAll();
    setRetros(data);
    if (data.length > 0) {
      setSelectedRetro((prev) => {
        const targetName = preferredSprintName || prev?.sprintName;
        if (!targetName) return data[0];
        return data.find((r) => r.sprintName === targetName) || data[0];
      });
    } else {
      setSelectedRetro(null);
    }
  };

  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newSprintName.trim();
    if (!trimmedName) return;

    await retroService.createRetro(trimmedName);
    clearNewSprintName();
    await fetchAllRetros(trimmedName);
  };

  const handleDeleteSprint = async () => {
    if (!selectedRetro?.id) return;
    if (
      !window.confirm(
        `Are you sure you want to delete sprint "${selectedRetro.sprintName}"?`,
      )
    )
      return;

    try {
      await retroService.deleteById(`${selectedRetro.id}`);
      await fetchAllRetros();
    } catch (error) {
      console.error("Failed to delete sprint:", error);
    }
  };

  const { isDraft } = useSettings();

  const handleExportSprint = async () => {
    if (!selectedRetro?.sprintName) return;
    await retroService.exportPdf(selectedRetro.id, isDraft);
  };

  const removeFromList = async (listName: CategoryType, item: string) => {
    if (!selectedRetro?.id) return;
    await retroService.removeItem(item, selectedRetro.id, listName);
    await fetchAllRetros();
  };

  const changeSprint = (sprintName: string) => {
    const retro = retros.find((r) => r.sprintName === sprintName);
    if (retro) {
      setSelectedRetro(retro);
    }
  };

  const handleCopy = (item: string) => {
    navigator.clipboard.writeText(item);
    toastInfo("Text copied to clipboard!");
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim() || !selectedRetro?.id) return;
    await retroService.addItem(formText, selectedRetro.id, formType);
    clearFormText();
    await fetchAllRetros();
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <RetroHeader
        retros={retros}
        selectedRetro={selectedRetro}
        onSelectSprint={changeSprint}
        onExportSprint={handleExportSprint}
        onDeleteSprint={handleDeleteSprint}
        newSprintName={newSprintName}
        onNewSprintNameChange={setNewSprintName}
        onCreateSprint={handleCreateSprint}
      />

      <RetroItemForm
        sprintName={selectedRetro?.sprintName}
        formType={formType}
        onFormTypeChange={setFormType}
        formText={formText}
        onFormTextChange={setFormText}
        onSubmit={handleSubmitItem}
      />

      <RetroColumnsGrid
        selectedRetro={selectedRetro}
        onCopyItem={handleCopy}
        onRemoveItem={removeFromList}
      />
    </div>
  );
};
