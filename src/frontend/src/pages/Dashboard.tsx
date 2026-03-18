import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Atom,
  BookOpen,
  BookmarkCheck,
  Calculator,
  ChevronRight,
  FlaskConical,
  PlusCircle,
} from "lucide-react";
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
  useAllTags,
  useCreateNote,
  useDeleteNote,
  useNoteStats,
  useToggleBookmark,
  useUpdateNote,
} from "../hooks/useQueries";

const SAMPLE_NOTES: Note[] = [
  {
    id: 1n,
    title: "Newton's Laws of Motion",
    subject: Subject.physics,
    topic: "Mechanics",
    content:
      "First law: An object at rest stays at rest. Second law: F = ma. Third law: Equal and opposite reactions.",
    tags: ["kinematics", "force", "inertia"],
    bookmarked: true,
    createdAt: BigInt(Date.now() - 86400000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 3600000) * 1_000_000n,
  },
  {
    id: 2n,
    title: "Periodic Table & Trends",
    subject: Subject.chemistry,
    topic: "Atomic Structure",
    content:
      "Electronegativity increases left-to-right. Atomic radius decreases across a period. Ionization energy increases left-to-right.",
    tags: ["periodic-table", "electronegativity", "trends"],
    bookmarked: false,
    createdAt: BigInt(Date.now() - 172800000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 7200000) * 1_000_000n,
  },
  {
    id: 3n,
    title: "Integration by Parts",
    subject: Subject.maths,
    topic: "Calculus",
    content:
      "\u222bu dv = uv \u2212 \u222bv du. Choose u using LIATE rule: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential.",
    tags: ["integration", "calculus", "LIATE"],
    bookmarked: true,
    createdAt: BigInt(Date.now() - 259200000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 10800000) * 1_000_000n,
  },
  {
    id: 4n,
    title: "Electrochemistry Basics",
    subject: Subject.chemistry,
    topic: "Electrochemistry",
    content:
      "Galvanic cells convert chemical energy to electrical. Electrolytic cells use electrical energy. Nernst equation: E = E\u00b0 \u2212 (RT/nF)ln Q.",
    tags: ["galvanic", "electrolysis", "nernst"],
    bookmarked: false,
    createdAt: BigInt(Date.now() - 345600000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 14400000) * 1_000_000n,
  },
];

const subjectTopics: Record<string, string[]> = {
  physics: ["Mechanics", "Thermodynamics", "Electrostatics", "Optics", "Waves"],
  chemistry: [
    "Organic Chemistry",
    "Electrochemistry",
    "Atomic Structure",
    "Chemical Bonding",
    "Equilibrium",
  ],
  mathematics: [
    "Calculus",
    "Algebra",
    "Coordinate Geometry",
    "Trigonometry",
    "Probability",
  ],
};

interface DashboardProps {
  searchQuery: string;
  onNavigate: (view: SidebarView) => void;
}

