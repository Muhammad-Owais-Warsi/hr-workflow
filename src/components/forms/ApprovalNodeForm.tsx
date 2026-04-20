import { useState, useEffect } from 'react';

interface Props {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'Team Lead', 'CEO'];

export function ApprovalNodeForm({ data, onChange }: Props) {
  const [title, setTitle] = useState(String(data.title || ''));
  const [approverRole, setApproverRole] = useState(String(data.approverRole || ''));
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(Number(data.autoApproveThreshold) || 0);

  useEffect(() => {
    setTitle(String(data.title));
    setApproverRole(String(data.approverRole));
    setAutoApproveThreshold(Number(data.autoApproveThreshold));
  }, [data]);

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
        <label className="block text-sm font-medium mb-1">Approver Role</label>
        <select
          value={approverRole}
          onChange={(e) => {
            setApproverRole(e.target.value);
            onChange({ approverRole: e.target.value });
          }}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select role...</option>
          {APPROVER_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Auto-approve Threshold</label>
        <input
          type="number"
          value={autoApproveThreshold}
          onChange={(e) => {
            setAutoApproveThreshold(Number(e.target.value));
            onChange({ autoApproveThreshold: Number(e.target.value) });
          }}
          className="w-full px-3 py-2 border rounded"
          min={0}
          placeholder="Amount for auto-approval"
        />
        <p className="text-xs text-gray-500 mt-1">
          Auto-approve if amount is below this threshold
        </p>
      </div>
    </div>
  );
}