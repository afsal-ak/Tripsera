import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { BookingSchema, type BookingFormSchema } from '@/schemas/BookingSchema';
import {
  applyCoupon,
  createBookingWithWalletPayment,
  createBookingWithOnlinePayment,
  verifyRazorpayPayment,
  cancelUnpaidBooking,
} from '@/services/user/bookingService';
import { fetchPackgeById } from '@/services/user/PackageService';
import { getWalletBalance } from '@/services/user/walletService';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/Button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/Label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Plane, Plus, Minus, CreditCard, Wallet, Zap, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { IPackage } from '@/types/IPackage';
import { cn } from '@/lib/utils';
declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state: RootState) => state.userAuth.user);

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isUsingWallet, setIsUsingWallet] = useState(true);
  const [isWalletApplied, setIsWalletApplied] = useState(false);

  const [walletUsed, setWalletUsed] = useState<number>(0);
  const [finalPayableAmount, setFinalPayableAmount] = useState<number>(0); // after applying wallet + coupon

  const [packageData, setPackageData] = useState<IPackage>();

  const [subtotal, setSubtotal] = useState(0);
  const [amountAfterDiscount, setAmountAfterDiscount] = useState(0);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const paymentMethods = [
    {
      id: 'razorpay',
      label: 'Razorpay',
      description: 'Pay securely with card, UPI, or net banking',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      recommended: true,
    },
    {
      id: 'wallet',
      label: 'Wallet Only',
      description: `₹${walletBalance.toLocaleString()} available`,
      icon: Wallet,
      color: 'from-green-500 to-green-600',
      disabled: walletBalance < amountAfterDiscount,
    },
    {
      id: 'wallet+razorpay',
      label: 'Wallet + Razorpay',
      description: 'Use wallet balance and pay the rest',
      icon: Zap,
      color: 'from-orange to-orange-dark',
      disabled: walletBalance <= 0,
    },
  ];

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { balance } = await getWalletBalance();
        setWalletBalance(balance);
      } catch (error) {
        console.error('Failed to fetch wallet:', error);
      }
    };

    fetchWallet();
  }, []);

  const handleCouponApply = async () => {
    try {
      const result = await applyCoupon(couponCode, packageData?.finalPrice!);
      setCouponDiscount(result.discount);

      setIsCouponApplied(true);
      setCouponError('');
    } catch (err: any) {
      setIsCouponApplied(false);
      setCouponError(err?.response?.data?.message || 'Invalid coupon');
    }
  };

  const handleCouponRemove = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setIsCouponApplied(false);
    setCouponError('');
  };

  //console.log(localStorage.getItem('user'), 'reduc user info')
  console.log(couponCode, couponDiscount, 'coupon in payment');
  useEffect(() => {
    const loadPackage = async () => {
      if (!id) {
        return;
      }
      try {
        const data = await fetchPackgeById(id);

        setPackageData(data as IPackage);
      } catch (error) {
        console.error('Failed to fetch package details', error);
      }
    };
    loadPackage();
  }, [id]);

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
      travelDate: '',
      // travelers: [{ fullName: '', age: 0, gender: 'male', id: '' }],
      travelers: [{ fullName: '', age: 0, gender: 'male', idType: undefined, idNumber: '' }],
      contactDetails: {
        name: userData?.fullName || '',
        phone: userData?.phone ? String(userData.phone) : '',
        alternatePhone: '',
        email: userData?.email || '',
      },
      couponCode: '',
      discount: 0,
      totalAmount: 0,
      walletAmountUsed: 0,
      amountPaid: 0,
      useWallet: true,
      paymentMethod: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'travelers' });
  const travelers = watch('travelers');
  //const paymentMethod = watch('paymentMethod');
  const selectedPaymentMethod = watch('paymentMethod');
  useEffect(() => {
    const basePrice = packageData?.finalPrice ?? 0;
    const travelerCount = travelers.length;
    const sub = basePrice * travelerCount;
    const discount = isCouponApplied ? couponDiscount : 0;
    const afterDiscount = Math.max(0, sub - discount);

    // Get selected payment method from react-hook-form
    const selectedMethod = watch('paymentMethod');

    let walletAmountToUse = 0;

    if (selectedMethod === 'wallet') {
      // use wallet fully
      walletAmountToUse = Math.min(walletBalance, afterDiscount);
    } else if (selectedMethod === 'wallet+razorpay') {
      // use wallet partially and rest razorpay
      walletAmountToUse = Math.min(walletBalance, afterDiscount);
    } else {
      // razorpay only — do NOT use wallet
      walletAmountToUse = 0;
    }

    const amountToPay = afterDiscount - walletAmountToUse;

    setSubtotal(sub);
    setAmountAfterDiscount(afterDiscount);
    setWalletUsed(walletAmountToUse);
    setFinalPayableAmount(amountToPay);

    // Backend values
    setValue('totalAmount', sub);
    setValue('walletAmountUsed', walletAmountToUse);
    setValue('amountPaid', amountToPay);
    setValue('couponCode', couponCode);
    setValue('discount', couponDiscount);
  }, [
    packageData?.finalPrice,
    travelers.length,
    walletBalance,
    isUsingWallet,
    isCouponApplied,
    couponDiscount,
    setValue,
    watch('paymentMethod'),
  ]);

  const initiateRazorpayPayment = (
    razorpayOrder: any,
    booking: any,
    formData: BookingFormSchema
  ) => {
    console.log('razorpayOrder', razorpayOrder);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_ID_KEY,
      amount: razorpayOrder.amount.toString(),
      currency: razorpayOrder.currency,
      name: 'Travel Booking',
      description: 'Package booking payment',
      order_id: razorpayOrder.id,
      handler: async function (response: any) {
        const verified = await verifyRazorpayPayment(response);

        if (verified) {
          toast.success('Payment successful!');
          navigate(`/booking-success/${booking._id}`);
        } else {
          toast.error('Payment verification failed.');
        }
      },
      modal: {
        ondismiss: async () => {
          try {
            await cancelUnpaidBooking(booking._id);
            navigate(`/booking-failed/${booking.bookingCode}`);

            toast.info('Payment cancelled and booking marked as cancelled.');
          } catch (error) {
            console.error('Cancel booking failed', error);
            toast.error('Failed to cancel booking. Try again.');
          }
        },
      },
      prefill: {
        name: formData.contactDetails.name,
        email: formData.contactDetails.email,
        contact: formData.contactDetails.phone,
      },
      theme: { color: '#F97316' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayment = async (formData: BookingFormSchema) => {
    try {
      if (formData.paymentMethod === 'wallet') {
        setIsWalletApplied(true); //  enable wallet deduction UI

        if (walletBalance >= finalPayableAmount) {
          const res = await createBookingWithWalletPayment({
            ...formData,
            useWallet: true,
          });

          navigate(`/booking-success/${res.booking._id}`);
        } else {
          toast.error('Insufficient wallet balance.');
        }
      } else if (
        formData.paymentMethod === 'razorpay' ||
        formData.paymentMethod === 'wallet+razorpay'
      ) {
        setIsWalletApplied(formData.paymentMethod === 'wallet+razorpay');

        const razorpayOrderData = await createBookingWithOnlinePayment({
          ...formData,
          useWallet: isUsingWallet,
          walletAmountUsed: walletUsed,
          amountPaid: finalPayableAmount,
        });

        const { booking, razorpayOrder } = razorpayOrderData;

        initiateRazorpayPayment(razorpayOrder, booking, formData);
      } else {
        toast.error('Select a valid payment method.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Payment failed.');
    }
  };

  // const onSubmit = (data: BookingFormSchema) => {
  //   console.log("Submitting...", data);
  // };
  return (
    <form onSubmit={handleSubmit(handlePayment, (err) => console.log('Validation errors:', err))}>
      <div className="min-h-screen bg-bg">
        <div className="bg-orange text-white py-10 shadow-md">
          <div className="max-w-6xl mx-auto px-4 flex items-center gap-6">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
              <Plane className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">Complete Your Booking</h1>
              <p className="text-sm md:text-base text-white/90 mt-1">
                Just a few steps away from your dream vacation
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col">
                    <Input
                      placeholder="Name *"
                      defaultValue={userData?.fullName || ''}
                      {...register('contactDetails.name')}
                    />
                    {errors.contactDetails?.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactDetails.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <Input
                      placeholder="Email *"
                      defaultValue={userData?.email || ''}
                      {...register('contactDetails.email')}
                    />
                    {errors.contactDetails?.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactDetails.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col">
                    <Input
                      placeholder="Phone *"
                      defaultValue={userData?.phone || ''}
                      {...register('contactDetails.phone')}
                    />
                    {errors.contactDetails?.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactDetails.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Alternate Phone */}
                  <div className="flex flex-col">
                    <Input
                      placeholder="Alternate Phone *"
                      {...register('contactDetails.alternatePhone')}
                    />
                    {errors.contactDetails?.alternatePhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactDetails.alternatePhone.message}
                      </p>
                    )}
                  </div>
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => remove(index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <Input
                          placeholder="Full Name *"
                          {...register(`travelers.${index}.fullName`)}
                        />
                        {errors.travelers?.[index]?.fullName && (
                          <p className="text-red-500 text-xs">
                            {errors.travelers[index]?.fullName?.message}
                          </p>
                        )}
                      </div>

                      {/* Age */}
                      <div>
                        <Input
                          type="number"
                          placeholder="Age *"
                          {...register(`travelers.${index}.age`, { valueAsNumber: true })}
                        />
                        {errors.travelers?.[index]?.age && (
                          <p className="text-red-500 text-xs">
                            {errors.travelers[index]?.age?.message}
                          </p>
                        )}
                      </div>

                      {/* ID Type */}
                      <div>
                        <select
                          {...register(`travelers.${index}.idType`)}
                          className="border px-3 py-2 rounded text-sm w-full"
                        >
                          <option value="">Select ID Type *</option>
                          <option value="aadhaar">Aadhaar</option>
                          <option value="pan">PAN</option>
                          <option value="passport">Passport</option>
                        </select>
                        {errors.travelers?.[index]?.idType && (
                          <p className="text-red-500 text-xs">
                            {errors.travelers[index]?.idType?.message}
                          </p>
                        )}
                      </div>

                      {/* ID Number */}
                      <div>
                        <Input
                          placeholder="Enter ID Number *"
                          {...register(`travelers.${index}.idNumber`)}
                        />
                        {errors.travelers?.[index]?.idNumber && (
                          <p className="text-red-500 text-xs">
                            {errors.travelers[index]?.idNumber?.message}
                          </p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <select
                          {...register(`travelers.${index}.gender`)}
                          className="border px-3 py-2 rounded text-sm w-full"
                        >
                          <option value="">Select Gender *</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.travelers?.[index]?.gender && (
                          <p className="text-red-500 text-xs">
                            {errors.travelers[index]?.gender?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      fullName: '',
                      age: 0,
                      gender: 'male',
                      idType: undefined,
                      idNumber: '',
                    })
                  }
                  className="w-full text-orange border-orange hover:bg-orange hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Another Traveler
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Travel Date</h3>
                <Input
                  type="date"
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  {...register('travelDate')}
                  max={
                    packageData?.endDate
                      ? new Date(packageData.endDate).toISOString().split('T')[0]
                      : undefined
                  }
                  {...register('travelDate')}
                  className="border-gray-300"
                />
                {errors.travelDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.travelDate.message}</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Coupon Code</h3>
                <div className="flex gap-3">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    disabled={isCouponApplied} // disable input if coupon is applied
                  />

                  {!isCouponApplied ? (
                    <Button
                      type="button"
                      onClick={handleCouponApply}
                      variant="outline"
                      className="text-orange border-orange hover:bg-orange hover:text-white"
                    >
                      Apply
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleCouponRemove}
                      variant="destructive"
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Remove
                    </Button>
                  )}
                </div>

                {/* Success message */}
                {isCouponApplied && !couponError && (
                  <p className="text-green-600 text-sm mt-2">Coupon applied successfully!</p>
                )}

                {/* Error message */}
                {couponError && <p className="text-red-600 text-sm mt-2">{couponError}</p>}
              </CardContent>
            </Card>

            <Card className="shadow-travel w-full max-w-full">
              <CardContent className="p-4 sm:p-6 overflow-hidden">
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 font-poppins">
                    Payment Method
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Choose your preferred payment option
                  </p>
                </div>

                <div className="w-full overflow-hidden">
                  <Controller
                    name="paymentMethod"
                    control={control}
                    rules={{ required: 'Please select a payment method' }}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-col gap-3 sm:gap-4 w-full"
                      >
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="relative w-full">
                            <Label
                              htmlFor={method.id}
                              className={cn(
                                // ✅ Make every option full width, and stack neatly
                                'flex items-center sm:items-center w-full gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex-wrap sm:flex-nowrap',
                                field.value === method.id
                                  ? 'border-orange bg-orange/5 shadow-md'
                                  : 'border-border hover:border-orange/50 hover:bg-muted/30',
                                method.disabled && 'opacity-50 cursor-not-allowed'
                              )}
                            >
                              <RadioGroupItem
                                value={method.id}
                                id={method.id}
                                disabled={method.disabled}
                                className="flex-shrink-0"
                              />

                              <div
                                className={cn(
                                  'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white flex-shrink-0',
                                  `bg-gradient-to-br ${method.color}`
                                )}
                              >
                                <method.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                  <span className="font-semibold text-foreground text-sm sm:text-base">
                                    {method.label}
                                  </span>

                                  {method.recommended && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-orange text-white rounded-full">
                                      <Check className="w-3 h-3" />
                                      Recommended
                                    </span>
                                  )}

                                  {method.disabled && (
                                    <span className="text-xs text-muted-foreground font-medium">
                                      Insufficient balance
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                  {method.description}
                                </p>
                              </div>

                              {field.value === method.id && (
                                <div className="w-5 h-5 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                </div>

                {errors.paymentMethod && (
                  <p className="text-destructive text-sm mt-3 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-destructive"></span>
                    {errors.paymentMethod.message}
                  </p>
                )}
              </CardContent>
            </Card>

          </div>


          <div className="space-y-6">
            <Card className="sticky top-4 overflow-hidden shadow-md rounded-xl">
              {/* Full-width package image */}
              <div className="relative h-44 w-full">
                <img
                  src={packageData?.imageUrls?.[0]?.url || '/placeholder.jpg'}
                  alt={packageData?.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-xl font-semibold">{packageData?.title}</h3>
                  <p className="text-sm opacity-90">{packageData?.location?.[0]?.name}</p>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Duration & Details */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    ⏱️ {packageData?.durationDays} Days / {packageData?.durationNights} Nights
                  </p>
                  <p className="text-sm text-gray-500">
                    Start: {packageData?.startPoint}
                  </p>
                </div>

                <Separator className="mb-4" />

                {/* Booking Summary */}
                <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Package Price</span>
                    <span>₹{packageData?.finalPrice?.toLocaleString() ?? '0'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Travelers</span>
                    <span>× {travelers.length}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  {isCouponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  {(watch('paymentMethod') === 'wallet' ||
                    watch('paymentMethod') === 'wallet+razorpay') && (
                      <div className="flex justify-between">
                        <span>Wallet Used</span>
                        <span>- ₹{walletUsed.toLocaleString()}</span>
                      </div>
                    )}

                  <Separator />

                  <div className="flex justify-between font-bold text-lg text-orange-600">
                    <span>Total</span>
                    <span>₹{finalPayableAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-6 w-full bg-gradient-to-r from-orange to-red-500 hover:opacity-90 text-white py-3 text-lg rounded-lg shadow-sm"
                >
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

export default CheckoutPage;
