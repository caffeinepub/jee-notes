import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Subject } from "../backend";
import type { Note } from "../backend";
import { useActor } from "./useActor";

export function useAllNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllTags() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTags();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNoteStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return { total: 0n, physics: 0n, chemistry: 0n, maths: 0n };
      const [total, physics, chemistry, maths] = await Promise.all([
        actor.getTotalNoteCount(),
        actor.getSubjectCount(Subject.physics),
        actor.getSubjectCount(Subject.chemistry),
        actor.getSubjectCount(Subject.maths),
      ]);
      return { total, physics, chemistry, maths };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      subject: Subject;
      topic: string;
      tags: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createNote(
        data.title,
        data.content,
        data.subject,
        data.topic,
        data.tags,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      qc.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useUpdateNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: bigint;
      title: string;
      content: string;
      subject: Subject;
      topic: string;
      tags: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateNote(
        data.id,
        data.title,
        data.content,
        data.subject,
        data.topic,
        data.tags,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      qc.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteNote(noteId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useToggleBookmark() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleBookmark(noteId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
