import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { WorkflowBlock, DocBlock } from "@/types/docs";

export function WorkflowBlockView({
  block,
  disabled,
  onUpdate,
}: {
  block: WorkflowBlock;
  disabled: boolean;
  onUpdate: (patch: Partial<DocBlock>) => void;
}) {
  const { data } = block;
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(data.title || "Workflow");

  const handleTitleSave = () => {
    if (titleValue.trim() && titleValue !== data.title) {
      onUpdate({ data: { ...data, title: titleValue.trim() } });
    }
    setEditingTitle(false);
    setTitleValue(data.title || "Workflow");
  };

  const handleTitleCancel = () => {
    setEditingTitle(false);
    setTitleValue(data.title || "Workflow");
  };

  const handleAddNode = () => {
    if (disabled) return;
    const newNodeId = `node_${Date.now()}`;
    const newNodes = [
      ...data.nodes,
      {
        id: newNodeId,
        x: 100 + data.nodes.length * 50,
        y: 100 + (data.nodes.length % 3) * 80,
        label: `Node ${data.nodes.length + 1}`,
      },
    ];
    onUpdate({ data: { ...data, nodes: newNodes } });
  };

  const handleDeleteNode = (nodeId: string) => {
    if (disabled) return;
    const newNodes = data.nodes.filter((n) => n.id !== nodeId);
    const newEdges = data.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    );
    onUpdate({ data: { ...data, nodes: newNodes, edges: newEdges } });
  };

  return (
    <div className="space-y-4 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header with title */}
      <div className="flex items-center justify-between">
        {editingTitle ? (
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave();
                if (e.key === "Escape") handleTitleCancel();
              }}
              autoFocus
              className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm font-semibold dark:border-zinc-600 dark:bg-zinc-800"
              placeholder="Workflow title"
            />
            <button
              onClick={handleTitleSave}
              className="text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              Save
            </button>
            <button
              onClick={handleTitleCancel}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <h3 className="font-semibold">{titleValue}</h3>
            {!disabled && (
              <button
                onClick={() => setEditingTitle(true)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Edit title"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded bg-zinc-50 p-2 dark:bg-zinc-800">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
            {data.nodes.length}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            Node{data.nodes.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="rounded bg-zinc-50 p-2 dark:bg-zinc-800">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
            {data.edges.length}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            Connection{data.edges.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Nodes list */}
      {data.nodes.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            NODES
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.nodes.map((node) => (
              <div
                key={node.id}
                className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1 text-xs dark:bg-zinc-800"
              >
                <span className="text-zinc-700 dark:text-zinc-300">
                  {node.label}
                </span>
                {!disabled && (
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Delete node"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add node button */}
      {!disabled && (
        <button
          onClick={handleAddNode}
          className="w-full rounded border border-dashed border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          + Add Node
        </button>
      )}

      {/* Empty state */}
      {data.nodes.length === 0 && !disabled && (
        <div className="rounded bg-zinc-50 p-3 text-center text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          No nodes yet. Click "Add Node" to get started.
        </div>
      )}
    </div>
  );
}
