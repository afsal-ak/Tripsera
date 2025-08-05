 
import { useEffect, useState } from "react";
import { ReferralForm } from "./ReferralForm";
import {
  getReferral,
  createReferral,
} from "@/features/services/admin/referralService";
import type { IReferral } from "@/features/types/IReferral";
import { toast } from "sonner";

 const ReferralPage = () => {
  const [referral, setReferral] = useState<IReferral | null>(null);

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const res = await getReferral();
        setReferral(res.referral);
        console.log(res,'referral')
      } catch (error) {
        console.error("Failed to fetch referral", error);
      }
    };
    fetchReferral();
  }, []);

  const handleSave = async (data: { amount: number; isBlocked: boolean }) => {
    try {
      const res = await createReferral(data); 
      setReferral(res);
      toast.success("Referral settings saved");
              console.log(res,'referral')

              setReferral(res);

    } catch (err) {
      console.error(err);
      toast.error("Failed to save referral settings");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Referral Settings</h2>
      <ReferralForm defaultValues={{
    amount: referral?.amount ?? 0,
    isBlocked: referral?.isBlocked ?? false,
  }}onSubmit={handleSave} />
          {referral && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Current Referral Info</h3>
          <table className="w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Amount (₹)</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border text-center">{referral.amount}</td>
                <td className="p-2 border text-center">
                  {referral.isBlocked ? "Blocked" : "Active"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


export default ReferralPage