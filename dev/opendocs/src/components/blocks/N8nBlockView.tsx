import { useState } from "react";
import { Edit2, Trash2, Plus, Copy, Check } from "lucide-react";
import type { N8nBlock, DocBlock } from "@/types/docs";
import type { N8nBlockData } from "@/types/n8n";
import { cn } from "@/utils/cn";

export function N8nBlockView({
  block,
  disabled,
  onUpdate,
}: {
  block: N8nBlock;
  disabled: boolean;
  onUpdate: (patch: Partial<DocBlock>) => void;
}) {
  const data: N8nBlockData = block.data || {
    title: "N8n Workflow",
    node: { nodeType: "", name: "", parameters: {} },
    connections: [],
  };

  // State for title editing
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(data.title || "N8n Workflow");

  // State for adding connections
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [connectionInput, setConnectionInput] = useState("");

  // State for copy feedback
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);

  // Save title handler
  const handleSaveTitle = () => {
    if (disabled) return;
    onUpdate({ data: { ...data, title: titleValue.trim() } });
    setEditingTitle(false);
  };

  // Add connection handler
  const handleAddConnection = () => {
    if (disabled || !connectionInput.trim()) return;
    const newConnections = [...(data.connections || []), connectionInput.trim()];
    onUpdate({ data: { ...data, connections: newConnections } });
    setConnectionInput("");
    setShowAddConnection(false);
  };

  // Remove connection handler
  const handleRemoveConnection = (index: number) => {
    if (disabled) return;
    const newConnections = data.connections.filter((_, i) => i !== index);
    onUpdate({ data: { ...data, connections: newConnections } });
  };

  // Copy workflow ID handler
  const handleCopyWorkflowId = () => {
    if (data.workflowId) {
      navigator.clipboard.writeText(data.workflowId);
      setCopiedWorkflow(true);
      setTimeout(() => setCopiedWorkflow(false), 2000);
    }
  };

  const nodeInfo = data.node || { nodeType: "", name: "", parameters: {} };
  const parameterCount = Object.keys(nodeInfo.parameters || {}).length;

  return (
    <div className="space-y-4 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Title Section */}
      <div className="flex items-center justify-between">
        {editingTitle ? (
          <div className="flex flex-1 gap-2">
            <input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Save
            </button>
            <button
              type="button"
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
                type="button"
                onClick={() => setEditingTitle(true)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <Edit2 size={16} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Node Information Section */}
      {(nodeInfo.nodeType || nodeInfo.name) && (
        <div className="space-y-2 rounded bg-zinc-50 p-3 dark:bg-zinc-800">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Node Information
          </h4>
          <div className="grid gap-2 text-sm">
            {nodeInfo.nodeType && (
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Type:</span>
                <span className="font-medium">{nodeInfo.nodeType}</span>
              </div>
            )}
            {nodeInfo.name && (
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Name:</span>
                <span className="font-medium">{nodeInfo.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Parameters:</span>
              <span className="font-medium">{parameterCount}</span>
            </div>
            {nodeInfo.disabled && (
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Status:</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">Disabled</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connections Section */}
      {(data.connections && data.connections.length > 0) || !disabled ? (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Connections
          </h4>
          {data.connections && data.connections.length > 0 ? (
            <div className="space-y-2">
              {data.connections.map((connectionId, index) => (
                <div
                  key={connectionId}
                  className="flex items-center justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">{connectionId}</span>
                  {!disabled && (
                    <button
                      type="button"
                       onClick={() => handleRemoveConnection(index)}
                      className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              No connections
            </div>
          )}

          {!disabled && (
            <>
              {showAddConnection ? (
                <div className="flex gap-2">
                  <input
                    value={connectionInput}
                    onChange={(e) => setConnectionInput(e.target.value)}
                    placeholder="Enter block ID..."
                    className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddConnection}
                    className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddConnection(false);
                      setConnectionInput("");
                    }}
                    className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddConnection(true)}
                  className="inline-flex items-center gap-2 rounded border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <Plus size={14} />
                  Add Connection
                </button>
              )}
            </>
          )}
        </div>
      ) : null}

      {/* Workflow ID Section */}
      {data.workflowId && (
        <div className="space-y-2 rounded bg-zinc-50 p-3 dark:bg-zinc-800">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Workflow ID
          </h4>
          <div className="flex items-center justify-between">
            <code className="text-xs text-zinc-700 dark:text-zinc-300">{data.workflowId}</code>
            <button
              type="button"
              onClick={handleCopyWorkflowId}
              className={cn(
                "transition-colors",
                copiedWorkflow
                  ? "text-green-600 dark:text-green-400"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
            >
              {copiedWorkflow ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* Execution ID Section */}
      {data.executionId && (
        <div className="space-y-2 rounded bg-zinc-50 p-3 dark:bg-zinc-800">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Execution ID
          </h4>
          <code className="text-xs text-zinc-700 dark:text-zinc-300">{data.executionId}</code>
        </div>
      )}
    </div>
  );
}
