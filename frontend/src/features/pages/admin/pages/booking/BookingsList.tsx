// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { toast } from "sonner";
// import { Edit } from "lucide-react";

// import { Button } from "@/features/components/Button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/Card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/components/ui/Table";
// import { usePaginationButtons } from "@/features/hooks/usePaginationButtons";

// import { getAllBooking } from "@/features/services/admin/bookingService";
// import type { IBooking } from "@/features/types/IBooking";
// const BookingList = () => {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [bookings, setBookings] = useState<IBooking[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//      const currentPage = parseInt(searchParams.get("page") || "1", 10);
//    const limit = parseInt(searchParams.get("limit") || "5", 10);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         setLoading(true);
//         const response = await getAllBooking(currentPage, limit);
//         console.log(response,'jj')
//         setBookings(response.bookings);
//         setTotalPages(response.totalPages);
//       } catch (error) {
//         toast.error("Failed to fetch bookings.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [currentPage]);

//   const handlePageChange = (page: number) => {
//     setSearchParams({ page: page.toString(), limit: limit.toString() });
//   };

//   const paginationButtons = usePaginationButtons({
//     currentPage,
//     totalPages,
//     onPageChange: handlePageChange,
//   });

// console.log(bookings,totalPages)

//   return (
//     <div className="p-4 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Your Bookings</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Package</TableHead>
//                   <TableHead>Travelers</TableHead>
//                   <TableHead>Amount Paid</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Travel Date</TableHead>
//                  </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {bookings.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center">
//                       No bookings found.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   bookings.map((booking) => (
//                     <TableRow key={booking._id}>

//                        <TableCell>
//           <div className="flex items-center gap-3">
//             <img
//               src={
//                 booking.packageId.imageUrls?.[0]?.url.replace("/upload/", "/upload/f_auto,q_auto/") ||
//                 "/placeholder.jpg"
//               }
//               alt={booking.packageId.title}
//               className="h-16 w-24 object-cover rounded"
//             />
//             <div>
//               <div className="font-semibold">{booking.packageId.title}</div>
//               {/* <div className="text-xs text-muted-foreground">
//                 {new Date(booking.travelDate).toLocaleDateString()}
//               </div> */}
//             </div>
//           </div>
//         </TableCell>

//                                     <TableCell>{booking.travelers.length}</TableCell>
//                       <TableCell>₹{booking.amountPaid}</TableCell>
//                       <TableCell>
//                         <span
//                           className={`font-medium ${
//                             booking.bookingStatus === "confirmed"
//                               ? "text-green-600"
//                               : booking.bookingStatus === "pending"
//                               ? "text-yellow-600"
//                               : "text-red-600"
//                           }`}
//                         >
//                           {booking.bookingStatus}
//                         </span>
//                       </TableCell>
//                       {/* <TableCell>{new Date(booking?.travelDate).toLocaleDateString()}</TableCell> */}
//                       <TableCell>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => navigate(`/admin/bookings/${booking._id}`)}
//                         >
//                           <Edit className="w-4 h-4 mr-2" /> View
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           <div className="mt-4 flex justify-center">{paginationButtons}</div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default BookingList;
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';
import { Button } from '@/features/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/components/ui/Table';
import { Input } from '@/features/components/ui/Input';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/features/components/ui/Select";
import { usePaginationButtons } from '@/features/hooks/usePaginationButtons';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@//components/ui/select';
import { getAllBooking } from '@/features/services/admin/bookingService';
import type { IBooking } from '@/features/types/IBooking';

const BookingList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [packageQuery, setPackageQuery] = useState(searchParams.get('package') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getAllBooking(
          currentPage,
          limit,
          packageQuery,
          statusFilter,
          startDate,
          endDate
        );
        setBookings(response.bookings);
        setTotalPages(response.totalPages);
      } catch (error) {
        toast.error('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage, packageQuery, statusFilter, startDate, endDate]);
  console.log(bookings, 'booki');
  const handleFilterChange = () => {
    setSearchParams({
      page: '1',
      limit: limit.toString(),
      ...(packageQuery && { package: packageQuery }),
      ...(statusFilter && { status: statusFilter }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
  };

  const handleClearFilters = () => {
    searchParams.delete('packageSearch');
    searchParams.delete('status');
    searchParams.delete('startDate');
    searchParams.delete('endDate');
    searchParams.set('page', '1');

    setPackageQuery('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');

    setSearchParams(searchParams);
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const params: any = {};
      prev.forEach((value, key) => (params[key] = value));
      params.page = page.toString();
      return params;
    });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search by Package"
              value={packageQuery}
              onChange={(e) => setPackageQuery(e.target.value)}
            />

            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <Button onClick={handleFilterChange}>Apply Filters</Button>
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Travelers</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="flex">
                        <img
                          src={
                            booking.packageImage?.url?.replace(
                              '/upload/',
                              '/upload/f_auto,q_auto/'
                            ) || '/placeholder.jpg'
                          }
                          alt={booking.packageTitle}
                          className="h-16 w-24 object-cover rounded"
                        />
                        <div>
                          <div className="font-semibold">{booking.packageTitle}</div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.travelers.length}</TableCell>
                      <TableCell>₹{booking?.amountPaid}</TableCell>
                      <TableCell>
                        {' '}
                        <span>
                          {new Date(booking?.bookedAt!).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </TableCell>
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                        >
                          <Edit className="w-4 h-4 mr-2" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-center">{paginationButtons}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingList;
