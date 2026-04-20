import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import type { NodeType } from "../types";

interface WorkflowState {
    nodes: Node[];
    edges: Edge[];
    selectedNode: Node | null;
    reactFlowInstance: any;

    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;

    addNode: (type: NodeType, position?: { x: number; y: number }) => void;
    deleteNode: (nodeId: string) => void;
    selectNode: (node: Node | null) => void;
    updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
    setReactFlowInstance: (instance: any) => void;
    clearCanvas: () => void;
}

const nodeData: Record<string, Record<string, unknown>> = {
    start: { type: "start", label: "Start", metadata: {} },
    task: {
        type: "task",
        label: "Task",
        title: "New Task",
        description: "",
        assignee: "",
        dueDate: "",
        customFields: {},
    },
    approval: {
        type: "approval",
        label: "Approval",
        title: "Approval Required",
        approverRole: "",
        autoApproveThreshold: 0,
    },
    automated: {
        type: "automated",
        label: "Automated",
        title: "Automated Action",
        actionId: "",
        actionParams: {},
    },
    end: {
        type: "end",
        label: "End",
        endMessage: "Workflow Complete",
        summaryFlag: false,
    },
};

const initialNodes = [
    {
        id: "start-1",
        type: "startNode",
        position: { x: 250, y: 50 },
        data: { type: "start", label: "Start", metadata: {} },
    },
];

export const useWorkflowStore = create<WorkflowState>((set) => ({
    nodes: initialNodes as Node[],
    edges: [],
    selectedNode: null,
    reactFlowInstance: null,

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    addNode: (type, position) => {
        const data = { ...nodeData[type] };
        const pos = position || {
            x: 100 + Math.random() * 200,
            y: 100 + Math.random() * 200,
        };
        const newNode: Node = {
            id: `${type}-${Date.now()}`,
            type: `${type}Node`,
            position: pos,
            data,
        };
        set((state) => ({ nodes: [...state.nodes, newNode] }));
    },

    deleteNode: (nodeId) => {
        set((state) => ({
            nodes: state.nodes.filter((n) => n.id !== nodeId),
            edges: state.edges.filter(
                (e) => e.source !== nodeId && e.target !== nodeId,
            ),
            selectedNode:
                state.selectedNode?.id === nodeId ? null : state.selectedNode,
        }));
    },

    selectNode: (node) => set({ selectedNode: node }),

    updateNodeData: (nodeId, data) => {
        set((state) => ({
            nodes: state.nodes.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n,
            ),
            selectedNode:
                state.selectedNode?.id === nodeId
                    ? {
                          ...state.selectedNode,
                          data: { ...state.selectedNode.data, ...data },
                      }
                    : state.selectedNode,
        }));
    },

    setReactFlowInstance: (instance) => set({ reactFlowInstance: instance }),

    clearCanvas: () =>
        set({
            nodes: initialNodes as Node[],
            edges: [],
            selectedNode: null,
        }),
}));
