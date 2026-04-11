import api from "@/lib/axios/api";

export const getCompanies = async (params: {
  search?: string;
  isApproved?: boolean;
  isBlocked?: boolean;
  page?: number;
  limit?: number;
}) => {
  const res = await api.get("/admin/companies", { params });
  return res.data;
};
export const getCompanyById = async (companyId: string) => {
  const res = await api.get(`/admin/companies/${companyId}`);
  return res.data;
};
export const approveCompany = async (companyId: string) => {
  return await api.patch(`/admin/companies/approve/${companyId}`);
};

export const blockCompany = async (companyId: string) => {
  return await api.patch(`/admin/companies/block/${companyId}`);
};

export const unblockCompany = async (companyId: string) => {
  return await api.patch(`/admin/companies/unblock/${companyId}`);
};