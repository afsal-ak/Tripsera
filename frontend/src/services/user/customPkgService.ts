import api from "@/lib/axios/api";
import type { CustomPkgFormSchema,EditCustomPkgFormSchema } from "@/schemas/customPkgSchema";

export const getAllCustomPkg=async(page:number,limit:number)=>{
    const response=await api.get(`/user/custom-package?page=${page}&limit=${limit}`)
     return response.data
}
export const getCustomPkgById=async(packageId:string)=>{
    const response=await api.get(`/user/custom-package/${packageId}`)
    return response.data
}

export const createCustomPkg=async(data:CustomPkgFormSchema)=>{
    const response=await api.post(`/user/custom-package/create`,data)
    return response.data
}


export const updateCustomPkg=async(packageId:string,data: Partial<EditCustomPkgFormSchema>)=>{
    const response=await api.put(`/user/custom-package/${packageId}/edit`,data)
     return response.data
}

export const deleteCustomPkg=async(packageId:string)=>{
    const response=await api.delete(`/user/custom-package/${packageId}/delete`)
     return response.data
}



// export const CUSTOM_PACKAGE_ROUTE = {
//   CREATE: '/custom-package/create',
//   UPDATE: '/custom-package/:packageId/edit',
//   GET_BY_ID: '/custom-package/:packageId',
//   GET_ALL_PKG: '/custom-package',
//   DELETE: '/custom-package/:packageId/delete',
// };
