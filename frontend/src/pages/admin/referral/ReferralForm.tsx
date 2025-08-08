import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Button";
import { Input } from "@/components/ui/Input";
import { z } from "zod";
import { useEffect } from "react";
const referralSchema = z.object({
  amount: z.number().min(0, "Amount must be at least 0"),
  isBlocked: z.boolean(),
});

type ReferralFormData = z.infer<typeof referralSchema>;

type Props = {
  defaultValues?: ReferralFormData;
  onSubmit: (data: ReferralFormData) => void;
};

export const ReferralForm = ({ defaultValues, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
        reset,

  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues,
  });
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>

      

      <Input
  type="number"
  {...register("amount", { valueAsNumber: true })}
/>
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isBlocked"
          {...register("isBlocked")}
          className="w-4 h-4"
        />
        <label htmlFor="isBlocked" className="text-sm">
          Block Referral?
        </label>
      </div>

      <Button type="submit">Save Settings</Button>
    </form>
  );
};
