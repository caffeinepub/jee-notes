import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Note } from "../backend";
import { Subject } from "../backend";

interface FormData {
  title: string;
  subject: Subject;
  topic: string;
  tags: string;
  content: string;
}

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  editNote?: Note | null;
  onSave: (data: {
    title: string;
    subject: Subject;
    topic: string;
    tags: string[];
    content: string;
    id?: bigint;
  }) => void;
  isPending?: boolean;
  defaultSubject?: Subject;
}

export default function NoteModal({
  open,
  onClose,
  editNote,
  onSave,
  isPending,
  defaultSubject,
}: NoteModalProps) {
  const [form, setForm] = useState<FormData>({
    title: "",
    subject: defaultSubject ?? Subject.physics,
    topic: "",
    tags: "",
    content: "",
  });

  useEffect(() => {
    if (editNote) {
      setForm({
        title: editNote.title,
        subject: editNote.subject,
        topic: editNote.topic,
        tags: editNote.tags.join(", "),
        content: editNote.content,
      });
    } else {
      setForm({
        title: "",
        subject: defaultSubject ?? Subject.physics,
        topic: "",
        tags: "",
        content: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editNote, defaultSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({
      ...(editNote ? { id: editNote.id } : {}),
      title: form.title,
      subject: form.subject,
      topic: form.topic,
      tags,
      content: form.content,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg" data-ocid="note.modal">
        <DialogHeader>
          <DialogTitle>
            {editNote ? "Edit Note" : "Create New Note"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              placeholder="e.g. Newton's Laws of Motion"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              required
              data-ocid="note.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select
                value={form.subject}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, subject: v as Subject }))
                }
              >
                <SelectTrigger data-ocid="note.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Subject.physics}>Physics</SelectItem>
                  <SelectItem value={Subject.chemistry}>Chemistry</SelectItem>
                  <SelectItem value={Subject.maths}>Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note-topic">Topic</Label>
              <Input
                id="note-topic"
                placeholder="e.g. Mechanics"
                value={form.topic}
                onChange={(e) =>
                  setForm((p) => ({ ...p, topic: e.target.value }))
                }
                data-ocid="note.topic.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note-tags">Tags (comma-separated)</Label>
            <Input
              id="note-tags"
              placeholder="e.g. kinematics, velocity"
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              data-ocid="note.tags.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note-content">Content</Label>
            <Textarea
              id="note-content"
              placeholder="Write your notes here…"
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              rows={6}
              required
              className="resize-none"
              data-ocid="note.textarea"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="note.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              style={{ background: "oklch(var(--navy-mid))", color: "white" }}
              data-ocid="note.submit_button"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending
                ? "Saving…"
                : editNote
                  ? "Save Changes"
                  : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
