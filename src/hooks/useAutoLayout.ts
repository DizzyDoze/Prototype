import { useEffect } from "react";
import { useReactFlow, useStore, useNodesInitialized, type Node, type Edge, type FitViewOptions } from "@xyflow/react";
import Dagre from "@dagrejs/dagre";

type Options = { direction: "LR" | "TB"; spacing: [number, number]; fitViewOptions?: FitViewOptions };

function layout(nodes: Node[], edges: Edge[], { direction, spacing }: Options) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: spacing[0], ranksep: spacing[1] });

  for (const node of nodes) {
    const w = node.measured?.width ?? 0;
    const h = node.measured?.height ?? 0;
    g.setNode(node.id, { width: w, height: h });
  }
  for (const edge of edges) g.setEdge(edge.source, edge.target);

  Dagre.layout(g);

  return nodes.map((node) => {
    const { x, y } = g.node(node.id);
    const w = node.measured?.width ?? 0;
    const h = node.measured?.height ?? 0;
    return { ...node, position: { x: x - w / 2, y: y - h / 2 } };
  });
}

// Compare structure only (node count, edges, measured sizes) — ignore positions
function structureEqual(a: { nodes: Node[]; edges: Edge[] }, b: { nodes: Node[]; edges: Edge[] }) {
  if (a.nodes.length !== b.nodes.length || a.edges.length !== b.edges.length) return false;
  for (let i = 0; i < a.nodes.length; i++) {
    if (a.nodes[i].id !== b.nodes[i].id) return false;
    if (a.nodes[i].measured?.width !== b.nodes[i].measured?.width) return false;
    if (a.nodes[i].measured?.height !== b.nodes[i].measured?.height) return false;
  }
  for (let i = 0; i < a.edges.length; i++) {
    if (a.edges[i].source !== b.edges[i].source) return false;
    if (a.edges[i].target !== b.edges[i].target) return false;
  }
  return true;
}

export function useAutoLayout(options: Options) {
  const { setNodes, fitView } = useReactFlow();
  const initialized = useNodesInitialized();
  const elements = useStore((s) => ({ nodes: s.nodes, edges: s.edges }), structureEqual);

  useEffect(() => {
    if (!initialized || elements.nodes.length === 0) return;
    setNodes(layout(elements.nodes, elements.edges, options));
    requestAnimationFrame(() => fitView(options.fitViewOptions));
  }, [initialized, elements, options, setNodes, fitView]);
}
