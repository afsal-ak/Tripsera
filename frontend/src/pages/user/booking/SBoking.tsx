import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Calendar, Users, Star } from 'lucide-react';

//import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
//import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
//import { Textarea } from '@/components/ui/textarea';
import { Textarea } from '@/components/textarea';
import { Dialog,DialogContent,DialogTrigger,DialogHeader,DialogTitle } from '@/components/ui/Dialog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/Button';
import { Card,CardHeader,CardContent,CardTitle } from '@/components/ui/Card';
import { BookingTimeline } from './BookingTimeline';
import { QuickActions } from './Q';
import { TravelerInfo } from './T';
import { PaymentBreakdown } from './P';
// Mock data interface - replace with your actual types
interface IBooking {
  _id: string;
  bookingCode: string;
  bookingStatus: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  amountPaid: number;
  walletUsed?: number;
  couponCode?: string;
  travelDate: string;
  createdAt: string;
  updatedAt: string;
  packageId: {
    title: string;
    packageCode: string;
    imageUrls?: Array<{ url: string }>;
    description?: string;
    location?: string;
    rating?: number;
    duration?: string;
  };
  travelers: Array<{
    fullName: string;
    age: number;
    gender: string;
  }>;
  contactDetails: {
    name: string;
    phone: string;
    email: string;
  };
}

const StandardBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRetryModal, setShowRetryModal] = useState(false);

  // Mock data - replace with your actual API call
  useEffect(() => {
    const loadBooking = async () => {
      try {
        // Replace this with your actual API call
        // const data = await getBookingById(id!);
        
        // Mock data for demonstration
        const mockBooking: IBooking = {
          _id: id || '1',
          bookingCode: 'TB2024-789123',
          bookingStatus: 'confirmed',
          paymentStatus: 'completed',
          paymentMethod: 'Credit Card',
          amountPaid: 45000,
          walletUsed: 2000,
          couponCode: 'WELCOME20',
          travelDate: '2024-04-15',
          createdAt: '2024-03-01',
          updatedAt: '2024-03-01',
          packageId: {
            title: 'Maldives Paradise Getaway',
            packageCode: 'MAL2024-001',
            imageUrls: [{ url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' }],
            description: 'Experience luxury at its finest with our exclusive Maldives package',
            location: 'Maldives',
            rating: 4.8,
            duration: '6 Days / 5 Nights'
          },
          travelers: [
            { fullName: 'John Doe', age: 32, gender: 'Male' },
            { fullName: 'Jane Doe', age: 29, gender: 'Female' }
          ],
          contactDetails: {
            name: 'John Doe',
            phone: '+1-234-567-8900',
            email: 'john.doe@example.com'
          }
        };
        
        setBooking(mockBooking);
      } catch (error) {
        toast.error('Failed to load booking details.');
        navigate('/bookings');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadBooking();
  }, [id, navigate]);
console.log(booking,'bookoing')
  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason.');
      return;
    }

    try {
      // Replace with your actual API call
      // await cancelBooking(id!, cancelReason);
      
      toast.success('Booking cancelled successfully.');
      setBooking((prev) =>
        prev ? { ...prev, bookingStatus: 'cancelled', updatedAt: new Date().toISOString() } : prev
      );
      setCancelDialogOpen(false);
      setCancelReason('');
    } catch (error) {
      toast.error('Failed to cancel booking.');
    }
  };

  const handleRetryPayment = () => {
    setShowRetryModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-white';
      case 'pending':
        return 'bg-warning text-white';
      case 'cancelled':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-muted-foreground mb-4">The booking you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/bookings')} variant="ocean">
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-ocean text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/bookings')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Bookings
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Booking Details</h1>
                <p className="opacity-90">#{booking.bookingCode}</p>
              </div>
            </div>
            <Badge className={getStatusColor(booking.bookingStatus)}>
              {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Details */}
            <Card className="shadow-card bg-gradient-card animate-fade-in">
              <div className="relative">
                {booking.packageId.imageUrls?.[0]?.url && (
                  <img
                    src={booking.packageId.imageUrls[0].url}
                    alt={booking.packageId.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                )}
                {booking.packageId.rating && (
                  <Badge className="absolute top-4 right-4 bg-gradient-sunset text-white">
                    <Star className="h-3 w-3 mr-1" />
                    {booking.packageId.rating}
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{booking.packageId.title}</CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {booking.packageId.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {booking.packageId.location}
                    </div>
                  )}
                  {booking.packageId.duration && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {booking.packageId.duration}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {booking.travelers.length} Travelers
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Package Code</p>
                    <p className="text-muted-foreground">{booking.packageId.packageCode}</p>
                  </div>
                  <div>
                    <p className="font-medium">Travel Date</p>
                    <p className="text-muted-foreground">
                      {new Date(booking.travelDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                {booking.packageId.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">{booking.packageId.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Traveler Information */}
            <TravelerInfo 
              travelers={booking.travelers}
              contactDetails={booking.contactDetails}
            />

            {/* Booking Timeline */}
            <BookingTimeline
              bookingStatus={booking.bookingStatus}
              paymentStatus={booking.paymentStatus}
              createdAt={booking.createdAt}
              travelDate={booking.travelDate}
            />
          </div>

          {/* Right Column - Actions & Payment */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions
              bookingStatus={booking.bookingStatus}
              paymentStatus={booking.paymentStatus}
              travelDate={booking.travelDate}
              onRetryPayment={handleRetryPayment}
              onCancel={() => setCancelDialogOpen(true)}
            />

            {/* Payment Breakdown */}
            <PaymentBreakdown
              amountPaid={booking.amountPaid}
              paymentStatus={booking.paymentStatus}
              paymentMethod={booking.paymentMethod}
              couponCode={booking.couponCode}
              walletUsed={booking.walletUsed}
            />
          </div>
        </div>

        {/* Cancel Booking Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please provide a reason for cancellation. This will help us improve our services.
              </p>
              <Textarea
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..."
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setCancelDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleCancel}>
                  Confirm Cancellation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StandardBookingDetail;