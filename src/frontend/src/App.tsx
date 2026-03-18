import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Sidebar, { type SidebarView } from "./components/Sidebar";
import TopBar from "./components/TopBar";
import BookmarksView from "./pages/BookmarksView";
import Dashboard from "./pages/Dashboard";
import FormulaSheetPage from "./pages/FormulaSheet";
import SubjectViewPage from "./pages/SubjectView";

export default function App() {
  const [view, setView] = useState<SidebarView>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar activeView={view} onViewChange={setView} />

      <main className="ml-60 pt-16 min-h-screen">
        {view !== "formula-sheet" && (
          <div className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b border-border px-6 py-3">
            <div className="relative max-w-xl">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                role="img"
                aria-label="Search"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search notes by title, topic, or tags…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg shadow-card focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="main.search_input"
              />
            </div>
          </div>
        )}

        <div className="px-6 py-6">
          {view === "dashboard" && (
            <Dashboard searchQuery={searchQuery} onNavigate={setView} />
          )}
          {(view === "physics" ||
            view === "chemistry" ||
            view === "mathematics") && (
            <SubjectViewPage view={view} searchQuery={searchQuery} />
          )}
          {view === "bookmarks" && <BookmarksView searchQuery={searchQuery} />}
          {view === "formula-sheet" && <FormulaSheetPage />}
        </div>

        <footer className="px-6 py-6 border-t border-border mt-8">
          <p className="text-xs text-muted-foreground text-center">
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </main>

      <Toaster />
    </div>
  );
}
