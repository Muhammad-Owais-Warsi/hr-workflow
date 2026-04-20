import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export function ApprovalNode({ data, selected }: NodeProps) {
  const nodeData = data as Record<string, unknown>;
  const title = nodeData?.title != null ? String(nodeData.title) : 'Approval';
  const approverRole = nodeData?.approverRole;
  return (
    <div
      className={`px-3 py-2 rounded-lg border-2 min-w-[120px] ${selected ? 'border-yellow-500' : 'border-yellow-300'} bg-yellow-50`}
      style={{ cursor: 'default' }}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-800 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-gray-800 !w-2 !h-2" />
      <div className="text-xs font-bold text-yellow-700">Approval</div>
      <div className="text-[10px] text-yellow-600 truncate max-w-[100px]">{title}</div>
      {approverRole != null && approverRole !== '' && (
        <div className="text-[10px] text-gray-500 truncate max-w-[100px]">→ {String(approverRole)}</div>
      )}
    </div>
  );
}