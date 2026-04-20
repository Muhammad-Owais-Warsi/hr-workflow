import type { Node } from '@xyflow/react';
import { useWorkflowStore } from '../../store/workflowStore';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedNodeForm } from './AutomatedNodeForm';
import { EndNodeForm } from './EndNodeForm';

interface Props {
  node: Node;
}

export function NodeFormPanel({ node }: Props) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  const type = String(node.data?.type || '');
  const typeLabels: Record<string, string> = {
    start: 'Start Node',
    task: 'Task Node',
    approval: 'Approval Node',
    automated: 'Automated Step Node',
    end: 'End Node',
  };

  const handleUpdate = (data: Record<string, unknown>) => {
    updateNodeData(node.id, data);
  };

  const handleDelete = () => {
    deleteNode(node.id);
  };

  const renderForm = () => {
    switch (type) {
      case 'start':
        return <StartNodeForm data={node.data as Record<string, unknown>} onChange={handleUpdate} />;
      case 'task':
        return <TaskNodeForm data={node.data as Record<string, unknown>} onChange={handleUpdate} />;
      case 'approval':
        return <ApprovalNodeForm data={node.data as Record<string, unknown>} onChange={handleUpdate} />;
      case 'automated':
        return <AutomatedNodeForm data={node.data as Record<string, unknown>} onChange={handleUpdate} />;
      case 'end':
        return <EndNodeForm data={node.data as Record<string, unknown>} onChange={handleUpdate} />;
      default:
        return <div className="text-sm text-gray-500">Unknown node type</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b px-4 py-3">
        <h3 className="font-medium">{typeLabels[type] || 'Node'}</h3>
        <p className="text-sm text-gray-500">ID: {node.id}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderForm()}
      </div>

      <div className="border-t p-4">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}