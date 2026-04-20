import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export function AutomatedNode({ data, selected }: NodeProps) {
  const nodeData = data as Record<string, unknown>;
  const title = nodeData?.title != null ? String(nodeData.title) : 'Automated';
  return (
    <div
      className={`px-3 py-2 rounded-lg border-2 min-w-[120px] ${selected ? 'border-purple-500' : 'border-purple-300'} bg-purple-50`}
      style={{ cursor: 'default' }}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-800 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-gray-800 !w-2 !h-2" />
      <div className="text-xs font-bold text-purple-700">⚡ Auto</div>
      <div className="text-[10px] text-purple-600 truncate max-w-[100px]">{title}</div>
    </div>
  );
}