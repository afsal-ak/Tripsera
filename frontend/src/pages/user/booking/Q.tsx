import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Download, 
  Share2, 
  MessageCircle, 
  MapPin, 
  Calendar,
  Phone,
  Mail,
  RefreshCw
} from "lucide-react";

interface QuickActionsProps {
  bookingStatus: string;
  paymentStatus: string;
  travelDate: string;
  onRetryPayment?: () => void;
  onCancel?: () => void;
}

export function QuickActions({ 
  bookingStatus, 
  paymentStatus, 
  travelDate,
  onRetryPayment,
  onCancel 
}: QuickActionsProps) {
  const isPastTravel = new Date() > new Date(travelDate);
  const canCancel = bookingStatus !== 'cancelled' && !isPastTravel;
  const needsPayment = paymentStatus === 'pending' || paymentStatus === 'failed';

  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button   className="w-full">
            <Download className="h-4 w-4" />
            Download Voucher
          </Button>
          <Button   className="w-full">
            <Share2 className="h-4 w-4" />
            Share Booking
          </Button>
        </div>

        {/* Conditional Actions */}
        {needsPayment && (
          <Button 
        //    variant="sunset" 
            className="w-full"
            onClick={onRetryPayment}
          >
            <RefreshCw className="h-4 w-4" />
            Retry Payment
          </Button>
        )}

        {canCancel && (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={onCancel}
          >
            Cancel Booking
          </Button>
        )}

        {/* Support Actions */}
        <div className="border-t pt-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Need Help?</p>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="ghost" size="sm" className="justify-start">
              <MessageCircle className="h-4 w-4" />
              Live Chat Support
            </Button>
            <Button variant="ghost" size="sm" className="justify-start">
              <Phone className="h-4 w-4" />
              Call: +1 (555) 123-4567
            </Button>
            <Button variant="ghost" size="sm" className="justify-start">
              <Mail className="h-4 w-4" />
              Email Support
            </Button>
          </div>
        </div>

        {/* Travel Info */}
        {bookingStatus === 'confirmed' && !isPastTravel && (
          <div className="border-t pt-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Travel Information</p>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="ghost" size="sm" className="justify-start">
                <MapPin className="h-4 w-4" />
                View Destination Guide
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                <Calendar className="h-4 w-4" />
                Add to Calendar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}