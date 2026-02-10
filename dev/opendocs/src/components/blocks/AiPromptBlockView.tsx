import { useState } from "react";
import { Trash2, Send, Copy, CheckCircle2 } from "lucide-react";
import type { AiPromptBlock } from "@/types/docs";
import { agentPlan } from "@/services/nvidia";
import { executeOpenDocsCommand } from "@/commands/executeCommand";

export function AiPromptBlockView({
  pageId,
  block,
  disabled,
  onDelete,
  onUpdate,
}: {
  pageId: string;
  block: AiPromptBlock;
  disabled: boolean;
  onDelete: () => void;
  onUpdate: (patch: Partial<AiPromptBlock>) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExecutePrompt = async () => {
    if (disabled || loading || !block.prompt.trim()) return;
    setLoading(true);

    try {
      const plan = await agentPlan(block.prompt, {
        blockId: block.id,
        blockType: "aiPrompt",
        hint: "Execute the user's prompt and propose OpenDocs commands or transformations.",
      });

      if (plan.result) {
        // Update block with result
        const updateCmd = {
          type: "docs.block.update",
          pageId,
          blockId: block.id,
          patch: { result: plan.result } as Record<string, unknown>,
        };
        await executeOpenDocsCommand(updateCmd as Parameters<typeof executeOpenDocsCommand>[0]);
      }

      if (plan.commands && plan.commands.length > 0) {
        for (const cmd of plan.commands) {
          const safeCmd = { ...cmd } as Record<string, unknown>;
          if (safeCmd.pageId === undefined) safeCmd.pageId = pageId;
          await executeOpenDocsCommand(safeCmd as Parameters<typeof executeOpenDocsCommand>[0]);
        }
      }
    } catch (e) {
      console.error("AI Prompt execution failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = async () => {
    if (!block.result) return;
    try {
      await navigator.clipboard.writeText(block.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-3">
      {/* Prompt Input */}
       <div className="space-y-2">
         <label htmlFor="ai-prompt-input" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
           Prompt
         </label>
         <textarea
           id="ai-prompt-input"
           disabled={disabled || loading}
           value={block.prompt}
           onChange={(e) => {
             onUpdate({ prompt: e.target.value });
           }}
           placeholder="Ask AI to generate, transform, or analyze content for this document…"
           className="min-h-[100px] w-full resize-y rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 disabled:opacity-70"
         />
      </div>

      {/* Execute Button */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled || loading || !block.prompt.trim()}
          onClick={handleExecutePrompt}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
          {loading ? "Executing…" : "Execute Prompt"}
        </button>
        {!disabled && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Delete block"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

       {/* Result Display */}
       {block.result && (
         <div className="space-y-2">
           <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
             Result
           </div>
          <div className="relative rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <pre className="whitespace-pre-wrap text-xs text-zinc-700 dark:text-zinc-200 font-sans">
              {block.result}
            </pre>
            <button
              type="button"
              onClick={handleCopyResult}
              className="absolute top-2 right-2 rounded-md p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              title="Copy result"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Processing your prompt…
          </div>
        </div>
      )}
    </div>
  );
}
