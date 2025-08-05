import adminApi from "@/lib/axios/adminAxios";
import type { IReferral } from "@/features/types/IReferral";


export const getReferral = async () => {
  const res = await adminApi.get("/referral");
  return res.data;
};

export const createReferral = async (data: Partial<IReferral>): Promise<IReferral> => {
  const res = await adminApi.post("/referral/add", data);
  return res.data.referral;
};

export const updateReferral = async (id: string, data: Partial<IReferral>): Promise<IReferral> => {
  const res = await adminApi.put(`/referral/${id}`, data);
  return res.data;
};
