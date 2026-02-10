import { useMemo, useState } from "react";
import { useDocsStore } from "@/store/useDocsStore";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { SlashMenu } from "@/components/SlashMenu";
import { PageHeader } from "@/components/PageHeader";
import type { BlockType, HeadingBlock, ParagraphBlock, DocBlock } from "@/types/docs";
import { Sparkles, Plus, ChevronDown } from "lucide-react";

export function Editor() {
  const { state, actions } = useDocsStore();
  const page = state.selectedPageId ? state.pages[state.selectedPageId] : undefined;
  const dark = state.theme === "dark";

  const [slashBlockId, setSlashBlockId] = useState<string | null>(null);
  const [showSlashAtEnd, setShowSlashAtEnd] = useState(false);

  const blocks = page?.blocks ?? [];

  const slashIndex = useMemo(() => {
    if (!slashBlockId) return -1;
    return blocks.findIndex((b) => b.id === slashBlockId);
  }, [blocks, slashBlockId]);

  const handleAddBlock = (type: BlockType, afterId: string | null = null) => {
    if (!page) return;
    const targetId = afterId ?? blocks.at(-1)?.id ?? null;
    const id = actions.addBlockAfter(page.id, targetId, type);
    
    // Set initial content for specific block types
    if (type === "heading2") {
      const headingData: Partial<HeadingBlock> = { text: "New section" };
      actions.updateBlock(page.id, id, headingData);
    }
    if (type === "paragraph") actions.updateBlock(page.id, id, { text: "" } as Partial<ParagraphBlock>);
    
    setSlashBlockId(null);
    setShowSlashAtEnd(false);
  };

  if (!page) {
    return (
      <div className="p-10 text-sm text-zinc-600 dark:text-zinc-300">
        No page selected.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <PageHeader />

      <div className="space-y-4">
        {blocks.map((b, idx) => (
          <div key={b.id}>
            <BlockRenderer
              block={b}
              dark={dark}
              onUpdate={(patch) => {
    const anyPatch = patch as unknown as (Partial<DocBlock> & { __convertToDatabase?: boolean });
    if (anyPatch?.__convertToDatabase) {
      actions.convertTableToDatabase(page.id, b.id);
      return;
    }
                actions.updateBlock(page.id, b.id, patch);
              }}
              onDelete={() => actions.deleteBlock(page.id, b.id)}
              onMove={(dir) => actions.moveBlock(page.id, b.id, dir)}
              onToggleLock={() => actions.toggleBlockLock(page.id, b.id)}
              onSlash={() => setSlashBlockId(b.id)}
            />

            {/* SlashMenu after specific block */}
            {slashIndex === idx && (
              <div className="relative">
                <div className="absolute left-0 right-0 z-50">
                  <SlashMenu
                    onClose={() => setSlashBlockId(null)}
                    onSelect={(t: BlockType) => handleAddBlock(t, b.id)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* SlashMenu at end of document */}
        {showSlashAtEnd && (
          <div className="relative">
            <div className="absolute left-0 right-0 z-50">
              <SlashMenu
                onClose={() => setShowSlashAtEnd(false)}
                onSelect={(t: BlockType) => handleAddBlock(t)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Block Creation Toolbar - Always visible at bottom */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {/* Quick Add Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 shadow-sm transition-all active:scale-95"
            onClick={() => handleAddBlock("paragraph")}
          >
            <Plus className="h-4 w-4" /> Text
          </button>
          
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 shadow-sm transition-all active:scale-95"
            onClick={() => handleAddBlock("heading2")}
          >
            <Plus className="h-4 w-4" /> Heading
          </button>
          
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 shadow-sm transition-all active:scale-95"
          onClick={() => handleAddBlock("image")}
        >
          <Plus className="h-4 w-4" /> Image
        </button>
          
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 shadow-sm transition-all active:scale-95"
          onClick={() => handleAddBlock("video")}
        >
          <Plus className="h-4 w-4" /> Video
        </button>
          
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 shadow-sm transition-all active:scale-95"
          onClick={() => handleAddBlock("n8n")}
        >
          <Plus className="h-4 w-4" /> n8n
        </button>
        </div>

        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* More Options Dropdown */}
        <div className="relative group">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" /> 
          More Blocks
          <ChevronDown className="h-3 w-3" />
        </button>
          
          <div className="absolute bottom-full left-0 mb-2 hidden w-56 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg group-hover:block dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-[10px] font-bold uppercase tracking-tight text-zinc-400 px-2 py-1">All Block Types</div>
            <div className="grid grid-cols-2 gap-1 mt-1">
            <button type="button" onClick={() => handleAddBlock("table")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Table</button>
            <button type="button" onClick={() => handleAddBlock("database")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Database</button>
            <button type="button" onClick={() => handleAddBlock("workflow")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Workflow</button>
            <button type="button" onClick={() => handleAddBlock("draw")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Draw</button>
            <button type="button" onClick={() => handleAddBlock("code")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Code</button>
            <button type="button" onClick={() => handleAddBlock("callout")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Callout</button>
            <button type="button" onClick={() => handleAddBlock("checklist")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Checklist</button>
            <button type="button" onClick={() => handleAddBlock("mermaid")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Mermaid</button>
            <button type="button" onClick={() => handleAddBlock("link")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Link</button>
            <button type="button" onClick={() => handleAddBlock("quote")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Quote</button>
            <button type="button" onClick={() => handleAddBlock("divider")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">Divider</button>
            <button type="button" onClick={() => handleAddBlock("file")} className="text-left px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded dark:text-zinc-200 dark:hover:bg-zinc-900">File</button>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* AI Button */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all active:scale-95 group"
          onClick={() => handleAddBlock("aiPrompt")}
        >
          <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
          Ask AI
        </button>
      </div>

      <div className="h-24" />
    </div>
  );
}
