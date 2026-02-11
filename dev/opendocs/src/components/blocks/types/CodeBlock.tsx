import type { CodeBlock } from "@/types/docs";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CodeBlockView({
  block,
  disabled,
  onUpdate,
}: {
  block: CodeBlock;
  disabled: boolean;
  onUpdate: (patch: Partial<CodeBlock>) => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="group relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      {/* Header with Language and Copy */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-[#161b22] border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
          </div>
          <input
            disabled={disabled}
            value={block.language}
            onChange={(e) => onUpdate({ language: e.target.value })}
            className="ml-2 w-24 bg-transparent px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 border-none outline-none focus:ring-1 focus:ring-indigo-500/50 rounded"
            placeholder="Language"
          />
        </div>
        
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code Editor */}
      <textarea
        disabled={disabled}
        value={block.code}
        onChange={(e) => onUpdate({ code: e.target.value })}
        className="min-h-[120px] w-full resize-y bg-zinc-50 p-4 font-mono text-[13px] leading-relaxed text-zinc-900 outline-none dark:bg-[#0d1117] dark:text-[#e6edf3]"
        placeholder="// Paste code here"
        spellCheck={false}
      />
    </div>
  );
}
