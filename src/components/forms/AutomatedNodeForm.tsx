import { useState, useEffect } from 'react';
import { getAutomations } from '../../api/workflowApi';
import type { Automation } from '../../types';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function AutomatedNodeForm({ data, onChange }: Props) {
  const [title, setTitle] = useState(String(data.title || ''));
  const [actionId, setActionId] = useState(String(data.actionId || ''));
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAutomations().then((auts) => {
      setAutomations(auts);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setTitle(String(data.title));
    setActionId(String(data.actionId));
  }, [data]);

  const selectedAutomation = automations.find((a) => a.id === actionId);

  const handleActionChange = (newActionId: string) => {
    setActionId(newActionId);
    onChange({
      actionId: newActionId,
      actionParams: {},
    });
  };

  const handleParamChange = (param: string, value: string) => {
    const params = (data.actionParams as Record<string, string>) || {};
    onChange({
      actionParams: { ...params, [param]: value },
    });
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading actions...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            onChange({ title: e.target.value });
          }}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Action</label>
        <select
          value={actionId}
          onChange={(e) => handleActionChange(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select action...</option>
          {automations.map((aut) => (
            <option key={aut.id} value={aut.id}>{aut.label}</option>
          ))}
        </select>
      </div>

      {selectedAutomation && (
        <div>
          <label className="block text-sm font-medium mb-2">Action Parameters</label>
          {selectedAutomation.params.map((param) => (
            <div key={param} className="mb-2">
              <label className="block text-xs text-gray-600 mb-1">{param}</label>
              <input
                type="text"
                value={String((data.actionParams as Record<string, string>)?.[param] || '')}
                onChange={(e) => handleParamChange(param, e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}