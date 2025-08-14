import userApi from "@/lib/axios/userAxios";
import type { ICreateReport } from "@/types/IReport";

export const createReport=async(id:string,report:ICreateReport)=>{
    const response=await userApi.post(`/report/${id}`,report)
    return response.data
}

