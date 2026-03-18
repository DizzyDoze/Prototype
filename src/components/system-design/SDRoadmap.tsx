import { useCallback, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cases } from "@/data/system-design/base";
import { StepNode } from "./StepNode";
import uber from "@/data/system-design/uber";
import whatsapp from "@/data/system-design/whatsapp";
import youtube from "@/data/system-design/youtube";
import dropbox from "@/data/system-design/dropbox";

const caseData: Record<string, typeof uber> = { uber, whatsapp, youtube, dropbox };

const nodeTypes: NodeTypes = { step: StepNode };

const caseStyle = { background: "#18181b", color: "#e4e4e7", border: "1px solid #3f3f46" };

const initialNodes: Node[] = [
  {
    id: "root",
    position: { x: 0, y: 0 },
    data: { label: "System Design" },
    style: { background: "#06B6D4", color: "#000", fontWeight: 700, border: "none" },
  },
  ...cases.map((c, i) => ({
    id: c.id,
    position: { x: 250, y: -75 + i * 50 },
    data: { label: c.label },
    style: caseStyle,
  })),
];

const initialEdges: Edge[] = cases.map((c) => ({
  id: `e-root-${c.id}`,
  source: "root",
  target: c.id,
}));

export function SDRoadmap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (node.id === "root") return;

      const caseId = node.id;
      const data = caseData[caseId];
      if (!data) return;

      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(caseId)) {
          // Collapse: remove step nodes and edges
          next.delete(caseId);
          setNodes((ns) => ns.filter((n) => !n.id.startsWith(`${caseId}-step-`)));
          setEdges((es) => es.filter((e) => !e.id.startsWith(`e-${caseId}-step-`)));
        } else {
          // Expand: add step nodes and edges
          next.add(caseId);
          const caseNode = nodes.find((n) => n.id === caseId);
          const baseX = (caseNode?.position.x ?? 250) + 200;
          const baseY = (caseNode?.position.y ?? 0) - 75;

          const stepNodes: Node[] = data.steps.map((step, i) => ({
            id: `${caseId}-step-${i}`,
            type: "step",
            position: { x: baseX, y: baseY + i * 120 },
            data: { label: step.title, content: step.content },
          }));

          const stepEdges: Edge[] = data.steps.map((_, i) => ({
            id: `e-${caseId}-step-${i}`,
            source: caseId,
            target: `${caseId}-step-${i}`,
          }));

          setNodes((ns) => [...ns, ...stepNodes]);
          setEdges((es) => [...es, ...stepEdges]);
        }
        return next;
      });
    },
    [nodes, setNodes, setEdges]
  );

  return (
    <div className="h-[calc(100vh-53px)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}
