import { ChevronDown, ChevronRight, FileText, Folder, FolderPlus, Plus, Sun, Moon, Trash2, Search, PanelLeft, PanelLeftClose } from "lucide-react";
import { useDocsStore } from "@/store/useDocsStore";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { IconPicker, RenderDocIcon } from "@/components/ui/IconPicker";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const { state, actions } = useDocsStore();
  const [filter, setFilter] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const showSidebar = !isCollapsed || isHovered;

  if (!state || !state.folders || !state.pages) {
    return (
      <aside className="flex h-full w-[60px] flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-12 items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-indigo-600 font-bold">OD</span>
        </div>
      </aside>
    );
  }

  const isDark = state.theme === "dark";

  if (!showSidebar) {
    return (
      <aside 
        className="flex h-full w-[60px] flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex h-12 items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-indigo-600 font-bold text-lg">OD</span>
        </div>
        <div className="flex-1 flex flex-col items-center py-4 gap-2">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className="flex h-full w-[320px] flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300"
      onMouseLeave={() => {
        if (isCollapsed) setIsHovered(false);
      }}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">OD</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">OpenDocs</div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-tight font-bold">Best Practices Feb 2026</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Professional Dark/Light Toggle */}
          <button
            type="button"
            onClick={() => actions.setTheme(isDark ? "light" : "dark")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              isDark 
                ? "border-zinc-700 bg-zinc-800 text-zinc-300" 
                : "border-zinc-200 bg-white text-zinc-600"
            )}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          {/* Collapse Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="ml-1 p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            placeholder="Search pages..."
            className="w-full rounded-md border border-zinc-200 bg-zinc-50 pl-8 pr-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 pb-3">
        <Button className="flex-1" onClick={() => actions.createPage(state.rootFolderId, "New page")}
          >
          <Plus className="mr-2 h-4 w-4" /> New page
        </Button>
         <button
           type="button"
           className="rounded-md border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
           title="New folder"
           onClick={() => actions.createFolder(state.rootFolderId, "New folder")}
        >
          <FolderPlus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {state.folders?.[state.rootFolderId] ? (
          <FolderNode folderId={state.rootFolderId} depth={0} filter={filter.toLowerCase()} />
        ) : (
          <div className="p-4 text-xs text-zinc-500 italic">No structure found. Try clearing data.</div>
        )}
      </div>

      <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
          onClick={actions.clearAllData}
          title="Clear all local data"
        >
          <span className="inline-flex items-center gap-2">
            <Trash2 className="h-4 w-4" /> Clear local data
          </span>
          <span className="text-xs text-zinc-400">reset</span>
        </button>
      </div>
    </aside>
  );
}

function FolderNode({ folderId, depth, filter }: { folderId: string; depth: number; filter: string }) {
  const { state, actions } = useDocsStore();
  const [showPicker, setShowPicker] = useState(false);
  
  // Defensive check for state existence
  if (!state.folders) return null;
  
  const folder = state.folders[folderId];
  if (!folder) return null;

  const expanded = state.expandedFolderIds[folderId] ?? false;

  return (
    <div className="relative">
      <div
        className="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        <div className="flex flex-1 items-center gap-1.5 min-w-0">
          <button 
            type="button" 
            className="flex items-center justify-center p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" 
            onClick={(e) => { e.stopPropagation(); actions.toggleFolderExpanded(folderId); }}
          >
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
          
          <button 
            type="button"
            className="flex items-center gap-2 min-w-0 flex-1 text-left py-0.5" 
            onClick={() => setShowPicker(!showPicker)}
          >
            <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/50 rounded shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-all">
              {folder.icon ? <RenderDocIcon icon={folder.icon} className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5 text-zinc-400" />}
            </div>
            <span className="font-medium truncate text-[13px]">{folder.name}</span>
          </button>
        </div>

        <button
          type="button"
          className="rounded p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity"
          title="New page in folder"
          onClick={(e) => { e.stopPropagation(); actions.createPage(folderId, "New page"); }}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {showPicker && (
        <div className="absolute left-full top-0 z-50 ml-2 shadow-2xl">
          <IconPicker 
            current={folder.icon} 
            onChange={(icon) => actions.updateFolderIcon(folderId, icon)} 
            onClose={() => setShowPicker(false)} 
          />
        </div>
      )}

      {(expanded || filter) && (
        <div className="relative ml-[11px] border-l border-zinc-200 dark:border-zinc-800 my-0.5">
          {folder.folderIds.map((fid) => (
            <FolderNode key={fid} folderId={fid} depth={depth + 1} filter={filter} />
          ))}
          {folder.pageIds.map((pid) => (
            <PageNode key={pid} pageId={pid} depth={depth + 1} filter={filter} />
          ))}
        </div>
      )}
    </div>
  );
}

function PageNode({ pageId, depth, filter }: { pageId: string; depth: number; filter: string }) {
  const { state, actions } = useDocsStore();
  const [showPicker, setShowPicker] = useState(false);
  
  // Defensive check for state existence
  if (!state.pages) return null;
  
  const page = state.pages[pageId];
  if (!page) return null;
  
  if (filter && !page.title.toLowerCase().includes(filter)) return null;

  const active = state.selectedPageId === pageId;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => actions.selectPage(pageId)}
        className={cn(
          "group relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-all",
          active
            ? "bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-200 shadow-sm"
            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200"
        )}
        style={{ paddingLeft: 16 + depth * 4 }}
      >
        {active && (
          <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-indigo-500 rounded-full" />
        )}
        
         <button
          type="button"
          className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-white dark:bg-zinc-900 rounded shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
          onClick={(e) => { e.stopPropagation(); setShowPicker(!showPicker); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              setShowPicker(!showPicker);
            }
          }}
        >
           {page.icon ? <RenderDocIcon icon={page.icon} className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5 text-zinc-400" />}
        </button>
        <span className={cn("truncate flex-1 text-[13px]", active ? "font-semibold" : "font-medium")}>
          {page.title}
        </span>
      </button>

      {showPicker && (
        <div className="absolute left-full top-0 z-50 ml-2 shadow-2xl">
          <IconPicker 
            current={page.icon} 
            onChange={(icon) => actions.updatePageIcon(pageId, icon)} 
            onClose={() => setShowPicker(false)} 
          />
        </div>
      )}
    </div>
  );
}
