export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData {
  type: NodeType;
  label: string;
  [key: string]: unknown;
}

export type WorkflowNodeData = BaseNodeData;

export interface Automation {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeLabel: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  error?: string;
}