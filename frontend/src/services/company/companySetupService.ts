import api from "@/lib/axios/api";

export const getCompanySetupData = async () => {
  const res = await api.get("/company/setup-data");
  return res.data.data;
};

export const setupCompany = async (formData: FormData) => {
  const res = await api.post("/company/setup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};