import type { DocBlock } from "@/types/docs";
import { 
  BotMessageSquare, Lock, Unlock, Trash2, 
  ArrowUp, ArrowDown, GripVertical, Wand2
} from "lucide-react";
import { cn } from "@/utils/cn";

export type AITransformationType = "refactor" | "summarize" | "translate" | "expand" | "fix";

export function BlockToolbar({
  block,
  locked,
  onChat,
  onToggleLock,
  onMove,
  onDelete,
  onConvert,
  onAITransform,
}: {
  block: DocBlock;
  locked: boolean;
  onChat: () => void;
  onToggleLock: () => void;
  onMove: (dir: "up" | "down") => void;
  onDelete: () => void;
  onConvert?: () => void;
  onAITransform?: (type: AITransformationType) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="flex h-7 items-center rounded-lg border border-zinc-200 bg-white p-0.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* AI Chat Button */}
        <button
          onClick={onChat}
          className="flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition-colors"
          title="AI Block Chat"
        >
          <BotMessageSquare className="h-3.5 w-3.5" />
        </button>
        
        {/* AI Transform Dropdown */}
        <div className="relative group/ai">
          <button
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-500 hover:text-indigo-600 transition-colors"
            title="AI Transform"
          >
            <Wand2 className="h-3.5 w-3.5" />
          </button>
          
          {/* AI Transform Options Dropdown */}
          <div className="absolute right-0 top-full z-50 mt-1 hidden w-40 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg group-hover/ai:block dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-[10px] font-bold uppercase tracking-tight text-zinc-400 px-2 py-1 border-b border-zinc-100 dark:border-zinc-800">
              AI Transform
            </div>
            {[
              { type: "refactor" as const, label: "Refactor", desc: "Improve structure" },
              { type: "summarize" as const, label: "Summarize", desc: "Make concise" },
              { type: "expand" as const, label: "Expand", desc: "Add details" },
              { type: "translate" as const, label: "Translate", desc: "To English" },
              { type: "fix" as const, label: "Fix", desc: "Fix grammar/issues" },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => onAITransform?.(item.type)}
                disabled={locked}
                className="flex w-full flex-col rounded-md px-2 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50"
              >
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onToggleLock}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded transition-colors",
            locked ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
          title={locked ? "Unlock block" : "Lock block"}
        >
          {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
        </button>

        {!locked && (
          <>
            <div className="mx-0.5 h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
            <button
              onClick={() => onMove("up")}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              title="Move up"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onMove("down")}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              title="Move down"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
            <div className="mx-0.5 h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
            {block.type === "table" && onConvert && (
              <button
                onClick={onConvert}
                className="flex h-6 items-center gap-1.5 px-1.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-[10px] font-bold uppercase tracking-tight text-indigo-600 dark:text-indigo-400"
              >
                DB
              </button>
            )}
            <button
              onClick={onDelete}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-400 hover:text-red-500 transition-colors"
              title="Delete block"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
      
      <div className="flex h-7 w-5 items-center justify-center cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 transition-colors">
         <GripVertical className="h-4 w-4" />
      </div>
    </div>
  );
}
