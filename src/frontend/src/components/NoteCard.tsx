import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bookmark, BookmarkCheck, Edit2, Trash2 } from "lucide-react";
import type { Note } from "../backend";
import { Subject } from "../backend";

const subjectColors: Record<Subject, string> = {
  [Subject.physics]: "bg-blue-100 text-blue-700",
  [Subject.chemistry]: "bg-green-100 text-green-700",
  [Subject.maths]: "bg-purple-100 text-purple-700",
};

const subjectLabel: Record<Subject, string> = {
  [Subject.physics]: "Physics",
  [Subject.chemistry]: "Chemistry",
  [Subject.maths]: "Mathematics",
};

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onToggleBookmark: (noteId: bigint) => void;
  index: number;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onToggleBookmark,
  index,
}: NoteCardProps) {
  const updatedDate = new Date(Number(note.updatedAt / 1_000_000n));
  const dateStr = updatedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card
      className="group shadow-card hover:shadow-card-hover transition-all duration-200 border-border"
      data-ocid={`notes.item.${index}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-base leading-snug truncate flex-1">
            {note.title}
          </h3>
          <button
            type="button"
            onClick={() => onToggleBookmark(note.id)}
            className="shrink-0 text-muted-foreground hover:text-teal transition-colors"
            data-ocid={`notes.toggle.${index}`}
            aria-label={note.bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {note.bookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-teal" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              subjectColors[note.subject],
            )}
          >
            {subjectLabel[note.subject]}
          </span>
          {note.topic && (
            <span className="text-xs text-muted-foreground truncate">
              {note.topic}
            </span>
          )}
        </div>
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-1.5 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {note.content}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">{dateStr}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="h-7 px-2 text-xs"
              data-ocid={`notes.edit_button.${index}`}
            >
              <Edit2 className="w-3 h-3 mr-1" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note)}
              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
              data-ocid={`notes.delete_button.${index}`}
            >
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
