import { useWorkflowStore } from '../../store/workflowStore';
import type { NodeType } from '../../types';

const NODE_TYPES: { type: NodeType; label: string; color: string; borderColor: string }[] = [
  { type: 'start', label: 'Start', color: 'bg-green-50', borderColor: 'border-green-400' },
  { type: 'task', label: 'Task', color: 'bg-blue-50', borderColor: 'border-blue-400' },
  { type: 'approval', label: 'Approval', color: 'bg-yellow-50', borderColor: 'border-yellow-400' },
  { type: 'automated', label: 'Auto', color: 'bg-purple-50', borderColor: 'border-purple-400' },
  { type: 'end', label: 'End', color: 'bg-red-50', borderColor: 'border-red-400' },
];

interface Template {
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
}

const templates: Template[] = [
  {
    name: 'Employee Onboarding',
    description: 'New hire onboarding',
    nodes: [
      { id: 'start-1', type: 'startNode', position: { x: 50, y: 100 }, data: { type: 'start', label: 'Start' } },
      { id: 'task-1', type: 'taskNode', position: { x: 180, y: 100 }, data: { type: 'task', title: 'Collect Docs', assignee: 'HR', dueDate: '3 days' } },
      { id: 'approval-1', type: 'approvalNode', position: { x: 310, y: 100 }, data: { type: 'approval', title: 'Manager Approve', approverRole: 'Manager' } },
      { id: 'task-2', type: 'taskNode', position: { x: 440, y: 100 }, data: { type: 'task', title: 'IT Setup', assignee: 'IT Team', dueDate: '2 days' } },
      { id: 'automated-1', type: 'automatedNode', position: { x: 570, y: 100 }, data: { type: 'automated', title: 'Send Welcome Email', actionId: 'send_email', actionParams: { subject: 'Welcome!' } } },
      { id: 'end-1', type: 'endNode', position: { x: 700, y: 100 }, data: { type: 'end', label: 'End', endMessage: 'Complete', summaryFlag: true } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'task-1', animated: true },
      { id: 'e2', source: 'task-1', target: 'approval-1', animated: true },
      { id: 'e3', source: 'approval-1', target: 'task-2', animated: true },
      { id: 'e4', source: 'task-2', target: 'automated-1', animated: true },
      { id: 'e5', source: 'automated-1', target: 'end-1', animated: true },
    ],
  },
  {
    name: 'Leave Request',
    description: 'Leave approval flow',
    nodes: [
      { id: 'start-1', type: 'startNode', position: { x: 50, y: 100 }, data: { type: 'start', label: 'Start' } },
      { id: 'task-1', type: 'taskNode', position: { x: 180, y: 100 }, data: { type: 'task', title: 'Submit Request', assignee: 'Employee' } },
      { id: 'approval-1', type: 'approvalNode', position: { x: 310, y: 100 }, data: { type: 'approval', title: 'Manager Review', approverRole: 'Manager', autoApproveThreshold: 3 } },
      { id: 'approval-2', type: 'approvalNode', position: { x: 440, y: 100 }, data: { type: 'approval', title: 'HR Approve', approverRole: 'HRBP' } },
      { id: 'automated-1', type: 'automatedNode', position: { x: 570, y: 100 }, data: { type: 'automated', title: 'Notify Employee', actionId: 'send_email', actionParams: { subject: 'Leave Approved' } } },
      { id: 'end-1', type: 'endNode', position: { x: 700, y: 100 }, data: { type: 'end', label: 'End', endMessage: 'Approved' } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'task-1', animated: true },
      { id: 'e2', source: 'task-1', target: 'approval-1', animated: true },
      { id: 'e3', source: 'approval-1', target: 'approval-2', animated: true },
      { id: 'e4', source: 'approval-2', target: 'automated-1', animated: true },
      { id: 'e5', source: 'automated-1', target: 'end-1', animated: true },
    ],
  },
  {
    name: 'Document Verification',
    description: 'Verify documents',
    nodes: [
      { id: 'start-1', type: 'startNode', position: { x: 50, y: 100 }, data: { type: 'start', label: 'Start' } },
      { id: 'task-1', type: 'taskNode', position: { x: 180, y: 100 }, data: { type: 'task', title: 'Upload Docs', assignee: 'Employee', dueDate: '5 days' } },
      { id: 'task-2', type: 'taskNode', position: { x: 310, y: 100 }, data: { type: 'task', title: 'Verify Docs', assignee: 'HR', dueDate: '2 days' } },
      { id: 'approval-1', type: 'approvalNode', position: { x: 440, y: 100 }, data: { type: 'approval', title: 'Final Approve', approverRole: 'Director' } },
      { id: 'automated-1', type: 'automatedNode', position: { x: 570, y: 100 }, data: { type: 'automated', title: 'Generate Cert', actionId: 'generate_doc', actionParams: { template: 'employment' } } },
      { id: 'end-1', type: 'endNode', position: { x: 700, y: 100 }, data: { type: 'end', label: 'End', endMessage: 'Verified', summaryFlag: true } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'task-1', animated: true },
      { id: 'e2', source: 'task-1', target: 'task-2', animated: true },
      { id: 'e3', source: 'task-2', target: 'approval-1', animated: true },
      { id: 'e4', source: 'approval-1', target: 'automated-1', animated: true },
      { id: 'e5', source: 'automated-1', target: 'end-1', animated: true },
    ],
  },
];

export function NodeSidebar() {
  const { setNodes, setEdges } = useWorkflowStore();

  const handleDragStart = (event: React.DragEvent, type: NodeType) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleLoadTemplate = (template: Template) => {
    setNodes(template.nodes);
    setEdges(template.edges);
  };

  return (
    <div className="w-44 bg-gray-50 border-r p-3 h-full overflow-y-auto">
      <h3 className="font-semibold text-xs mb-2 text-gray-700 uppercase">Add Nodes</h3>
      <div className="space-y-1.5 mb-4">
        {NODE_TYPES.map(({ type, label, color, borderColor }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            className={`p-2 rounded border-2 cursor-grab text-xs font-medium text-gray-700 ${color} ${borderColor} hover:opacity-80 active:cursor-grabbing`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="border-t pt-3">
        <h3 className="font-semibold text-xs mb-2 text-gray-700 uppercase">Templates</h3>
        <div className="space-y-1.5">
          {templates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadTemplate(template)}
              className="w-full p-2 rounded border border-gray-200 bg-white text-left hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="text-xs font-medium text-gray-700">{template.name}</div>
              <div className="text-[10px] text-gray-500">{template.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}