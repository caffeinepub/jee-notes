import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, BookOpen, ChevronDown, LogIn, LogOut } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function TopBar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const principal = identity?.getPrincipal().toString() ?? "";
  const initials = isLoggedIn ? principal.slice(0, 2).toUpperCase() : "?";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.25 0.065 236), oklch(0.31 0.068 236))",
      }}
    >
      <div className="flex items-center gap-2 min-w-[220px]">
        <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">
          JEE Master
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        {["Subjects", "Formulas", "Mock Tests", "Community", "About"].map(
          (item) => (
            <button
              type="button"
              key={item}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              {item}
            </button>
          ),
        )}
      </nav>

      <div className="flex items-center gap-3 min-w-[220px] justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <Bell className="w-5 h-5" />
        </Button>
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-teal text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-white text-sm font-medium hidden lg:block">
              {principal.slice(0, 8)}…
            </span>
            <ChevronDown className="w-4 h-4 text-white/60" />
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-white/80 hover:text-white hover:bg-white/10"
              data-ocid="topbar.logout.button"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="bg-teal text-white hover:bg-teal/90 border-0"
            data-ocid="topbar.login.button"
          >
            <LogIn className="w-4 h-4 mr-1" />
            {loginStatus === "logging-in" ? "Connecting…" : "Login"}
          </Button>
        )}
      </div>
    </header>
  );
}
