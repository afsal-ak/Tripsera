
import { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookingSchema, type BookingFormSchema } from '@/features/schemas/BookingSchema';
import { applyCoupon, createBookingWithWalletPayment,createBookingWithOnlinePayment,verifyRazorpayPayment } from '@/features/services/user/bookingService';
import { fetchPackgeById } from '@/features/services/user/PackageService';
import { getWallet } from '@/features/services/user/walletService';
import { Card, CardContent } from '@/features/components/ui/Card';
import { Input } from '@/features/components/ui/Input';
import { Button } from '@/features/components/Button';
// import { RadioGroup, RadioGroupItem } from '@/features/components/ui/radio-group';
import { RadioGroup,RadioGroupItem } from '@//components/ui/radio-group';
import { Label } from '@/features/components/ui/Lable';
import { Separator } from '@/features/components/ui/separator';
import { CheckCircle, Plane, Plus, Minus, Tag, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { IPackage } from '@/features/types/IPackage';
declare global {
  interface Window {
    Razorpay: any;
  }
}


const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

const [wallet,setWallet]=useState<number>(0)
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');
  const [useWallet, setUseWallet] = useState(false);
  const [walletRemainingAmountToPay, setWalletRemainingAmountToPay] = useState<number>(0);
  const [pkg,setPkg]=useState<IPackage>()

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { balance} = await getWallet(0, 0, "newest");
        setWallet(balance);
      
      } catch (error) {
        console.error("Failed to fetch wallet:", error);
      }
    };

    fetchWallet();
  }, []);

    

 useEffect(()=>{
    const loadPackage=async()=>{
      if(!id){
        return
      }
      try {
        const data=await fetchPackgeById(id)
      //   console.log(checkWishlist.result,'check')
        setPkg(data)
       } catch (error) {
        console.error("Failed to fetch package details", error);

      }
    };
    loadPackage()
   },[id])
   
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BookingFormSchema>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      packageId: id ?? '',
      travelers: [{ fullName: '', age: 0, gender: 'male', id: '' }],
      contactDetails: {
        name: '',
        phone: '',
        alternatePhone: '',
        email: '',
      },
       travelDate: "",
      totalAmount:0,
      couponCode: couponCode,
      paymentMethod: 'wallet',
      useWallet: true,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'travelers' });
  const travelers = watch('travelers');
  const paymentMethod = watch('paymentMethod');
  const total = pkg?.price! * travelers.length;
const walletUsedAmount = useWallet
  ? total - (couponApplied ? couponDiscount : 0) - walletRemainingAmountToPay
  : 0;

const totalAfterDiscount = total - (couponApplied ? couponDiscount : 0) - walletUsedAmount;


useEffect(() => {
  const basePrice = pkg?.price ?? 0;
  const travelerCount = travelers.length;
  const subtotal = basePrice * travelerCount;
  const discount = couponApplied ? couponDiscount : 0;
  
  const walletUsedAmount = useWallet
    ? subtotal - discount - walletRemainingAmountToPay
    : 0;

  const finalAmount = Math.max(subtotal - discount - walletUsedAmount, 0);

  setValue("totalAmount", finalAmount);
}, [
  pkg?.price,
  travelers.length,
  couponApplied,
  couponDiscount,
  useWallet,
  walletRemainingAmountToPay,
  setValue,
]);


  const handleCouponApply = async () => {
    try {
      const couponApply = await applyCoupon(couponCode, pkg?.price!);
      setCouponDiscount(couponApply.discount);
      setCouponApplied(true);
      setCouponError('');
    } catch (error: any) {
      setCouponApplied(false);
      setCouponError(error?.response?.data?.message || 'Invalid coupon');
    }
  };
