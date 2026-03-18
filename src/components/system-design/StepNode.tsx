import { Handle, Position } from "@xyflow/react";

interface StepNodeData {
  label: string;
  content: string[];
  [key: string]: unknown;
}

export function StepNode({ data }: { data: StepNodeData }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded p-4">
      <Handle type="target" position={Position.Left} className="bg-cyan-400" />
      <h3 className="text-sm font-semibold text-cyan-400 mb-2">{data.label}</h3>
      <ul className="text-xs text-zinc-100 space-y-1">
        {data.content.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <Handle type="source" position={Position.Right} className="bg-cyan-400" />
    </div>
  );
}
