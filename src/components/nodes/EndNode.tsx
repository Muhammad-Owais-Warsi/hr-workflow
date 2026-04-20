import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export function EndNode({ data, selected }: NodeProps) {
  const nodeData = data as Record<string, unknown>;
  return (
    <div
      className={`px-3 py-2 rounded-full border-2 ${selected ? 'border-red-500' : 'border-red-400'} bg-red-50`}
      style={{ cursor: 'default' }}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-800 !w-2 !h-2" />
      <div className="text-xs font-medium text-red-700">■ End</div>
      <div className="text-[10px] text-red-600 truncate max-w-[100px]">
        {String(nodeData?.endMessage || 'Complete')}
      </div>
    </div>
  );
}