import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ChangeTravelDateProps {
  booking: any;
  handleChangeTravelDate: (newDate: string | Date, note?: string) => void;
}

export function ChangeTravelDate({ booking, handleChangeTravelDate }: ChangeTravelDateProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [note, setNote] = useState('');

  const startDate = new Date(booking?.packageId?.startDate || booking?.startDate);
  const endDate = new Date(booking?.packageId?.endDate || booking?.endDate);
  const today = new Date();

  const handleConfirm = async () => {
    if (!selectedDate) {
      toast.error('Please select a valid date.');
      return;
    }

    if (selectedDate < today) {
      toast.error('Travel date cannot be in the past.');
      return;
    }

    if (selectedDate.toDateString() === new Date(booking.travelDate).toDateString()) {
      toast.error('Selected date is same as current date.');
      return;
    }

    await handleChangeTravelDate(selectedDate, note);
    toast.success('Travel date updated successfully!');
    setOpen(false);
    setSelectedDate(undefined);
    setNote('');
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Travel Date</span>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Change Travel Date
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Current Travel Date:{' '}
            <span className="font-semibold">
              {new Date(booking?.travelDate).toLocaleDateString()}
            </span>
          </p>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select New Travel Date</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={[
                { before: today }, // block past dates
                { before: startDate }, // block before package start
                { after: endDate }, // block after package end
              ]}
              className="rounded-md border"
            />

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note..."
              className="w-full border p-2 rounded-md"
              rows={3}
            />

            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
