import { useState, useEffect, useRef } from "react";
import { useWorkflowStore } from "../../store/workflowStore";

interface ImportDialogProps {
    open: boolean;
    onClose: () => void;
}
const PLACEHOLDER = `{
"nodes": [
{ "id": "start-1", "type": "startNode", "position": { "x": 100, "y": 100 }, "data": { "type": "start", "label": "Start" } }
],
"edges": [
{ "id": "e1", "source": "start-1", "target": "end-1", "animated": true }
]
}`;

export function ImportDialog({ open, onClose }: ImportDialogProps) {
    const { setNodes, setEdges } = useWorkflowStore();
    const [importJson, setImportJson] = useState("");
    const [error, setError] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (open) {
            setImportJson("");
            setError("");
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }, [open]);

    const handleImport = () => {
        setError("");
        try {
            const parsed = JSON.parse(importJson);

            if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
                setError("Invalid: missing nodes array");
                return;
            }
            if (!parsed.edges || !Array.isArray(parsed.edges)) {
                setError("Invalid: missing edges array");
                return;
            }

            setNodes(parsed.nodes);
            setEdges(parsed.edges);
            setImportJson("");
            onClose();
        } catch (e) {
            setError("Invalid JSON format");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleImport();
        }
        if (e.key === "Escape") {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Import Workflow</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Paste workflow JSON (Ctrl+Enter to import)
                    </p>
                    <textarea
                        ref={textareaRef}
                        value={importJson}
                        onChange={(e) => setImportJson(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={PLACEHOLDER}
                        className="w-full h-64 p-3 border rounded-lg font-mono text-xs resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {error && (
                        <div className="mt-2 text-sm text-red-500">{error}</div>
                    )}
                </div>

                <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!importJson.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        Import
                    </button>
                </div>
            </div>
        </div>
    );
}
