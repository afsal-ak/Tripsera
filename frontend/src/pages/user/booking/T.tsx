import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, User, Calendar, Phone, Mail } from "lucide-react";

interface Traveler {
  fullName: string;
  age: number;
  gender: string;
}

interface ContactDetails {
  name: string;
  phone: string;
  email: string;
}

interface TravelerInfoProps {
  travelers: Traveler[];
  contactDetails: ContactDetails;
}

export function TravelerInfo({ travelers, contactDetails }: TravelerInfoProps) {
  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-ocean-primary" />
          Traveler Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Travelers List */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Travelers ({travelers.length})
          </h4>
          <div className="space-y-3">
            {travelers.map((traveler, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{traveler.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {traveler.gender}, Age {traveler.age}
                  </p>
                </div>
                <Badge variant="secondary">
                  {index === 0 ? "Primary" : `Traveler ${index + 1}`}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Contact Details</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{contactDetails.name}</p>
                <p className="text-sm text-muted-foreground">Primary Contact</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{contactDetails.phone}</p>
                <p className="text-sm text-muted-foreground">Mobile Number</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{contactDetails.email}</p>
                <p className="text-sm text-muted-foreground">Email Address</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}