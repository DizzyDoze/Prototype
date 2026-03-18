import { Position, type Node, type Edge } from "@xyflow/react";

export const STEPS = [
  "Requirements",
  "Core Entities",
  "API / Interface",
  "Data Flow",
  "High-Level Design",
  "Deep Dives",
];

export const cases = [
  { id: "uber", label: "Uber" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "youtube", label: "YouTube" },
  { id: "dropbox", label: "Dropbox" },
];

export const initialNodes: Node[] = [
  {
    id: "root",
    position: { x: 0, y: 0 },
    data: { label: "System Design" },
    sourcePosition: Position.Right,
    style: { background: "#06B6D4", color: "#000", fontWeight: 700, border: "none" },
  },
  ...cases.map((c) => ({
    id: c.id,
    position: { x: 0, y: 0 },
    data: { label: c.label },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  })),
];

export const initialEdges: Edge[] = cases.map((c) => ({
  id: `e-root-${c.id}`,
  source: "root",
  target: c.id,
}));
