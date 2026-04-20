import { useState, useEffect, useRef } from "react";
import { useWorkflowStore } from "../../store/workflowStore";
import { simulateWorkflow } from "../../api/workflowApi";
import type { SimulationResult } from "../../types";

interface LogEntry {
    id: number;
    time: string;
    message: string;
    type: "info" | "success" | "error" | "node" | "action";
}

let logId = 0;

export function SandboxPanel() {
    const nodes = useWorkflowStore((state) => state.nodes);
    const edges = useWorkflowStore((state) => state.edges);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [running, setRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(-1);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const addLog = (message: string, type: LogEntry["type"] = "info") => {
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        setLogs((prev) => [...prev, { id: logId++, time, message, type }]);
    };

    const handleRun = async () => {
        if (nodes.length === 0) return;

        setRunning(true);
        setResult(null);
        setCurrentStep(-1);
        setLogs([]);

        addLog("Starting workflow execution...", "info");
        addLog(
            `${nodes.length} nodes, ${edges.length} connections loaded`,
            "info",
        );
        addLog("", "info");

        try {
            const workflowResult = await simulateWorkflow(nodes, edges);

            if (!workflowResult.success) {
                addLog(workflowResult.error || "Validation failed", "error");
                setResult(workflowResult);
                setRunning(false);
                return;
            }

            addLog("Validation passed", "success");
            addLog("", "info");

            for (let i = 0; i < workflowResult.steps.length; i++) {
                setCurrentStep(i);
                const step = workflowResult.steps[i];

                addLog(`→ ${step.nodeLabel}`, "node");

                await new Promise((resolve) => setTimeout(resolve, 600));

                addLog(`  ${step.message}`, "action");

                await new Promise((resolve) => setTimeout(resolve, 400));
                addLog("", "info");
            }

            addLog("Workflow completed successfully", "success");
            setResult(workflowResult);
        } catch (error) {
            addLog(`Execution failed: ${error}`, "error");
            setResult({
                success: false,
                steps: [],
                error: "Workflow execution failed",
            });
        }

        setRunning(false);
        setCurrentStep(-1);
    };

    const getTypeColor = (type: LogEntry["type"]) => {
        switch (type) {
            case "error":
                return "text-red-500";
            case "success":
                return "text-green-500";
            case "node":
                return "text-blue-500 font-medium";
            case "action":
                return "text-gray-300";
            default:
                return "text-gray-400";
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="border-b p-4">
                <h3 className="font-semibold text-gray-800">Test Workflow</h3>
                <p className="text-sm text-gray-500 mt-1">
                    {nodes.length} nodes • {edges.length} connections
                </p>
            </div>

            <div className="p-4 border-b flex gap-2">
                <button
                    onClick={handleRun}
                    disabled={running || nodes.length === 0}
                    className="flex-1 px-3 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {running ? (
                        <>
                            <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Running...
                        </>
                    ) : (
                        <>
                            <span>▶</span> Run Workflow
                        </>
                    )}
                </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Execution Log
                    </span>
                    {running && (
                        <span className="text-xs text-green-600">
                            ● Running
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-3 bg-gray-900 font-mono text-xs space-y-1">
                    {logs.length === 0 ? (
                        <div className="text-gray-500 italic">
                            Click "Run Workflow" to execute
                        </div>
                    ) : (
                        logs
                            .filter((l) => l.message !== "")
                            .map((log) => (
                                <div key={log.id} className="flex gap-3">
                                    <span className="text-gray-600 shrink-0">
                                        {log.time}
                                    </span>
                                    <span className={getTypeColor(log.type)}>
                                        {log.message}
                                    </span>
                                </div>
                            ))
                    )}
                    <div ref={logsEndRef} />
                </div>

                {result && result.success && result.steps.length > 0 && (
                    <div className="border-t bg-gray-50 p-3 max-h-40 overflow-y-auto">
                        <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                            Steps Summary
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {result.steps.map((step, idx) => (
                                <div
                                    key={idx}
                                    className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                                        idx === currentStep
                                            ? "bg-blue-500 text-white"
                                            : idx < currentStep
                                              ? "bg-green-500 text-white"
                                              : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    <span>
                                        {idx < currentStep ? "✓" : idx + 1}
                                    </span>
                                    <span className="max-w-[100px] truncate">
                                        {step.nodeLabel}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
