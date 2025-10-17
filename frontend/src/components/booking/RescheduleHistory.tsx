import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export function RescheduleHistory({ booking }: { booking: any }) {
 
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Reschedule History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {booking.history.map((item: any, idx: number) => (
            <div key={idx} className="border-b pb-2">
              <p className="text-sm text-gray-700">
                <strong>Action:</strong> {item.action.replace("_", " ")}
              </p>
              <p className="text-sm">
                <strong>Old Date:</strong>{" "}
                {new Date(item.oldValue).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>New Date:</strong>{" "}
                {new Date(item.newValue).toLocaleDateString()}
              </p>
              {item.note && (
                <p className="text-sm">
                  <strong>Note:</strong> {item.note}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Changed on {new Date(item.changedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
