import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';

import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';

import { getUserBooking } from '@/services/user/bookingService';

import type { IBooking } from '@/types/IBooking';
const UserBookingPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getUserBooking(currentPage, limit);
        //  console.log(response,'jj')
        setBookings(response.bookings);
        setTotalPages(response.totalPages);
      } catch (error) {
        toast.error('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage]);
  console.log(bookings, totalPages);

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Travelers</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Travel Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              booking.packageId.imageUrls?.[0]?.url.replace(
                                '/upload/',
                                '/upload/f_auto,q_auto/'
                              ) || '/placeholder.jpg'
                            }
                            alt={booking.packageId.title}
                            className="h-16 w-24 object-cover rounded"
                          />
                          <div>
                            <div className="font-semibold">{booking.packageId.title}</div>
                            {/* <div className="text-xs text-muted-foreground">
                {new Date(booking.travelDate).toLocaleDateString()}
              </div> */}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{booking.travelers.length}</TableCell>
                      <TableCell>₹{booking.amountPaid}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            booking.bookingStatus === 'confirmed'
                              ? 'text-green-600'
                              : booking.bookingStatus === 'pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        {booking?.travelDate && (
                          <span>
                            {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/account/my-bookings/${booking._id}`)}
                        >
                          <Edit className="w-4 h-4 mr-2" /> View
                        </Button>
                      </TableCell>

                    </TableRow>
                    
                  ))
                )}
                                       <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            {paginationButtons}
          </div>
              </TableBody>
            </Table>
          </div>

         
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBookingPage;
