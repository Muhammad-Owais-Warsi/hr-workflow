import { useState, useEffect } from "react";

interface Props {
    data: Record<string, unknown>;
    onChange: (data: Record<string, unknown>) => void;
}

export function StartNodeForm({ data, onChange }: Props) {
    const [label, setLabel] = useState(String(data.label || "Start"));
    const [metaKey, setMetaKey] = useState("");
    const [metaValue, setMetaValue] = useState("");

    useEffect(() => {
        const handleLabel = () => {
            setLabel(String(data.label));
        };

        handleLabel();
    }, [data.label]);

    const handleAddMeta = () => {
        if (metaKey && metaValue) {
            const meta = (data.metadata as Record<string, string>) || {};
            onChange({
                label,
                metadata: { ...meta, [metaKey]: metaValue },
            });
            setMetaKey("");
            setMetaValue("");
        }
    };

    const handleRemoveMeta = (key: string) => {
        const meta = { ...(data.metadata as Record<string, string>) };
        delete meta[key];
        onChange({ metadata: meta });
    };

    const metaObj = data.metadata as Record<string, string> | undefined;

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">
                    Start Title
                </label>
                <input
                    type="text"
                    value={label}
                    onChange={(e) => {
                        setLabel(e.target.value);
                        onChange({ label: e.target.value });
                    }}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Metadata (optional)
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Key"
                        value={metaKey}
                        onChange={(e) => setMetaKey(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Value"
                        value={metaValue}
                        onChange={(e) => setMetaValue(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded"
                    />
                    <button
                        type="button"
                        onClick={handleAddMeta}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Add
                    </button>
                </div>
                {metaObj && Object.keys(metaObj).length > 0 && (
                    <div className="space-y-1">
                        {Object.keys(metaObj).map((key) => (
                            <div
                                key={key}
                                className="flex justify-between items-center text-sm bg-gray-50 px-2 py-1 rounded"
                            >
                                <span>
                                    {key}: {metaObj[key]}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveMeta(key)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
