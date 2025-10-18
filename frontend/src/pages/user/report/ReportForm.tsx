import { useState } from 'react';
import { createReport } from '@/services/user/reportService';
import { toast } from 'sonner';

type Props = {
  id: string;
  status: 'blog' | 'user' | 'review';
  onSuccess: () => void;
};

const ReportForm = ({ status, id, onSuccess }: Props) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [error, setErrors] = useState<{
    reason?: string;
    description?: string;
  }>({});

  const validate = () => {
    const newErrors: { reason?: string; description?: string } = {};

    if (!reason) {
      newErrors.reason = 'Please choose a reason';
    }
    if (description.trim().length < 4) {
      newErrors.description = 'Description should be at least 4 characters long.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !validate()) {
      return;
    }
    setLoading(true);

    try {
      const report = {
        reason,
        description,
        reportedType: status,
      };
      const response = await createReport(id, report);
      console.log(response, 'report');
      onSuccess();
      toast.success(response?.message || 'Report submitted successfully');
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-xl font-semibold">Report</h2>

      {/* Reason */}
      <div>
        <label className="block font-medium mb-2">Reason</label>
        <select
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (e.target.value !== '') {
              setErrors((prev) => ({ ...prev, reason: undefined }));
            }
          }}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">-- Select Reason --</option>
          <option value="spam">Spam</option>
          <option value="harassment">Harassment</option>
          <option value="misinformation">Misinformation</option>
          <option value="inappropriate">Inappropriate Content</option>
          <option value="other">Other</option>
        </select>
        {error.reason && <p className="text-red-500 text-sm">{error.reason}</p>}
      </div>

      <div>
        <label className="block font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (e.target.value.trim().length >= 4) {
              setErrors((prev) => ({ ...prev, description: undefined }));
            }
          }}
          className="w-full border border-gray-300 rounded-md p-2"
          rows={4}
          placeholder="Please describe the issue"
        />
        {error.description && <p className="text-red-500 text-sm">{error.description}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium"
      >
        {loading ? 'Submitting' : 'Sumbit'}
      </button>
    </form>
  );
};

export default ReportForm;
