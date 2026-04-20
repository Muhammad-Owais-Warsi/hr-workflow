import { useState, useEffect } from 'react';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function EndNodeForm({ data, onChange }: Props) {
  const [endMessage, setEndMessage] = useState(String(data.endMessage || ''));
  const [summaryFlag, setSummaryFlag] = useState(Boolean(data.summaryFlag));

  useEffect(() => {
    setEndMessage(String(data.endMessage));
    setSummaryFlag(Boolean(data.summaryFlag));
  }, [data]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">End Message</label>
        <input
          type="text"
          value={endMessage}
          onChange={(e) => {
            setEndMessage(e.target.value);
            onChange({ endMessage: e.target.value });
          }}
          className="w-full px-3 py-2 border rounded"
          placeholder="Workflow completed successfully"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={summaryFlag}
            onChange={(e) => {
              setSummaryFlag(e.target.checked);
              onChange({ summaryFlag: e.target.checked });
            }}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Generate Summary</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Include a summary when workflow completes
        </p>
      </div>
    </div>
  );
}