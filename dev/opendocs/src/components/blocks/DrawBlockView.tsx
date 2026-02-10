import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { DrawBlock, DocBlock } from "@/types/docs";

export function DrawBlockView({
  block,
  disabled,
  onUpdate,
}: {
  block: DrawBlock;
  disabled: boolean;
  onUpdate: (patch: Partial<DocBlock>) => void;
}) {
  const { data } = block;
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(data.title || "Drawing");

  const handleSaveTitle = () => {
    if (disabled) return;
    onUpdate({ data: { ...data, title: titleValue.trim() } });
    setEditingTitle(false);
  };

  const handleAddElement = () => {
    if (disabled) return;
    const newElement = {
      id: `element_${Date.now()}`,
      type: "rectangle",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
    };
    const newElements = [...(data.elements as any[]), newElement];
    onUpdate({ data: { ...data, elements: newElements } });
  };

  const handleDeleteElement = (elementId: string) => {
    if (disabled) return;
    const newElements = (data.elements as any[]).filter(
      (e: any) => e.id !== elementId
    );
    onUpdate({ data: { ...data, elements: newElements } });
  };

  return (
    <div className="space-y-4 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header with Title */}
      <div className="flex items-center justify-between">
         {editingTitle ? (
           <div className="flex flex-1 gap-2">
             <input
               value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") setEditingTitle(false);
              }}
              className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
            <button
              onClick={handleSaveTitle}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Save
            </button>
            <button
              onClick={() => setEditingTitle(false)}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold">{titleValue}</h3>
            {!disabled && (
              <button
                onClick={() => setEditingTitle(true)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <Edit2 size={16} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded bg-zinc-50 p-2 dark:bg-zinc-800">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
            {(data.elements as any[]).length}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            Element{(data.elements as any[]).length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="rounded bg-zinc-50 p-2 dark:bg-zinc-800">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
            {data.appState ? "Active" : "Idle"}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">State</div>
        </div>
      </div>

      {/* Elements List */}
      {(data.elements as any[]).length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            ELEMENTS
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {(data.elements as any[]).map((element: any, index: number) => (
              <div
                key={element.id || index}
                className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1 text-xs dark:bg-zinc-800"
              >
                <span className="text-zinc-700 dark:text-zinc-300">
                  {element.type || "Element"} {index + 1}
                </span>
                {!disabled && (
                  <button
                    onClick={() => handleDeleteElement(element.id)}
                    className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Button */}
      {!disabled && (
        <button
          onClick={handleAddElement}
          className="w-full rounded border border-dashed border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          + Add Element
        </button>
      )}

      {/* Empty State */}
      {(data.elements as any[]).length === 0 && !disabled && (
        <div className="rounded bg-zinc-50 p-3 text-center text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          No elements yet. Click "Add Element" to get started.
        </div>
      )}
    </div>
  );
}
