import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkCheck, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Subject } from "../backend";
import type { Note } from "../backend";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import {
  useAllNotes,
  useCreateNote,
  useDeleteNote,
  useToggleBookmark,
  useUpdateNote,
} from "../hooks/useQueries";

const SAMPLE_BOOKMARKS: Note[] = [
  {
    id: 1n,
    title: "Newton's Laws of Motion",
    subject: Subject.physics,
    topic: "Mechanics",
    content: "F = ma. Equal and opposite reactions. Inertia is fundamental.",
    tags: ["kinematics", "force"],
    bookmarked: true,
    createdAt: BigInt(Date.now() - 86400000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 3600000) * 1_000_000n,
  },
  {
    id: 3n,
    title: "Integration by Parts",
    subject: Subject.maths,
    topic: "Calculus",
    content: "\u222bu dv = uv \u2212 \u222bv du. LIATE rule for choosing u.",
    tags: ["integration", "calculus"],
    bookmarked: true,
    createdAt: BigInt(Date.now() - 259200000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 10800000) * 1_000_000n,
  },
];

interface BookmarksViewProps {
  searchQuery: string;
}

export default function BookmarksView({ searchQuery }: BookmarksViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [deleteNote, setDeleteNote] = useState<Note | null>(null);

  const { data: allNotes, isLoading } = useAllNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteMutation = useDeleteNote();
  const toggleBookmark = useToggleBookmark();

  const rawBookmarks =
    allNotes && allNotes.length > 0
      ? allNotes.filter((n) => n.bookmarked)
      : SAMPLE_BOOKMARKS;

  const bookmarks = useMemo(() => {
    if (!searchQuery.trim()) return rawBookmarks;
    const q = searchQuery.toLowerCase();
    return rawBookmarks.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.topic.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [rawBookmarks, searchQuery]);

  const sorted = [...bookmarks].sort((a, b) =>
    Number(b.updatedAt - a.updatedAt),
  );

  const handleSave = async (data: {
    title: string;
    subject: Subject;
    topic: string;
    tags: string[];
    content: string;
    id?: bigint;
  }) => {
    try {
      if (data.id !== undefined) {
        await updateNote.mutateAsync({
          id: data.id,
          title: data.title,
          content: data.content,
          subject: data.subject,
          topic: data.topic,
          tags: data.tags,
        });
        toast.success("Note updated!");
      } else {
        await createNote.mutateAsync({
          title: data.title,
          content: data.content,
          subject: data.subject,
          topic: data.topic,
          tags: data.tags,
        });
        toast.success("Note created!");
      }
      setModalOpen(false);
      setEditNote(null);
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleDelete = async () => {
    if (!deleteNote) return;
    try {
      await deleteMutation.mutateAsync(deleteNote.id);
      toast.success("Note deleted");
      setDeleteNote(null);
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleToggleBookmark = async (noteId: bigint) => {
    try {
      await toggleBookmark.mutateAsync(noteId);
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Bookmarked Notes</h1>
        <Button
          className="bg-teal text-white hover:bg-teal/90 border-0"
          onClick={() => {
            setEditNote(null);
            setModalOpen(true);
          }}
          data-ocid="bookmarks.create_note.button"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" /> New Note
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3" data-ocid="bookmarks.loading_state">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <Card className="shadow-card" data-ocid="bookmarks.empty_state">
          <CardContent className="p-10 text-center">
            <BookmarkCheck className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="font-medium text-foreground">
              {searchQuery
                ? `No bookmarks match "${searchQuery}"`
                : "No bookmarked notes yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Bookmark notes to save them for quick access.
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          className="grid gap-3 md:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {sorted.map((note, i) => (
            <NoteCard
              key={String(note.id)}
              note={note}
              index={i + 1}
              onEdit={(n) => {
                setEditNote(n);
                setModalOpen(true);
              }}
              onDelete={(n) => setDeleteNote(n)}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </motion.div>
      )}

      <NoteModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditNote(null);
        }}
        editNote={editNote}
        onSave={handleSave}
        isPending={createNote.isPending || updateNote.isPending}
      />
      <DeleteConfirmDialog
        note={deleteNote}
        open={!!deleteNote}
        onClose={() => setDeleteNote(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
