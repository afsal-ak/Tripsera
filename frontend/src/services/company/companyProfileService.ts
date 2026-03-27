 import api from "@/lib/axios/api"
export const getCompanyProfile = async () => {

  const res = await api.get("/company/company-profile")
  return res.data.data

}

export const updateCompany = async (data: any) => {

  const res = await api.put("/company/update", data)
  return res.data.data

}

export const updateCompanyLogo = async (formData: FormData) => {

  const res = await api.put("/company/logo", formData)
  return res.data.data

}