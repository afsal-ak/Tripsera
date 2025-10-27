import { useEffect, useState } from 'react';
import { ReferralForm } from './ReferralForm';
import { getReferral, createReferral } from '@/services/admin/referralService';
import type { IReferral } from '@/types/IReferral';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';

const ReferralPage = () => {
  const [referral, setReferral] = useState<IReferral | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const res = await getReferral();
        setReferral(res.referral);
      } catch (error) {
        console.error('Failed to fetch referral', error);
        toast.error('Failed to fetch referral settings');
      } finally {
        setLoading(false);
      }
    };
    fetchReferral();
  }, []);

  const handleSave = async (data: { amount: number; isBlocked: boolean }) => {
    try {
      setSaving(true);
      const res = await createReferral(data);
      setReferral(res);
      toast.success('Referral settings saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save referral settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="shadow-md border border-gray-100">
        <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
          <CardTitle className="text-2xl font-semibold text-orange-600">
            Referral Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <ReferralForm
            defaultValues={{
              amount: referral?.amount ?? 0,
              isBlocked: referral?.isBlocked ?? false,
            }}
            onSubmit={handleSave}
           />

          {referral && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Current Referral Information
              </h3>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm text-gray-700">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="p-3 text-left border-r">Amount (₹)</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 border-r">{referral.amount}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            referral.isBlocked
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {referral.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralPage;
