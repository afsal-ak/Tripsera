import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/Button';
import { createCoupon } from '@/services/admin/couponService';
import {type  CouponFormSchema, couponSchema } from '@/schemas/CouponFormSchema';
import { z } from 'zod';

// Add a properly typed Label component
interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium mb-1 block">
    {children}
  </label>
);

const AddCouponForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      type: 'percentage',
      discountValue: 0,
      expiryDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: z.infer<typeof couponSchema>) => {
    try {
      await createCoupon(data);
      toast.success('Coupon created successfully');
      navigate('/admin/coupons');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create coupon');
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto space-y-5 p-6 bg-white shadow rounded"
    >
      <h2 className="text-2xl font-semibold">Add Coupon</h2>

      <div>
        <Label htmlFor="code">Code</Label>
        <Input    {...register('code')} />
        
        {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <select {...register('type')} className="w-full border rounded px-3 py-2">
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>
      </div>

      <div>
        <Label htmlFor="discountValue">Discount Value</Label>
        <Input type="number" {...register('discountValue', { valueAsNumber: true })} />
        {errors.discountValue && (
          <p className="text-red-500 text-sm">{errors.discountValue.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input type="date" {...register('expiryDate')} />
        {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>}
      </div>

      <div>
        <Label htmlFor="minAmount">Minimum Amount</Label>
        <Input type="number" {...register('minAmount', { valueAsNumber: true })} />
        {errors.minAmount && <p className="text-red-500 text-sm">{errors.minAmount.message}</p>}
      </div>

      <div>
        <Label htmlFor="maxDiscountAmount">Max Discount Amount</Label>
        <Input type="number" {...register('maxDiscountAmount', { valueAsNumber: true })} />
        {errors.maxDiscountAmount && (
          <p className="text-red-500 text-sm">{errors.maxDiscountAmount.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit">Submit</Button>
        <Button type="button" variant="outline" onClick={() => navigate('/admin/coupons')}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddCouponForm;
