import { useState, useEffect } from 'react';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function TaskNodeForm({ data, onChange }: Props) {
  const [title, setTitle] = useState(String(data.title || ''));
  const [description, setDescription] = useState(String(data.description || ''));
  const [assignee, setAssignee] = useState(String(data.assignee || ''));
  const [dueDate, setDueDate] = useState(String(data.dueDate || ''));
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');

  useEffect(() => {
    setTitle(String(data.title));
    setDescription(String(data.description));
    setAssignee(String(data.assignee));
    setDueDate(String(data.dueDate));
  }, [data]);

  const handleAddMeta = () => {
    if (metaKey && metaValue) {
      const meta = (data.customFields as Record<string, string>) || {};
      onChange({
        customFields: { ...meta, [metaKey]: metaValue },
      });
      setMetaKey('');
      setMetaValue('');
    }
  };

  const handleRemoveMeta = (key: string) => {
    const meta = { ...(data.customFields as Record<string, string>) };
    delete meta[key];
    onChange({ customFields: meta });
  };

  const customObj = data.customFields as Record<string, string> | undefined;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            onChange({ title: e.target.value });
          }}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            onChange({ description: e.target.value });
          }}
          className="w-full px-3 py-2 border rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Assignee</label>
        <input
          type="text"
          value={assignee}
          onChange={(e) => {
            setAssignee(e.target.value);
            onChange({ assignee: e.target.value });
          }}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter assignee name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input
          type="text"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            onChange({ dueDate: e.target.value });
          }}
          className="w-full px-3 py-2 border rounded"
          placeholder="e.g., 3 days, Next Monday"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Custom Fields</label>
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
        {customObj && Object.keys(customObj).length > 0 && (
          <div className="space-y-1">
            {Object.keys(customObj).map((key) => (
              <div key={key} className="flex justify-between items-center text-sm bg-gray-50 px-2 py-1 rounded">
                <span>{key}: {customObj[key]}</span>
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