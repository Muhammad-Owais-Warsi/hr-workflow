import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export function TaskNode({ data, selected }: NodeProps) {
  const nodeData = data as Record<string, unknown>;
  const title = nodeData?.title != null ? String(nodeData.title) : 'Task';
  const assignee = nodeData?.assignee;
  return (
    <div
      className={`px-3 py-2 rounded-lg border-2 min-w-[120px] ${selected ? 'border-blue-500' : 'border-blue-300'} bg-blue-50`}
      style={{ cursor: 'default' }}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-800 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-gray-800 !w-2 !h-2" />
      <div className="text-xs font-bold text-blue-700">Task</div>
      <div className="text-[10px] text-blue-600 truncate max-w-[100px]">{title}</div>
      {assignee != null && assignee !== '' && (
        <div className="text-[10px] text-gray-500 truncate max-w-[100px]">→ {String(assignee)}</div>
      )}
    </div>
  );
}