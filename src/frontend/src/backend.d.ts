import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface Note {
    id: bigint;
    title: string;
    topic: string;
    content: string;
    subject: Subject;
    createdAt: Time;
    tags: Array<string>;
    updatedAt: Time;
    bookmarked: boolean;
}
export enum Subject {
    maths = "maths",
    chemistry = "chemistry",
    physics = "physics"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNote(title: string, content: string, subject: Subject, topic: string, tags: Array<string>): Promise<Note>;
    deleteNote(noteId: bigint): Promise<void>;
    filterBySubject(subject: Subject): Promise<Array<Note>>;
    getAllNotes(): Promise<Array<Note>>;
    getAllTags(): Promise<Array<string>>;
    getBookmarkedNotes(): Promise<Array<Note>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNote(noteId: bigint): Promise<Note>;
    getRecentlyAccessedNotes(): Promise<Array<Note>>;
    getSubjectCount(subject: Subject): Promise<bigint>;
    getTotalNoteCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchNotes(keyword: string): Promise<Array<Note>>;
    toggleBookmark(noteId: bigint): Promise<boolean>;
    updateNote(noteId: bigint, title: string, content: string, subject: Subject, topic: string, tags: Array<string>): Promise<Note>;
}
