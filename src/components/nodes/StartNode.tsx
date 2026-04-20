import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export function StartNode({ data, selected }: NodeProps) {
  const nodeData = data as Record<string, unknown>;
  return (
    <div
      className={`px-3 py-2 rounded-full border-2 ${selected ? 'border-green-500' : 'border-green-400'} bg-green-50`}
      style={{ cursor: 'default' }}
    >
      <Handle type="source" position={Position.Right} className="!bg-gray-800 !w-2 !h-2" />
      <div className="text-xs font-medium text-green-700">▶ {String(nodeData?.label || 'Start')}</div>
    </div>
  );
}