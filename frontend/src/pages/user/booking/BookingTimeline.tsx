import { CheckCircle, Clock, XCircle, Calendar, CreditCard, Plane } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card,CardHeader,CardContent,CardTitle } from "@/components/ui/Card";
interface TimelineStep {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "completed" | "current" | "pending" | "cancelled";
  icon: React.ElementType;
}

interface BookingTimelineProps {
  bookingStatus: string;
  paymentStatus: string;
  createdAt: string;
  travelDate: string;
}

export function BookingTimeline({ bookingStatus, paymentStatus, createdAt, travelDate }: BookingTimelineProps) {
  const getTimelineSteps = (): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        id: "booking",
        title: "Booking Created",
        description: "Your booking request has been submitted",
        date: new Date(createdAt).toLocaleDateString(),
        status: "completed",
        icon: Calendar
      },
      {
        id: "payment",
        title: "Payment",
        description: paymentStatus === "completed" ? "Payment successful" : paymentStatus === "pending" ? "Payment pending" : "Payment failed",
        date: new Date(createdAt).toLocaleDateString(),
        status: paymentStatus === "completed" ? "completed" : paymentStatus === "pending" ? "current" : "cancelled",
        icon: CreditCard
      },
      {
        id: "confirmation",
        title: "Booking Confirmed",
        description: bookingStatus === "confirmed" ? "Your booking is confirmed" : bookingStatus === "cancelled" ? "Booking cancelled" : "Awaiting confirmation",
        date: bookingStatus === "confirmed" ? new Date(createdAt).toLocaleDateString() : "",
        status: bookingStatus === "confirmed" ? "completed" : bookingStatus === "cancelled" ? "cancelled" : paymentStatus === "completed" ? "current" : "pending",
        icon: CheckCircle
      },
      {
        id: "travel",
        title: "Travel Date",
        description: "Your journey begins",
        date: new Date(travelDate).toLocaleDateString(),
        status: new Date() >= new Date(travelDate) ? "completed" : bookingStatus === "confirmed" ? "pending" : "pending",
        icon: Plane
      }
    ];

    return steps;
  };

  const steps = getTimelineSteps();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "current":
        return <Clock className="h-5 w-5 text-warning" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-ocean-primary" />
          Booking Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.status === "completed" ? "bg-success border-success" :
                    step.status === "current" ? "bg-warning border-warning" :
                    step.status === "cancelled" ? "bg-destructive border-destructive" :
                    "bg-muted border-muted"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      step.status === "completed" || step.status === "current" || step.status === "cancelled" 
                        ? "text-white" 
                        : "text-muted-foreground"
                    }`} />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${
                      step.status === "completed" ? "bg-success" : "bg-muted"
                    }`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      step.status === "completed" ? "text-foreground" :
                      step.status === "current" ? "text-foreground" :
                      step.status === "cancelled" ? "text-destructive" :
                      "text-muted-foreground"
                    }`}>
                      {step.title}
                    </h4>
                    {getStatusIcon(step.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {step.date && (
                    <p className="text-xs text-muted-foreground mt-1">{step.date}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}