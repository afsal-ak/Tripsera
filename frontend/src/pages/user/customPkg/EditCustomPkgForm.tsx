import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/Button";
import {
  customPkgEditSchema,
  type EditCustomPkgFormSchema,
} from "@/schemas/customPkgSchema";
import {
  getCustomPkgById,
  updateCustomPkg,
} from "@/services/user/customPkgService";
import { useEffect, useState } from "react";

const EditCustomPkgForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditCustomPkgFormSchema>({
    resolver: zodResolver(customPkgEditSchema),
    mode: "onBlur",
  });

  // Fetch package data & prefill form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCustomPkgById(id!);
        const pkg=response.data
console.log(pkg,'pkg')
        if (pkg) {
          // Prefill top-level fields
          setValue("destination", pkg.destination || "");
          setValue("tripType", pkg.tripType || "");
          setValue("budget", pkg.budget || 0);
          setValue("startDate", pkg.startDate?.split("T")[0] || "");
           setValue("days", pkg.days || 0);
          setValue("nights", pkg.nights || 0);
          setValue("additionalDetails", pkg.additionalDetails || "");

          // Prefill nested guest info safely
          setValue("guestInfo.name", pkg.guestInfo?.name || "");
          setValue("guestInfo.email", pkg.guestInfo?.email || "");
          setValue("guestInfo.phone", pkg.guestInfo?.phone || "");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load package");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data: EditCustomPkgFormSchema) => {
    try {
      await updateCustomPkg(id!, data);
      toast.success("Package updated successfully!");
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update package");
    }
  };

  if (loading) {
    return <p className="text-center">Loading package...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white shadow-lg rounded-xl p-6 max-w-2xl mx-auto"
    >
  <div>
        <Label>Guest Info</Label>
        <div className="space-y-3">
          <Input {...register("guestInfo.name")} placeholder="Guest Name" />
          <Input {...register("guestInfo.email")} placeholder="Guest Email" />
          <Input {...register("guestInfo.phone")} placeholder="Guest Phone" />
          {(errors.guestInfo?.name || errors.guestInfo?.email || errors.guestInfo?.phone) && (
            <p className="text-red-500 text-sm">
              {errors.guestInfo?.name?.message ||
                errors.guestInfo?.email?.message ||
                errors.guestInfo?.phone?.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          {...register("destination")}
          placeholder="Enter destination"
        />
        {errors.destination && (
          <p className="text-red-500 text-sm">{errors.destination.message}</p>
        )}
      </div>

      {/* Trip Type */}
      <div>
        <Label htmlFor="tripType">Trip Type</Label>
        <select
          {...register("tripType")}
          className="w-full border p-2 rounded"
          id="tripType"
        >
          <option value="">Select Trip Type</option>
          <option value="romantic">Romantic</option>
          <option value="adventure">Adventure</option>
          <option value="family">Family</option>
          <option value="luxury">Luxury</option>
          <option value="budget">Budget</option>
          <option value="other">Other</option>
        </select>
        {errors.tripType && (
          <p className="text-red-500 text-sm">{errors.tripType.message}</p>
        )}
      </div>

      {/* Budget */}
      <div>
        <Label htmlFor="budget">Budget</Label>
        <Input
          id="budget"
          type="number"
          {...register("budget", { valueAsNumber: true })}
          placeholder="Enter budget"
        />
        {errors.budget && (
          <p className="text-red-500 text-sm">{errors.budget.message}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>
        
      </div>

      {/* Days and Nights */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="days">Days</Label>
          <Input
            id="days"
            type="number"
            {...register("days", { valueAsNumber: true })}
          />
          {errors.days && (
            <p className="text-red-500 text-sm">{errors.days.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="nights">Nights</Label>
          <Input
            id="nights"
            type="number"
            {...register("nights", { valueAsNumber: true })}
          />
          {errors.nights && (
            <p className="text-red-500 text-sm">{errors.nights.message}</p>
          )}
        </div>
      </div>

     
      {/* Additional Details */}
      <div>
        <Label htmlFor="additionalDetails">Additional Details</Label>
        <textarea
          id="additionalDetails"
          {...register("additionalDetails")}
          className="w-full border p-2 rounded"
          placeholder="Enter any additional details..."
        />
        {errors.additionalDetails && (
          <p className="text-red-500 text-sm">
            {errors.additionalDetails.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Update Package
      </Button>
    </form>
  );
};

export default EditCustomPkgForm;
