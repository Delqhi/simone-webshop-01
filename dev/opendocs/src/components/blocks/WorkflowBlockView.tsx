import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { WorkflowBlock, DocBlock } from "@/types/docs";

// Custom node component
function CustomNode({ data }: { data: { label: string } }) {
  return (
    <div>
      <div className="rounded bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 px-3 py-2 text-sm font-medium">
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

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

  // Transform nodes for ReactFlow
  const initialNodes: Node[] = useMemo(() => {
    return (data.nodes || []).map((node) => ({
      id: node.id,
      type: "default",
      position: { x: node.x || 100, y: node.y || 100 },
      data: { label: node.label || "Untitled" },
      style: {
        background: node.color || "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "10px 14px",
        minWidth: "120px",
        fontFamily: "sans-serif",
        fontSize: "14px",
        fontWeight: 500,
      },
    }));
  }, [data.nodes]);

  // Transform edges for ReactFlow
  const initialEdges: Edge[] = useMemo(() => {
    return (data.edges || []).map((edge) => ({
      ...edge,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#64748b", strokeWidth: 2 },
    }));
  }, [data.edges]);

  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle node position changes
  const onNodeDragStop = useCallback(() => {
    if (disabled) return;
    
    // Map back to block data format
    const updatedNodes = nodes.map((node) => {
      const originalNode = data.nodes?.find((n) => n.id === node.id);
      return {
        id: node.id,
        x: node.position.x,
        y: node.position.y,
        label: String(node.data?.label || originalNode?.label || "Untitled"),
        color: typeof node.style?.background === 'string' ? node.style.background : typeof node.style?.background === 'number' ? String(node.style.background) : originalNode?.color,
      };
    });

    onUpdate({ type: "workflow", data: { ...data, nodes: updatedNodes } });
  }, [nodes, disabled, data, onUpdate]);

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => new Promise<void>((resolve) => {
      if (disabled) {
        resolve();
        return;
      }

      setEdges((eds) => addEdge(params, eds));
      
      // Save to block data
      const newEdge = {
        id: `edge-${Date.now()}`,
        source: params.source || "",
        target: params.target || "",
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      };

      const updatedEdges = [...(data.edges || []), newEdge];
      onUpdate({ type: "workflow", data: { ...data, edges: updatedEdges } });
      resolve();
    }),
    [disabled, data, onUpdate, setEdges],
  );

  // Sync nodes/edges with data when they change
  useMemo(() => {
    if (disabled) return;
    
    const currentNodes = nodes.map(n => ({ id: n.id, position: n.position, data: n.data }));
    const initialNodesData = initialNodes.map(n => ({ id: n.id, position: n.position, data: n.data }));
    
    if (JSON.stringify(currentNodes) !== JSON.stringify(initialNodesData)) {
      const updatedNodes = nodes.map((node) => {
        const originalNode = data.nodes?.find((n) => n.id === node.id);
        return {
          id: node.id,
          x: node.position.x,
          y: node.position.y,
          label: String(node.data?.label || originalNode?.label || "Untitled"),
          color: typeof node.style?.background === 'string' ? node.style.background : typeof node.style?.background === 'number' ? String(node.style.background) : originalNode?.color,
        };
      });

      onUpdate({ type: "workflow", data: { ...data, nodes: updatedNodes } });
    }
  }, [nodes, initialNodes, disabled, data, onUpdate]);

  return (
    <div className="rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800" style={{ height: "500px", width: "100%" }}>
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
          Drag nodes here or add nodes from the toolbar
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={disabled ? undefined : onNodesChange}
        onEdgesChange={disabled ? undefined : onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#94a3b8" gap={16} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => (node.style?.background as string) || "#ffffff"}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
