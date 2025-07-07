// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { useParams,useNavigate } from "react-router-dom";

// import { Input } from "@/features/components/ui/Input";
// import { Label } from "@/features/components/ui/Lable";
// import { Button } from "@/features/components/Button";
// import { getCouponById, editCoupon } from "@/features/services/admin/couponService";
// import { useEffect } from "react";

// const couponSchema = z.object({
//   code: z.string().min(3, "Code must be at least 3 characters"),
//   type: z.enum(["percentage", "flat"]),
//   discountValue: z.number({
//     required_error: "Discount value is required",
//     invalid_type_error: "Discount must be a number",
//   }).min(1, "Discount must be at least 1"),

//   expiryDate: z.string().refine(
//     (date) => new Date(date) > new Date(),
//     "Expiry must be in the future"
//   ),

//   minAmount: z
//     .number({
//       invalid_type_error: "Minimum amount must be a number",
//     })
//     .optional(),

//   maxDiscountAmount: z
//     .number({
//       invalid_type_error: "Max discount must be a number",
//     })
//     .optional(),

//  });

// export type CouponFormSchema = z.infer<typeof couponSchema>;


// const EditCouponForm = () => {
//    const { id } = useParams();
//   const navigate = useNavigate();


//   useEffect(()=>{

//   },[])


//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CouponFormSchema>({
//     resolver: zodResolver(couponSchema),
//     defaultValues: {
//       code: "",
//       type: "percentage",
//       discountValue: 0,
//       expiryDate: new Date().toISOString(),
//      },
//   });

//   const onSubmit = async (data: CouponFormSchema) => {
//     try {
//       await editCoupon(id!,data);
//       toast.success("Coupon created successfully");
//       navigate("/admin/coupons");
//     } catch (error) {
//       toast.error("Failed to create coupon");
//       console.error(error);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="max-w-xl mx-auto space-y-5 p-6 bg-white shadow rounded"
//     >
//       <h2 className="text-2xl font-semibold">Edit Coupon</h2>

//       <div>
//         <Label htmlFor="code">Code</Label>
//         <Input {...register("code")} />
//         {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
//       </div>

//       <div>
//         <Label htmlFor="type">Type</Label>
//         <select {...register("type")} className="w-full border rounded px-3 py-2">
//           <option value="percentage">Percentage</option>
//           <option value="flat">Flat</option>
//         </select>
//       </div>

//       <div>
//         <Label htmlFor="discountValue">Discount Value</Label>
//         <Input type="number" {...register("discountValue", { valueAsNumber: true })} />
//         {errors.discountValue && (
//           <p className="text-red-500 text-sm">{errors.discountValue.message}</p>
//         )}
//       </div>

//       <div>
//         <Label htmlFor="expiryDate">Expiry Date</Label>
//         <Input type="date" {...register("expiryDate")} />
//         {errors.expiryDate && (
//           <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>
//         )}
//       </div>

//       {/* Min Amount */}
//       <div>
//         <Label htmlFor="minAmount">Minimum Amount (Optional)</Label>
//         <Input type="number" {...register("minAmount", { valueAsNumber: true })} />
//         {errors.minAmount && (
//           <p className="text-red-500 text-sm">{errors.minAmount.message}</p>
//         )}
//       </div>

//       {/* Max Discount Amount */}
//       <div>
//         <Label htmlFor="maxDiscountAmount">Max Discount Amount (Optional)</Label>
//         <Input type="number" {...register("maxDiscountAmount", { valueAsNumber: true })} />
//         {errors.maxDiscountAmount && (
//           <p className="text-red-500 text-sm">{errors.maxDiscountAmount.message}</p>
//         )}
//       </div>

//       {/* Submit */}
//       <div className="flex gap-4">
//         <Button type="submit">Submit</Button>
//         <Button type="button" variant="outline" onClick={() => navigate("/admin/coupon")}>
//           Cancel
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default EditCouponForm;
import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

import { Input } from "@/features/components/ui/Input";
import { Label } from "@/features/components/ui/Lable";
import { Button } from "@/features/components/Button";
import { getCouponById, editCoupon } from "@/features/services/admin/couponService";
import { useEffect } from "react";

import  { type CouponFormSchema,couponSchema } from "@/features/schemas/CouponFormSchema";

const EditCouponForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormSchema>({
    resolver: zodResolver(couponSchema),
  });

 
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        if (!id) return;
        const {coupon} = await getCouponById(id);
        console.log(coupon,'coupon')
        reset({
          code: coupon.code,
          type: coupon.type,
          discountValue: coupon.discountValue,
          expiryDate: coupon.expiryDate.split("T")[0],  
          minAmount: coupon.minAmount,
          maxDiscountAmount: coupon.maxDiscountAmount,
        });
      } catch (error) {
        toast.error("Failed to fetch coupon data");
        console.error(error);
      }
    };

    fetchCoupon();
  }, [id, reset]);

  const onSubmit = async (data: CouponFormSchema) => {
    try {
      if (!id){
         return
      } 
      await editCoupon(id, data);
      toast.success("Coupon updated successfully");
      navigate("/admin/coupons");
    } catch (error:any) {
      toast.error(error?.response?.data?.message ||"Failed to update coupon");
      //console.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto space-y-5 p-6 bg-white shadow rounded"
    >
      <h2 className="text-2xl font-semibold">Edit Coupon</h2>

      {/* Code */}
      <div>
        <Label htmlFor="code">Code</Label>
        <Input {...register("code")} />
        {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
      </div>

      {/* Type */}
      <div>
        <Label htmlFor="type">Type</Label>
        <select {...register("type")} className="w-full border rounded px-3 py-2">
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>
      </div>

      {/* Discount */}
      <div>
        <Label htmlFor="discountValue">Discount Value</Label>
        <Input type="number" {...register("discountValue", { valueAsNumber: true })} />
        {errors.discountValue && <p className="text-red-500 text-sm">{errors.discountValue.message}</p>}
      </div>

      {/* Expiry Date */}
      <div>
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input type="date" {...register("expiryDate")} />
        {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>}
      </div>

       <div>
        <Label htmlFor="minAmount">Min Amount </Label>
        <Input type="number" {...register("minAmount", { valueAsNumber: true })} />
         {errors.minAmount && <p className="text-red-500 text-sm">{errors.minAmount.message}</p>}

      </div>

       <div>
        <Label htmlFor="maxDiscountAmount">Max Discount </Label>
        <Input type="number" {...register("maxDiscountAmount", { valueAsNumber: true })} />
       {errors.maxDiscountAmount && <p className="text-red-500 text-sm">{errors.maxDiscountAmount.message}</p>}

      </div>

       <div className="flex gap-4">
        <Button type="submit">Update</Button>
        <Button type="button" variant="outline" onClick={() => navigate("/admin/coupons")}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditCouponForm;
