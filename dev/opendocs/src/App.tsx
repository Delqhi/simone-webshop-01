import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Editor } from "@/components/Editor";
import { AiPanel } from "@/components/AiPanel";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ChatPanel } from "@/components/ChatPanel";
import { ContentAuditPanel } from "@/components/ContentAuditPanel";
import { PresenceList } from "@/components/ui/PresenceList";
import { NotificationToast } from "@/components/ui/NotificationToast";
import { CommandPalette } from "@/components/CommandPalette";
import { useDocsStore } from "@/store/useDocsStore";
import { Sparkles, MessageSquareText, ClipboardCheck } from "lucide-react";
import { initializeBackupStore, startAutoBackup } from "@/services/backup";

export function App() {
  const theme = useDocsStore((s) => s.state.theme);
  const selectedPageId = useDocsStore((s) => s.state.selectedPageId);
  const pages = useDocsStore((s) => s.state.pages);
  const [aiOpen, setAiOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);


  // Apply dark class immediately on mount to prevent flash of light mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    initializeBackupStore();
    startAutoBackup(60);
  }, []);

  const selectedTitle = useMemo(() => {
    if (!selectedPageId) return "";
    return pages[selectedPageId]?.title || "";
  }, [pages, selectedPageId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const cmdk = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      const cmdg = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g";
      const cmdj = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j";
      const esc = e.key === "Escape";
      const f6 = e.key === "F6";

      // Close panels with Escape key
      if (esc) {
        if (aiOpen) {
          e.preventDefault();
          setAiOpen(false);
          return;
        }
        if (chatOpen) {
          e.preventDefault();
          setChatOpen(false);
          return;
        }
        if (auditOpen) {
          e.preventDefault();
          setAuditOpen(false);
          return;
        }
        if (commandOpen) {
          e.preventDefault();
          setCommandOpen(false);
          return;
        }
      }

      // Accessibility navigation with F6
      if (f6 && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        // Focus on main content area
        const mainContent = document.querySelector("main");
        if (mainContent instanceof HTMLElement) {
          mainContent.focus();
        }
        return;
      }

      if (cmdg) {
        e.preventDefault();
        setAiOpen(true);
      }
      if (cmdj) {
        e.preventDefault();
        setChatOpen(true);
      }
      if (cmdk) {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [aiOpen, chatOpen, auditOpen, commandOpen]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100 overflow-hidden">
        <Sidebar />

        <main 
          className="relative flex min-w-0 flex-1 flex-col h-full overflow-hidden"
          tabIndex={-1}
          aria-label="Main content area"
        >
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedTitle || "OpenDocs"}</h1>
              <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-tight font-bold">Best Practices Feb 2026 Edition</div>
            </div>
            <div className="flex items-center gap-3">
              <PresenceList />
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />
              <button
                className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                onClick={() => setAiOpen(true)}
                aria-label="Open AI panel"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" /> AI
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                onClick={() => setChatOpen(true)}
                aria-label="Open chat panel"
              >
                <MessageSquareText className="h-4 w-4" aria-hidden="true" /> Chat
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                onClick={() => setAuditOpen(true)}
                aria-label="Open content audit panel"
              >
                <ClipboardCheck className="h-4 w-4" aria-hidden="true" /> Audit
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            <Editor />
          </div>
        </main>
      </div>

      <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      <ContentAuditPanel open={auditOpen} onClose={() => setAuditOpen(false)} />
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onOpenAi={() => setAiOpen(true)}
        onOpenChat={() => setChatOpen(true)}
        onOpenAudit={() => setAuditOpen(true)}
      />
      
      <NotificationToast />
    </ErrorBoundary>
  );
}
