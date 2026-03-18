import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Subject } from "../backend";
import type { Note } from "../backend";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import type { SidebarView } from "../components/Sidebar";
import {
  useAllNotes,
  useCreateNote,
  useDeleteNote,
  useToggleBookmark,
  useUpdateNote,
} from "../hooks/useQueries";

type SubjectView = Exclude<
  SidebarView,
  "dashboard" | "bookmarks" | "formula-sheet"
>;

const subjectMap: Record<SubjectView, Subject> = {
  physics: Subject.physics,
  chemistry: Subject.chemistry,
  mathematics: Subject.maths,
};

const subjectLabel: Record<SubjectView, string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  mathematics: "Mathematics",
};

const SAMPLES: Record<string, Note[]> = {
  physics: [
    {
      id: 10n,
      title: "Laws of Thermodynamics",
      subject: Subject.physics,
      topic: "Thermodynamics",
      content:
        "0th law: thermal equilibrium. 1st: \u0394U = Q \u2212 W. 2nd: entropy increases. 3rd: absolute zero unreachable.",
      tags: ["thermodynamics", "entropy"],
      bookmarked: false,
      createdAt: BigInt(Date.now() - 90000000) * 1_000_000n,
      updatedAt: BigInt(Date.now() - 9000000) * 1_000_000n,
    },
    {
      id: 11n,
      title: "Coulomb's Law & Electric Field",
      subject: Subject.physics,
      topic: "Electrostatics",
      content:
        "F = kq\u2081q\u2082/r\u00b2. Electric field E = F/q. Field lines point from + to \u2212. Superposition applies.",
      tags: ["electrostatics", "coulomb"],
      bookmarked: true,
      createdAt: BigInt(Date.now() - 80000000) * 1_000_000n,
      updatedAt: BigInt(Date.now() - 8000000) * 1_000_000n,
    },
  ],
  chemistry: [
    {
      id: 20n,
      title: "IUPAC Nomenclature Rules",
      subject: Subject.chemistry,
      topic: "Organic Chemistry",
      content:
        "Name longest carbon chain. Number from end closest to functional group. Substituents in alphabetical order.",
      tags: ["organic", "nomenclature", "IUPAC"],
      bookmarked: false,
      createdAt: BigInt(Date.now() - 70000000) * 1_000_000n,
      updatedAt: BigInt(Date.now() - 7000000) * 1_000_000n,
    },
    {
      id: 21n,
      title: "Acid-Base Equilibria",
      subject: Subject.chemistry,
      topic: "Equilibrium",
      content:
        "Ka = [H\u207a][A\u207b]/[HA]. pKa = \u2212log Ka. pH = \u2212log[H\u207a]. Buffer: Henderson-Hasselbalch equation.",
      tags: ["acid-base", "pH", "equilibrium"],
      bookmarked: true,
      createdAt: BigInt(Date.now() - 60000000) * 1_000_000n,
      updatedAt: BigInt(Date.now() - 6000000) * 1_000_000n,
    },
  ],
  mathematics: [
    {
      id: 30n,
      title: "Limits & Continuity",
      subject: Subject.maths,
      topic: "Calculus",
      content:
        "L'H\u00f4pital's rule for 0/0 or \u221e/\u221e forms. Squeeze theorem. Continuity: lim(x\u2192a) f(x) = f(a).",
      tags: ["limits", "continuity"],
      bookmarked: false,
      createdAt: BigInt(Date.now() - 50000000) * 1_000_000n,
      updatedAt: BigInt(Date.now() - 5000000) * 1_000_000n,
    },
    {
      id: 31n,
      title: "Matrices & Determinants",
      subject: Subject.maths,
      topic: "Algebra",
      content:
        "det(AB) = det(A)\u00b7det(B). Inverse: A\u207b\u00b9 = adj(A)/det(A). Eigenvalues from det(A \u2212 \u03bbI) = 0.",
      tags: ["matrices", "determinants", "eigenvalues"],
      bookmarked: true,
      createdAt: BigInt(Date.now() - 40000000) * 1_000_000n,
      updatedAt: BigInt(Date.now() - 4000000) * 1_000_000n,
    },
  ],
};

interface SubjectViewProps {
  view: SubjectView;
  searchQuery: string;
}

export default function SubjectViewPage({
  view,
  searchQuery,
}: SubjectViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [deleteNote, setDeleteNote] = useState<Note | null>(null);

  const { data: allNotes, isLoading } = useAllNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteMutation = useDeleteNote();
  const toggleBookmark = useToggleBookmark();

  const subject = subjectMap[view];
  const rawNotes =
    allNotes && allNotes.length > 0
      ? allNotes.filter((n) => n.subject === subject)
      : (SAMPLES[view] ?? []);

  const notes = useMemo(() => {
    if (!searchQuery.trim()) return rawNotes;
    const q = searchQuery.toLowerCase();
    return rawNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.topic.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [rawNotes, searchQuery]);

  const sorted = [...notes].sort((a, b) => Number(b.updatedAt - a.updatedAt));

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
        <h1 className="text-xl font-bold text-foreground">
          {subjectLabel[view]}
        </h1>
        <Button
          className="bg-teal text-white hover:bg-teal/90 border-0"
          onClick={() => {
            setEditNote(null);
            setModalOpen(true);
          }}
          data-ocid={`${view}.create_note.button`}
        >
          <PlusCircle className="w-4 h-4 mr-1.5" /> New Note
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3" data-ocid={`${view}.loading_state`}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <Card className="shadow-card" data-ocid={`${view}.empty_state`}>
          <CardContent className="p-10 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="font-medium text-foreground">
              {searchQuery
                ? `No ${subjectLabel[view]} notes match "${searchQuery}"`
                : `No ${subjectLabel[view]} notes yet`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first {subjectLabel[view]} note to get started.
            </p>
            <Button
              className="mt-4 bg-teal text-white hover:bg-teal/90 border-0"
              onClick={() => setModalOpen(true)}
              data-ocid={`${view}.empty.create_note.button`}
            >
              <PlusCircle className="w-4 h-4 mr-1.5" /> Create Note
            </Button>
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
        defaultSubject={subject}
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