const handlePayment = async (data: BookingFormSchema) => {
  console.log("Form submitted", data);

  if (data.paymentMethod === 'wallet') {
    try {
      const walletApply = await createBookingWithWalletPayment(data);
      setUseWallet(true);
      
      if (walletApply?.booking && !walletApply?.remainingAmountToPay) {
    //    navigate('/success');
    navigate(`/booking-success/${walletApply?.booking._id}`);

      } else {
        setWalletRemainingAmountToPay(walletApply?.remainingAmountToPay);
      }

    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Wallet payment failed');
    }
  } else if (data.paymentMethod === 'razorpay') {
    try {
      const res = await createBookingWithOnlinePayment(data);
      const { booking, razorpayOrder } = res;

    //   if (!razorpayOrder) {
    //     // No Razorpay needed, booking paid fully via wallet or coupon
    // navigate(`/booking-success/${booking._id}`);
    //     return;
    //   }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_ID_KEY,  
        amount: razorpayOrder.amount.toString(),
        currency: razorpayOrder.currency,
        name: "Travel Booking",
        description: "Package booking payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          try {
            const verified = await verifyRazorpayPayment({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            });

            if (verified) {
              toast.success("Payment successful!");
    navigate(`/booking-success/${booking._id}`);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Payment verification error.");
          }
        },
        prefill: {
          name: data.contactDetails.name,
          email: data.contactDetails.email,
          contact: data.contactDetails.phone,
        },
        theme: {
          color: "#F97316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Razorpay payment failed');
    }
  } else {
    toast.error("Select a valid payment method.");
  }
};

//   const handlePayment = async (data: BookingFormSchema) => {
//   console.log("Form submitted", data);

//   if (data.paymentMethod === 'wallet') {
//     try {
//       const walletApply = await createBookingWithWalletPayment(data);
//       setUseWallet(true);
//       console.log(walletApply,'wallet ')
      
// if (walletApply?.booking && !walletApply?.remainingAmountToPay) {
//   navigate('/success');
// } else {
//   setWalletRemainingAmountToPay(walletApply?.remainingAmountToPay);
// }

   
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || 'Wallet payment failed');
//     }
//   } else if (data.paymentMethod === 'razorpay') {
//     // TODO: Trigger Razorpay flow
//     toast.success("Proceeding to Razorpay...");
//   } else {
//     toast.error("Select a valid payment method.");
//   }
// };
      console.log(walletRemainingAmountToPay,'wallet remaing')


const onSubmit = (data: BookingFormSchema) => {
  console.log("Submitting...", data);
};
  return (
<form onSubmit={handleSubmit(handlePayment, (err) => console.log("Validation errors:", err))}>
      <div className="min-h-screen bg-bg">
        <div className="bg-orange text-white py-10 shadow-md">
          <div className="max-w-6xl mx-auto px-4 flex items-center gap-6">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
              <Plane className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">Complete Your Booking</h1>
              <p className="text-sm md:text-base text-white/90 mt-1">Just a few steps away from your dream vacation</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Name *" {...register('contactDetails.name')} />
                  {errors.contactDetails?.name && <p className="text-red-500 text-sm">{errors.contactDetails.name.message}</p>}

                  <Input placeholder="Email *" {...register('contactDetails.email')} />
                  {errors.contactDetails?.email && <p className="text-red-500 text-sm">{errors.contactDetails.email.message}</p>}

                  <Input placeholder="Phone *" {...register('contactDetails.phone')} />
                  {errors.contactDetails?.phone && <p className="text-red-500 text-sm">{errors.contactDetails.phone.message}</p>}

                  <Input placeholder="Alternate Phone *" {...register('contactDetails.alternatePhone')} />
                  {errors.contactDetails?.alternatePhone && <p className="text-red-500 text-sm">{errors.contactDetails.alternatePhone.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Traveler Details</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-lg mb-4">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Traveler {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => remove(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input placeholder="Full Name *" {...register(`travelers.${index}.fullName`)} />
                        {errors.travelers?.[index]?.fullName && <p className="text-red-500 text-xs">{errors.travelers[index]?.fullName?.message}</p>}
                      </div>
                      <div>
                        <Input type="number" placeholder="Age *" {...register(`travelers.${index}.age`, { valueAsNumber: true })} />
                        {errors.travelers?.[index]?.age && <p className="text-red-500 text-xs">{errors.travelers[index]?.age?.message}</p>}
                      </div>
                      <div>
                        <Input placeholder="ID *" {...register(`travelers.${index}.id`)} />
                        {errors.travelers?.[index]?.id && <p className="text-red-500 text-xs">{errors.travelers[index]?.id?.message}</p>}
                      </div>
                      <div>
                        <select {...register(`travelers.${index}.gender`)} className="border px-3 py-2 rounded text-sm">
                          <option value="">Select Gender *</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.travelers?.[index]?.gender && <p className="text-red-500 text-xs">{errors.travelers[index]?.gender?.message}</p>}
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => append({ fullName: '', age: 0, gender: 'male', id: '' })} className="w-full text-orange border-orange hover:bg-orange hover:text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add Another Traveler
                </Button>
              </CardContent>
            </Card>
<Card>
  <CardContent className="p-6">
    <h3 className="text-xl font-semibold mb-4">Travel Date</h3>
    <Input
      type="date"
        min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}  

      {...register("travelDate")}
      className="border-gray-300"
    />
    {errors.travelDate && (
      <p className="text-red-500 text-sm mt-1">
        {errors.travelDate.message}
      </p>
    )}
  </CardContent>
</Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Coupon Code</h3>
                <div className="flex gap-3">
                  <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code" />
                  <Button type="button" onClick={handleCouponApply} variant="outline" className="text-orange border-orange hover:bg-orange hover:text-white">Apply</Button>
                </div>
                {couponApplied && !couponError && <p className="text-green-600 text-sm mt-2">Coupon applied successfully!</p>}
                {couponError && <p className="text-red-600 text-sm mt-2">{couponError}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                      <div className="flex items-center space-x-3 border p-3 rounded-lg">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay">Razorpay (UPI/Cards)</Label>
                      </div>
                      <div className="flex items-center space-x-3 border p-3 rounded-lg">
                        <RadioGroupItem value="wallet" id="wallet" />
                        <Label htmlFor="wallet">Wallet ({wallet})</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Package Price</span><span>₹{pkg?.price}</span></div>
                  <div className="flex justify-between"><span>Travelers</span><span>× {travelers.length}</span></div>
                  <Separator />
                  <div className="flex justify-between font-medium"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
                  {couponApplied && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-₹{couponDiscount}</span></div>}
                  {useWallet && <div className="flex justify-between text-blue-600"><span>Wallet</span><span>{wallet}</span></div>}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg text-orange"><span>Total</span><span>₹{totalAfterDiscount.toLocaleString()}</span></div>
                </div>

                <Button type="submit" className="mt-6 w-full gradient-orange text-white py-3 text-lg">
                  <CheckCircle className="w-5 h-5 mr-2" /> Proceed to Pay
                </Button>
              </CardContent>
            </Card>
          </div> */}
      <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Package Price</span><span>₹{pkg?.price}</span></div>
                  <div className="flex justify-between"><span>Travelers</span><span>× {travelers.length}</span></div>
                  <Separator />
                  <div className="flex justify-between font-medium"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
                  {couponApplied && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-₹{couponDiscount}</span></div>}
                  {useWallet && <div className="flex justify-between text-blue-600"><span>Wallet</span><span>-₹{wallet}</span></div>}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg text-orange"><span>Total</span><span>₹{totalAfterDiscount.toLocaleString()}</span></div>
                </div>

                <Button type="submit" className="mt-6 w-full gradient-orange text-white py-3 text-lg">
                  <CheckCircle className="w-5 h-5 mr-2" /> Proceed to Pay
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </form>
  );
};

export default BookingPage;
