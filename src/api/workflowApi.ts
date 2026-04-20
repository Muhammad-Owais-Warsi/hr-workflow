import type { Node, Edge } from '@xyflow/react';
import type { SimulationStep, SimulationResult } from '../types';

const mockDb = {
  users: [
    { id: 'user-1', name: 'John Manager', role: 'Manager' },
    { id: 'user-2', name: 'Sarah HR', role: 'HRBP' },
    { id: 'user-3', name: 'Mike Director', role: 'Director' },
  ],
  emails: [] as any[],
  documents: [] as any[],
};

export async function getAutomations() {
  return [
    { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
    { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
    { id: 'create_notification', label: 'Create Notification', params: ['user', 'message'] },
    { id: 'update_record', label: 'Update Record', params: ['table', 'id', 'field', 'value'] },
    { id: 'webhook_call', label: 'Call Webhook', params: ['url', 'method'] },
  ];
}

export async function simulateWorkflow(
  nodes: Node[],
  edges: Edge[]
): Promise<SimulationResult> {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const outgoingEdges = new Map<string, string[]>();
  
  edges.forEach(e => {
    if (!outgoingEdges.has(e.source)) outgoingEdges.set(e.source, []);
    outgoingEdges.get(e.source)!.push(e.target);
  });

  const startNodes = nodes.filter(n => (n.data as any)?.type === 'start');
  if (startNodes.length === 0) return { success: false, steps: [], error: 'Start node required' };
  if (startNodes.length > 1) return { success: false, steps: [], error: 'Only one Start node allowed' };

  const endNodes = nodes.filter(n => (n.data as any)?.type === 'end');
  if (endNodes.length === 0) return { success: false, steps: [], error: 'End node required' };

  const steps: SimulationStep[] = [];
  const visited = new Set<string>();

  const traverse = (nodeId: string): void => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) return;

    const data = node.data as Record<string, unknown>;
    const nodeType = data?.type as string;
    const nextIds = outgoingEdges.get(nodeId) || [];

    if (nodeType === 'start') {
      steps.push({
        nodeId: node.id,
        nodeLabel: (data?.label as string) || 'Start',
        status: 'completed',
        message: 'Workflow started',
      });
    } else if (nodeType === 'task') {
      const assignee = data?.assignee as string || 'Unassigned';
      const dueDate = data?.dueDate as string || '';
      steps.push({
        nodeId: node.id,
        nodeLabel: (data?.title as string) || 'Task',
        status: 'completed',
        message: `Assigned to ${assignee}${dueDate ? ` • Due: ${dueDate}` : ''}`,
      });
    } else if (nodeType === 'approval') {
      const approverRole = data?.approverRole as string || '';
      const threshold = Number(data?.autoApproveThreshold) || 0;
      
      if (threshold > 0) {
        steps.push({
          nodeId: node.id,
          nodeLabel: (data?.title as string) || 'Approval',
          status: 'completed',
          message: `Auto-approved (threshold: $${threshold})`,
        });
      } else {
        const approver = mockDb.users.find(u => u.role === approverRole) || mockDb.users[0];
        steps.push({
          nodeId: node.id,
          nodeLabel: (data?.title as string) || 'Approval',
          status: 'completed',
          message: `Approved by ${approver.name} (${approverRole || 'Manager'})`,
        });
      }
    } else if (nodeType === 'automated') {
      const actionId = data?.actionId as string;
      const actionParams = data?.actionParams as Record<string, string> || {};
      
      if (actionId === 'send_email') {
        const email = {
          to: actionParams.to || 'recipient@example.com',
          subject: actionParams.subject || 'Notification',
          timestamp: new Date().toISOString(),
        };
        mockDb.emails.push(email);
        steps.push({
          nodeId: node.id,
          nodeLabel: (data?.title as string) || 'Send Email',
          status: 'completed',
          message: `Sent to ${email.to}`,
        });
      } else if (actionId === 'generate_doc') {
        const doc = {
          template: actionParams.template || 'default',
          recipient: actionParams.recipient || 'Unknown',
        };
        mockDb.documents.push(doc);
        steps.push({
          nodeId: node.id,
          nodeLabel: (data?.title as string) || 'Generate Document',
          status: 'completed',
          message: `Generated "${doc.template}"`,
        });
      } else if (actionId === 'create_notification') {
        steps.push({
          nodeId: node.id,
          nodeLabel: (data?.title as string) || 'Create Notification',
          status: 'completed',
          message: `Notification created`,
        });
      } else {
        steps.push({
          nodeId: node.id,
          nodeLabel: (data?.title as string) || 'Automated Action',
          status: 'completed',
          message: `Executed: ${actionId}`,
        });
      }
    } else if (nodeType === 'end') {
      const summaryFlag = data?.summaryFlag;
      let endMsg = (data?.endMessage as string) || 'Completed';
      
      if (summaryFlag) {
        const totalTasks = nodes.filter(n => (n.data as any)?.type === 'task').length;
        const totalApprovals = nodes.filter(n => (n.data as any)?.type === 'approval').length;
        endMsg += ` (${totalTasks} tasks, ${totalApprovals} approvals)`;
      }
      
      steps.push({
        nodeId: node.id,
        nodeLabel: (data?.label as string) || 'End',
        status: 'completed',
        message: endMsg,
      });
      return;
    }

    for (const nextId of nextIds) {
      traverse(nextId);
    }
  };

  traverse(startNodes[0].id);

  const reachableFromStart = new Set<string>();
  const dfs = (id: string) => {
    if (reachableFromStart.has(id)) return;
    reachableFromStart.add(id);
    for (const next of outgoingEdges.get(id) || []) dfs(next);
  };
  dfs(startNodes[0].id);

  const unreachableNodes = nodes.filter(n => !reachableFromStart.has(n.id));
  if (unreachableNodes.length > 0) {
    return { success: false, steps: [], error: `Unreachable nodes: ${unreachableNodes.map(n => n.id).join(', ')}` };
  }

  const endReachable = new Set<string>();
  const traceEnd = (id: string) => {
    if (endReachable.has(id)) return;
    const next = outgoingEdges.get(id) || [];
    if (next.length === 0) {
      const node = nodeMap.get(id);
      if (node && (node.data as any)?.type === 'end') {
        endReachable.add(id);
      }
    } else {
      for (const n of next) traceEnd(n);
    }
  };
  traceEnd(startNodes[0].id);

  if (endReachable.size === 0) {
    return { success: false, steps: [], error: 'No path to End node' };
  }

  return { success: true, steps };
}

export function exportWorkflow(nodes: Node[], edges: Edge[]) {
  const workflow = {
    name: 'HR Workflow',
    exportedAt: new Date().toISOString(),
    version: '1.0',
    nodes: nodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    })),
    edges: edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
    })),
  };
  return JSON.stringify(workflow, null, 2);
}

export function downloadWorkflow(nodes: Node[], edges: Edge[]) {
  const json = exportWorkflow(nodes, edges);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'workflow.json';
  a.click();
  URL.revokeObjectURL(url);
}