export default function Dashboard({ searchQuery, onNavigate }: DashboardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [deleteNote, setDeleteNote] = useState<Note | null>(null);

  const { data: notesData, isLoading: notesLoading } = useAllNotes();
  const { data: stats, isLoading: statsLoading } = useNoteStats();
  const { data: tagsData } = useAllTags();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const toggleBookmark = useToggleBookmark();

  const notes = notesData && notesData.length > 0 ? notesData : SAMPLE_NOTES;
  const tags =
    tagsData && tagsData.length > 0
      ? tagsData
      : [
          "kinematics",
          "calculus",
          "organic",
          "thermodynamics",
          "waves",
          "integration",
          "electronegativity",
          "inertia",
        ];

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.topic.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [notes, searchQuery]);

  const recentNotes = [...filteredNotes]
    .sort((a, b) => Number(b.updatedAt - a.updatedAt))
    .slice(0, 6);
  const bookmarkedNotes = filteredNotes.filter((n) => n.bookmarked);

  const statsDisplay = [
    {
      label: "Total Notes",
      value: stats ? Number(stats.total) : notes.length,
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-navy-mid",
    },
    {
      label: "Physics",
      value: stats
        ? Number(stats.physics)
        : notes.filter((n) => n.subject === Subject.physics).length,
      icon: <Atom className="w-5 h-5" />,
      color: "text-blue-600",
    },
    {
      label: "Chemistry",
      value: stats
        ? Number(stats.chemistry)
        : notes.filter((n) => n.subject === Subject.chemistry).length,
      icon: <FlaskConical className="w-5 h-5" />,
      color: "text-green-600",
    },
    {
      label: "Mathematics",
      value: stats
        ? Number(stats.maths)
        : notes.filter((n) => n.subject === Subject.maths).length,
      icon: <Calculator className="w-5 h-5" />,
      color: "text-purple-600",
    },
  ];

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
      await deleteNoteMutation.mutateAsync(deleteNote.id);
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
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl p-6 text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.25 0.065 236) 0%, oklch(0.37 0.085 236) 100%)",
        }}
      >
        <div className="max-w-lg">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back! Your JEE Preparation Dashboard
          </h1>
          <p className="text-white/70 text-sm">
            Stay organized, study smart. Track your notes across Physics,
            Chemistry, and Mathematics.
          </p>
          <Button
            className="mt-4 bg-teal text-white hover:bg-teal/90 border-0"
            onClick={() => {
              setEditNote(null);
              setModalOpen(true);
            }}
            data-ocid="hero.create_note.button"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" /> Create New Note
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsDisplay.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="shadow-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`${s.color} opacity-80`}>{s.icon}</div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {statsLoading ? <Skeleton className="h-7 w-8" /> : s.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Two-column: Recent + Bookmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Recently Updated Notes
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary"
              data-ocid="dashboard.view_all.button"
            >
              View All <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>
          {notesLoading ? (
            <div className="grid gap-3" data-ocid="notes.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-36" />
              ))}
            </div>
          ) : recentNotes.length === 0 ? (
            <Card className="shadow-card" data-ocid="notes.empty_state">
              <CardContent className="p-8 text-center text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No notes yet</p>
                <p className="text-sm mt-1">
                  Create your first note to get started
                </p>
                <Button
                  className="mt-4 bg-teal text-white hover:bg-teal/90 border-0"
                  onClick={() => setModalOpen(true)}
                  data-ocid="empty.create_note.button"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" /> Create Note
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {recentNotes.map((note, i) => (
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
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Bookmarked Notes
          </h2>
          <Card className="shadow-card border-border">
            <CardContent className="p-0">
              {bookmarkedNotes.length === 0 ? (
                <div
                  className="p-6 text-center text-muted-foreground"
                  data-ocid="bookmarks.empty_state"
                >
                  <BookmarkCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No bookmarks yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {bookmarkedNotes.slice(0, 6).map((note, i) => (
                    <li
                      key={String(note.id)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                      data-ocid={`bookmarks.item.${i + 1}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {note.title}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {note.subject}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subject showcase */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Subjects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: "physics" as SidebarView,
              label: "Physics",
              icon: <Atom className="w-6 h-6" />,
              color: "from-blue-600/80 to-blue-800/80",
              key: "physics",
              subject: Subject.physics,
            },
            {
              id: "chemistry" as SidebarView,
              label: "Chemistry",
              icon: <FlaskConical className="w-6 h-6" />,
              color: "from-green-600/80 to-green-800/80",
              key: "chemistry",
              subject: Subject.chemistry,
            },
            {
              id: "mathematics" as SidebarView,
              label: "Mathematics",
              icon: <Calculator className="w-6 h-6" />,
              color: "from-purple-600/80 to-purple-800/80",
              key: "mathematics",
              subject: Subject.maths,
            },
          ].map((subj, idx) => (
            <motion.div
              key={subj.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + idx * 0.07 }}
            >
              <Card
                className="shadow-card border-border cursor-pointer hover:shadow-card-hover transition-all duration-200 overflow-hidden"
                onClick={() => onNavigate(subj.id)}
                data-ocid={`subject.${subj.key}.card`}
              >
                <div
                  className={`bg-gradient-to-br ${subj.color} p-4 flex items-center gap-3 text-white`}
                >
                  {subj.icon}
                  <span className="font-bold text-lg">{subj.label}</span>
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {notes.filter((n) => n.subject === subj.subject).length}{" "}
                    notes
                  </span>
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {subjectTopics[subj.key].map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Topic tags */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Topic Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-teal hover:text-white transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

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
        isPending={deleteNoteMutation.isPending}
      />
    </div>
  );
}
