import adminApi from "@/lib/axios/adminAxios";
//  export const fetchCategoriesData=async()=>{
//     try {
//         const response=await adminApi.get('/categories');
//         return response.data
//     } catch (error:any) {
//     console.error("Failed to fetch categories", error);
//     }
// }
export const fetchCategoriesData = async (page:number, limit:number) => {
  const response = await adminApi.get(`/categories?page=${page}&limit=${limit}`);
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await adminApi.get(`/category/${id}`);
  return response.data;
};

export const createCategory = async (data: { name: string; isBlocked: boolean }) => {
  const response = await adminApi.post("/addCategory", data);
  return response.data;
};

export const updateCategory = async (id: string, data: { name: string; isBlocked: boolean }) => {
  const response = await adminApi.put(`/category/${id}`, data);
  return response.data;
};

export const blockCategory=async(id:string)=>{
    try {
        const response=await adminApi.patch(`/category/${id}/block`)
        
        return response.data

    } catch (error) {
     console.error("Failed to block category", error);

    }
}
export const unBlockCategory=async(id:string)=>{
    try {
        const response=await adminApi.patch(`/category/${id}/unblock`)
        
        return response.data

    } catch (error) {
     console.error("Failed to unblock category", error);

    }
}
