import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

import {
  fetchSalesReports,
  downloadSalesReportExcel,
  downloadSalesReportPDF,
} from '@/services/admin/salesReportService';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import type { ISalesReportSummary, SalesReportResponseDTO } from '@/types/ISalesReportSummary';
const SalesReportPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<SalesReportResponseDTO[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<ISalesReportSummary>({
    totalBookings: 0,
    totalDiscount: 0,
    totalWalletUsed: 0,
    totalOnlinePaid: 0,
    totalRevenue: 0,
  });

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const filters = {
    status: searchParams.get('status') || '',
    paymentMethod: searchParams.get('paymentMethod') || '',
    day: searchParams.get('day') || '',
    week: searchParams.get('week') || '',
    month: searchParams.get('month') || '',
    year: searchParams.get('year') || '',
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    page: currentPage,
    limit: limit,
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: (page) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', page.toString());
      newParams.set('limit', limit.toString());
      setSearchParams(newParams);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchSalesReports(filters);
      setData(res.data);
      setTotalPages(res.totalPages);
      setSummary(res.summary);
    };
    fetchData();
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    newParams.set('page', '1'); // reset to first page
    setSearchParams(newParams);
  };

  const handleExcelDownload = async () => {
    await downloadSalesReportExcel(filters);
  };

  const handlePDFDownload = async () => {
    await downloadSalesReportPDF(filters);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams({ page: '1', limit: limit.toString() }));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Sales Reports</h1>

      {/* Filters */}

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Sales Report Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Specific Day */}
          <div>
            <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
              Specific Day
            </label>
            <input
              type="date"
              id="day"
              name="day"
              value={filters.day}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Month */}
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <input
              type="month"
              id="month"
              name="month"
              value={filters.month}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              placeholder="e.g., 2025"
              value={filters.year}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* From Date */}
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              id="from"
              name="from"
              value={filters.from}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* To Date */}
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              id="to"
              name="to"
              value={filters.to}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">All Payment</option>
              <option value="razorpay">RazorPay</option>
              <option value="wallet">Wallet</option>
              <option value="wallet+razorpay">Razorpay+Wallet</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Button onClick={handleExcelDownload}>Download Excel</Button>
          <Button onClick={handlePDFDownload}>Download PDF</Button>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Report Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking Code</TableHead>
                <TableHead>Package Code</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Payment Method</TableHead>

                <TableHead>Online Amount Paid</TableHead>
                <TableHead>Wallet Amount Paid</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Booked At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.bookingCode}</TableCell>
                  <TableCell>{r.packageCode}</TableCell>
                  <TableCell>{r.username}</TableCell>
                  <TableCell>{r.paymentMethod}</TableCell>

                  <TableCell>{r.amountPaid}</TableCell>
                  <TableCell>{r.walletAmountUsed}</TableCell>
                  <TableCell>{r.paymentStatus}</TableCell>
                  <TableCell>{r.bookingStatus}</TableCell>
                  <TableCell>{r.amountPaid + r.walletAmountUsed! || 0}</TableCell>
                  <TableCell>
                    {r.bookedAt ? new Date(r.bookedAt).toLocaleDateString() : ''}
                  </TableCell>
                  {/* <TableCell>
                    {r.travelDate
                      ? new Date(r.travelDate).toLocaleDateString()
                      : ''}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>Total Bookings: {summary.totalBookings}</div>
          <div>Total Discount: ₹{summary.totalDiscount}</div>
          <div>Wallet Used: ₹{summary.totalWalletUsed}</div>
          <div>Online Paid: ₹{summary.totalOnlinePaid}</div>
          <div>Total Revenue: ₹{summary.totalRevenue}</div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        {paginationButtons}
      </div>
    </div>
  );
};

export default SalesReportPage;
