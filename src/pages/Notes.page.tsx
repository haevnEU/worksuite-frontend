import React, { useEffect, useState } from "react";
import { useLocalStorageDraft } from "../hooks/useLocalStorageDraft.ts";
import { NoteResource } from "../models/noteResource.model.ts";
import { noteService } from "../services/network/note.service.ts";
import { NoteCard, NoteModal, NotesHeader } from "../components/notes";
import { NoteFormDraft } from "../models/note.model.ts";

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<NoteResource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm, clearForm] = useLocalStorageDraft<NoteFormDraft>(
    "notes_form_draft",
    {
      title: "",
      content: "",
      ticketId: "",
    },
  );

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await noteService.fetchAll();
      setNotes(data || []);
    } catch (error) {
      console.error("Error while loading notes:", error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    if (form.id) {
      const note: NoteResource = {
        id: form.id,
        title: form.title.trim(),
        content: form.content.trim(),
        ticketId: form.ticketId?.trim() || undefined,
      };
      await noteService.update(note);
    } else {
      const note: Partial<NoteResource> = {
        title: form.title.trim(),
        content: form.content.trim(),
        ticketId: form.ticketId?.trim() || undefined,
      };
      await noteService.create(note as NoteResource);
    }

    setIsModalOpen(false);
    clearForm();
    await fetchNotes();
  };

  const editNote = (note: NoteResource) => {
    setForm({
      id: note.id,
      title: note.title,
      content: note.content,
      ticketId: note.ticketId || "",
    });
    setIsModalOpen(true);
  };

  const deleteNote = async (note: NoteResource) => {
    await noteService.deleteById(note.id);
    await fetchNotes();
  };

  const openCreateModal = () => {
    clearForm();
    setIsModalOpen(true);
  };

  const filteredNotes = notes.filter((n) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const matchesTitle = n.title?.toLowerCase().includes(query) ?? false;
    const matchesContent = n.content?.toLowerCase().includes(query) ?? false;
    const matchesTicket = n.ticketId?.toLowerCase().includes(query) ?? false;

    return matchesTitle || matchesContent || matchesTicket;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      <NotesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={openCreateModal}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={editNote}
            onDelete={deleteNote}
          />
        ))}
      </div>

      <NoteModal
        isOpen={isModalOpen}
        form={form}
        onFormChange={setForm}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};
