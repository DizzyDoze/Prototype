import { useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAutoLayout } from "@/hooks/useAutoLayout";
import { initialNodes, initialEdges } from "@/data/system-design/base";
import { StepNode } from "./StepNode";
import uber from "@/data/system-design/uber";
import whatsapp from "@/data/system-design/whatsapp";
import youtube from "@/data/system-design/youtube";
import dropbox from "@/data/system-design/dropbox";

const caseData: Record<string, typeof uber> = { uber, whatsapp, youtube, dropbox };
const nodeTypes: NodeTypes = { step: StepNode };
const layoutOptions = { direction: "LR" as const, spacing: [50, 200] as [number, number], fitViewOptions: { maxZoom: 0.8 } };

function SDRoadmap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  useAutoLayout(layoutOptions);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (node.id === "root") return;
      const caseId = node.id;
      const data = caseData[caseId];
      if (!data) return;

      const isExpanded = nodes.some((n) => n.id.startsWith(`${caseId}-step-`));
      if (isExpanded) {
        setNodes((ns) => ns.filter((n) => !n.id.startsWith(`${caseId}-step-`)));
        setEdges((es) => es.filter((e) => !e.id.startsWith(`e-${caseId}-step-`)));
      } else {
        setNodes((ns) => [
          ...ns,
          ...data.steps.map((step, i) => ({
            id: `${caseId}-step-${i}`,
            type: "step",
            position: { x: 0, y: 0 },
            data: { label: step.title, content: step.content },
          })),
        ]);
        setEdges((es) => [
          ...es,
          ...data.steps.map((_, i) => ({
            id: `e-${caseId}-step-${i}`,
            source: caseId,
            target: `${caseId}-step-${i}`,
          })),
        ]);
      }
    },
    [nodes, setNodes, setEdges]
  );

  return (
    <div className="flex-1 min-h-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}

export default SDRoadmap;
