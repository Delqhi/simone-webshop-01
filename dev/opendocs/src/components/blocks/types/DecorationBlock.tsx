import type { DividerBlock, QuoteBlock, CalloutBlock, LinkBlock, FileBlock } from "@/types/docs";
import { Info, AlertCircle, CheckCircle2, HelpCircle, Lightbulb, ExternalLink, FileIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export function DividerBlockView({ block: _ }: { block: DividerBlock }) {
  return <div className="my-6 h-px w-full bg-zinc-200 dark:bg-zinc-800" />;
}

export function QuoteBlockView({
  block,
  disabled,
  onUpdate,
}: {
  block: QuoteBlock;
  disabled: boolean;
  onUpdate: (patch: Partial<QuoteBlock>) => void;
}) {
  return (
    <div className="border-l-4 border-zinc-200 pl-4 dark:border-zinc-800">
      <textarea
        disabled={disabled}
        value={block.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        className="w-full resize-none bg-transparent text-lg italic text-zinc-700 outline-none dark:text-zinc-300"
        placeholder="Quote…"
      />
      <input
        disabled={disabled}
        value={block.caption || ""}
        onChange={(e) => onUpdate({ caption: e.target.value })}
        className="mt-1 w-full bg-transparent text-xs text-zinc-500 outline-none"
        placeholder="— Source"
      />
    </div>
  );
}

export function CalloutBlockView({
  block,
  disabled,
  onUpdate,
}: {
  block: CalloutBlock;
  disabled: boolean;
  onUpdate: (patch: Partial<CalloutBlock>) => void;
}) {
  const Icon = {
    info: Info,
    success: CheckCircle2,
    warning: AlertCircle,
    error: AlertCircle,
    tip: Lightbulb,
  }[block.tone] || HelpCircle;

  const bgCls = {
    info: "bg-blue-50/40 border-blue-200 dark:bg-blue-950/10 dark:border-blue-900 border-l-blue-500",
    success: "bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900 border-l-emerald-500",
    warning: "bg-amber-50/40 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900 border-l-amber-500",
    error: "bg-red-50/40 border-red-200 dark:bg-red-950/10 dark:border-red-900 border-l-red-500",
    tip: "bg-indigo-50/40 border-indigo-200 dark:bg-indigo-950/10 dark:border-indigo-900 border-l-indigo-500",
  }[block.tone];

  const iconCls = {
    info: "text-blue-600 dark:text-blue-400",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    error: "text-red-600 dark:text-red-400",
    tip: "text-indigo-600 dark:text-indigo-400",
  }[block.tone];

  const iconBgCls = {
    info: "bg-blue-100 dark:bg-blue-900/30",
    success: "bg-emerald-100 dark:bg-emerald-900/30",
    warning: "bg-amber-100 dark:bg-amber-900/30",
    error: "bg-red-100 dark:bg-red-900/30",
    tip: "bg-indigo-100 dark:bg-indigo-900/30",
  }[block.tone];

  return (
    <div className={cn("flex gap-4 rounded-lg border border-l-4 p-4 transition-all hover:shadow-sm", bgCls)}>
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm", iconBgCls)}>
        <Icon className={cn("h-5 w-5", iconCls)} />
      </div>
      <div className="flex-1 space-y-1">
        <input
          disabled={disabled}
          value={block.title || ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full bg-transparent text-sm font-bold tracking-tight text-zinc-900 outline-none dark:text-zinc-100"
          placeholder="Callout title"
        />
        <textarea
          disabled={disabled}
          value={block.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full resize-none bg-transparent text-sm leading-relaxed text-zinc-700 outline-none dark:text-zinc-300"
          placeholder="Callout content…"
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
      </div>
    </div>
  );
}

export function LinkBlockView({
  block,
  disabled,
  onUpdate,
}: {
  block: LinkBlock;
  disabled: boolean;
  onUpdate: (patch: Partial<LinkBlock>) => void;
}) {
  return (
    <div className="group relative flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm hover:shadow-md overflow-hidden">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
         <ExternalLink className="h-6 w-6 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
         <input
           disabled={disabled}
           value={block.title || ""}
           onChange={(e) => onUpdate({ title: e.target.value })}
           className="w-full bg-transparent text-sm font-semibold text-zinc-900 outline-none dark:text-zinc-100"
           placeholder="Link Title"
         />
         <input
           disabled={disabled}
           value={block.url}
           onChange={(e) => onUpdate({ url: e.target.value })}
           className="w-full bg-transparent text-xs text-zinc-500 outline-none hover:text-indigo-600 truncate"
           placeholder="https://example.com"
         />
      </div>
      {block.url && (
         <a href={block.url} target="_blank" rel="noreferrer" className="shrink-0 rounded-full p-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
            <ExternalLink className="h-4 w-4" />
         </a>
      )}
    </div>
  );
}

export function FileBlockView({
  block,
  disabled,
  onUpdate,
}: {
  block: FileBlock;
  disabled: boolean;
  onUpdate: (patch: Partial<FileBlock>) => void;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60">
       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700">
          <FileIcon className="h-5 w-5 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
       </div>
       <div className="flex-1 min-w-0">
          <input
            disabled={disabled}
            value={block.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full bg-transparent text-sm font-medium text-zinc-800 outline-none dark:text-zinc-200"
            placeholder="File name"
          />
          <input
            disabled={disabled}
            value={block.url || ""}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className="w-full bg-transparent text-[11px] text-zinc-400 outline-none"
            placeholder="Upload URL or paste link"
          />
       </div>
       <button type="button" className="shrink-0 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
          Download
       </button>
    </div>
  );
}
