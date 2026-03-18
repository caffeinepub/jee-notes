import { cn } from "@/lib/utils";
import {
  Atom,
  Bookmark,
  Calculator,
  CalendarCheck,
  FileText,
  FlaskConical,
  LayoutDashboard,
} from "lucide-react";

export type SidebarView =
  | "dashboard"
  | "physics"
  | "chemistry"
  | "mathematics"
  | "formula-sheet"
  | "bookmarks";

const navItems: { id: SidebarView; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  { id: "physics", label: "Physics", icon: <Atom className="w-4 h-4" /> },
  {
    id: "chemistry",
    label: "Chemistry",
    icon: <FlaskConical className="w-4 h-4" />,
  },
  {
    id: "mathematics",
    label: "Mathematics",
    icon: <Calculator className="w-4 h-4" />,
  },
  {
    id: "formula-sheet",
    label: "Formula Sheet",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "bookmarks",
    label: "Bookmarks",
    icon: <Bookmark className="w-4 h-4" />,
  },
];

interface SidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="fixed top-16 left-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border flex flex-col pt-6 z-40">
      <div className="px-4 mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          My Study Hub
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onViewChange(item.id)}
            data-ocid={`sidebar.${item.id}.link`}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left",
              activeView === item.id
                ? "bg-navy-active text-white shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto px-2 pb-4">
        <button
          type="button"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left text-sidebar-foreground hover:bg-sidebar-accent"
          data-ocid="sidebar.revision_planner.link"
        >
          <CalendarCheck className="w-4 h-4" /> Revision Planner
        </button>
      </div>
    </aside>
  );
}
