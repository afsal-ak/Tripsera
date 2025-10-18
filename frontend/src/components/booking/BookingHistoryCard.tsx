import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
interface TravelerHistory {
  traveler?: {
    fullName: string;
    gender?: string;
    age?: number;
    idType?: string;
    idNumber?: string;
  };
  action: string;
  note?: string;
  changedBy?: string;
  changedAt: string | Date;
}

interface DateHistory {
  action: string;
  oldValue?: string | Date;
  newValue?: string | Date;
  note?: string;
  changedBy?: string;
  changedAt: string | Date;
}

interface BookingHistoryCardProps {
  title: string;
  type: 'traveler' | 'date'; // choose what kind of history to show
  history?: TravelerHistory[] | DateHistory[];
}

export const BookingHistoryCard = ({ title, type, history }: BookingHistoryCardProps) => {
  if (!history || history.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item: any, i: number) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
              {/* Traveler Info */}
              {type === 'traveler' && item.traveler && (
                <div className="mb-3">
                  <div className="text-gray-900 font-semibold text-lg">
                    {item.traveler.fullName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.traveler.gender}, Age {item.traveler.age}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.traveler.idType?.toUpperCase()}: {item.traveler.idNumber}
                  </div>
                </div>
              )}

              {/* Date Change Info */}
              {type === 'date' && (
                <div className="mb-3 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Old Date:</span>{' '}
                    {item.oldValue ? new Date(item.oldValue).toLocaleDateString() : '-'}
                  </p>
                  <p>
                    <span className="font-medium">New Date:</span>{' '}
                    {item.newValue ? new Date(item.newValue).toLocaleDateString() : '-'}
                  </p>
                </div>
              )}

              {/* Action Badge */}
              <Badge
                className={`mb-3 ${
                  item.action?.toLowerCase().includes('remove')
                    ? 'bg-red-100 text-red-700 hover:bg-red-100'
                    : item.action?.toLowerCase().includes('add')
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {item.action.toUpperCase()}
              </Badge>

              {/* Note */}
              {item.note && (
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Note:</span> {item.note}
                </div>
              )}

              {/* Changed By */}
              <div className="text-xs text-gray-500">
                <p>Changed by: {item.changedBy}</p>
                <p>On: {new Date(item.changedAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
