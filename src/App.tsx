import { useCallback, useRef, useState } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
} from "@xyflow/react";
import type {
    Node,
    OnNodesChange,
    OnEdgesChange,
    Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "./components/nodes";
import { NodeSidebar } from "./components/canvas/NodeSidebar";
import { NodeFormPanel } from "./components/forms/NodeFormPanel";
import { SandboxPanel } from "./components/sandbox/SandboxPanel";
import { ImportDialog } from "./components/canvas/ImportDialog";
import { useWorkflowStore } from "./store/workflowStore";
import { downloadWorkflow } from "./api/workflowApi";
import type { NodeType } from "./types";

type Tab = "edit" | "test";

function App() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<Tab>("edit");
    const [showImport, setShowImport] = useState(false);

    const {
        nodes,
        edges,
        selectedNode,
        addNode,
        selectNode,
        setNodes,
        setEdges,
        setReactFlowInstance,
        clearCanvas,
    } = useWorkflowStore();

    const onNodesChange: OnNodesChange<Node> = useCallback(
        (changes) => setNodes(applyNodeChanges(changes, nodes)),
        [nodes, setNodes],
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges(applyEdgeChanges(changes, edges)),
        [edges, setEdges],
    );

    const onConnect = useCallback(
        (connection: Connection) =>
            setEdges(addEdge({ ...connection, animated: true }, edges)),
        [edges, setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData("application/reactflow");
            if (!type) return;

            const reactFlow = useWorkflowStore.getState().reactFlowInstance;
            if (!reactFlow || !reactFlowWrapper.current) return;

            const reactFlowBounds =
                reactFlowWrapper.current.getBoundingClientRect();
            const position = reactFlow.screenToFlowPosition({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            addNode(type as NodeType, position);
        },
        [addNode],
    );

    const onNodeClick = useCallback(
        (_: any, node: Node) => {
            selectNode(node);
        },
        [selectNode],
    );

    const onPaneClick = useCallback(() => {
        selectNode(null);
    }, [selectNode]);

    return (
        <div className="h-screen flex flex-col" style={{ cursor: "default" }}>
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-800">
                    HR Workflow Designer
                </h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => downloadWorkflow(nodes, edges)}
                        disabled={nodes.length === 0}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Export
                    </button>
                    <button
                        onClick={() => setShowImport(true)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border rounded hover:bg-gray-50"
                    >
                        Import
                    </button>
                    <button
                        onClick={clearCanvas}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Clear
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <NodeSidebar />

                <div className="flex-1 relative" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        onInit={setReactFlowInstance}
                        fitView
                    >
                        <Background
                            variant={BackgroundVariant.Dots}
                            gap={12}
                            size={1}
                        />
                        <Controls />
                        <MiniMap
                            nodeColor={(n: any) => {
                                const t = n.data?.type;
                                if (t === "start") return "#22c55e";
                                if (t === "end") return "#ef4444";
                                if (t === "task") return "#3b82f6";
                                if (t === "approval") return "#eab308";
                                return "#a855f7";
                            }}
                        />
                    </ReactFlow>
                </div>

                <div className="w-80 border-l flex flex-col bg-white">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab("edit")}
                            className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === "edit" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setActiveTab("test")}
                            className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === "test" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                        >
                            Test
                        </button>
                    </div>

                    {activeTab === "edit" ? (
                        selectedNode ? (
                            <NodeFormPanel node={selectedNode} />
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm p-4 text-center">
                                Select a node to edit its configuration
                            </div>
                        )
                    ) : (
                        <SandboxPanel />
                    )}
                </div>
            </div>

            <ImportDialog open={showImport} onClose={() => setShowImport(false)} />
        </div>
    );
}

export default App;