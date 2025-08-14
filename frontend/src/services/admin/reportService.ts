import adminApi from "@/lib/axios/adminAxios";
import type { IFilter } from "@/types/IFilter";

export const handleListReport=async(
    page:number,
    limit:number,
    filter:IFilter
)=>{
    const params={
        page,
        limit,
        ...filter
    }
    const response=await adminApi.get('reports',{params})
      return response.data;

}


export const handleFetchReport=async(id:string)=>{
    const response=await adminApi.get(`reports/${id}`)
    console.log(response.data,'service')
      return response.data;
}

export const handleFetchReportItem=async(reportedId:string,type:string)=>{
    const response=await adminApi.get(`reports/type/${reportedId}/${type}`)
      return response.data;
}

export const handleChangeStatusReport=async(id:string,status:string)=>{
    const response=await adminApi.patch(`reports/${id}/update`,{status})
      return response.data;
}


 