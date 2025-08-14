import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { handleListReport } from '@/services/admin/reportService'
import type { IAdminReport } from '@/types/IReport'
import { toast } from 'sonner'
import { usePaginationButtons } from '@/hooks/usePaginationButtons'
import { FilterBar } from '@/components/FilterBar '
import { useSearchFilters } from '@/hooks/useSearchFilters'
import { useDebounce } from 'use-debounce';
import { useCleanFilter } from '@/hooks/useCleanFilter ';

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
const ReportList = () => {
    const navigate = useNavigate()
    const [reports, setReports] = useState<IAdminReport[]>([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [totalPages, setTotalPages] = useState(1);

    const {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        sort,
        customFilter,
        setCustomFilter,
        setSort,
        applyFilters,
    } = useSearchFilters();

    const [debouncedSearch] = useDebounce(searchQuery, 500);

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const cleanFilter = useCleanFilter()

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const rawFilters = {
                    search: debouncedSearch,
                    status: statusFilter,
                    sort,
                    startDate,
                    endDate,
                    customFilter
                }
                const filter = cleanFilter(rawFilters)
                const response = await handleListReport(currentPage, limit, filter)
                setReports(response.reports)
                setTotalPages(response.pagination.totalPages)
                console.log(response, 'report response')
            } catch (error: any) {
                toast.error(error?.response?.data?.message || 'Failed to fetch reports')
            }
        }
        fetchReport()
    }, [debouncedSearch, searchParams, currentPage])

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (debouncedSearch) {
            params.set('search', debouncedSearch)
        } else {
            params.delete('search')
        }
        params.set('page', '1')
        setSearchParams(params)
    }, [debouncedSearch])

    const handlePageChange = (page: number) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev)
            newParams.set('page', page.toString())
            return newParams
        })
    }
    const paginationButtons = usePaginationButtons({
        currentPage,
        totalPages,
        onPageChange: handlePageChange,
    });


    // Handlers passed to FilterBar
    const handleSearchChange = (val: string) => setSearchQuery(val);
    const handleStatusChange = (val: string) => setStatusFilter(val);
    const handleSortChange = (val: string) => setSort(val);
    const handleReportType = (val: string) => setCustomFilter(val);

    const handleApplyFilters = () => {
        applyFilters();
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        setStartDate("");
        setEndDate("");
        setSort("");
        setCustomFilter("")
        setSearchParams({ page: "1" });
    };

    const handleClick = (reportId: string) => {
        navigate(`/admin/reports/${reportId}`)
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>


                <FilterBar
                    searchValue={searchQuery}
                    statusValue={statusFilter}
                    startDateValue={startDate}
                    endDateValue={endDate}
                    sortValue={sort}
                    customFilterValue={customFilter}
                      customLabel="Report Type"

                    onSearchChange={handleSearchChange}
                    onStatusChange={handleStatusChange}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    onSortChange={handleSortChange}
                    onCustomFilterChange={handleReportType}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                    statusOptions={[
                        { value: "pending", label: "Pending" },
                        { value: "resolved", label: "Resolved" },
                        { value: "dismissed", label: "Dismissed" },
                    ]}
                    sortOptions={[
                        { value: "asc", label: "Newest" },
                        { value: "desc", label: "Oldest" },
                    ]}
                    customOption={[
                        { value: "user", label: "User" },
                        { value: "blog", label: "Blog" },
                        { value: "review", label: "Review" },

                    ]}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Reporter Name</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>reportedType</TableHead>
                            <TableHead>reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report, index) => (
                            <TableRow key={report._id}>
                                <TableCell>{(currentPage - 1) * 5 + index + 1}</TableCell>
                                <TableCell>{report.reporterUserName}</TableCell>
                                <TableCell>
                                    {report.reportedUserName || report.reviewOwner || report.blogOwner || "N/A"}
                                </TableCell>

                                <TableCell>{report.reportedType}</TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell>
                                    {report?.description!.split(/\s+/).length > 10
                                        ? report?.description!.split(/\s+/).slice(0, 10).join(" ") + "..."
                                        : report?.description}
                                </TableCell>
                                <TableCell>
                                    {report.status ? (
                                        <span className="text-red-500">{report.status}</span>
                                    ) : (
                                        <span className="text-green-500">Active</span>
                                    )}
                                </TableCell>
                 
                                <Button
                                    className="mt-5 text-center"

                                    onClick={() => handleClick(report._id)}
                                    variant="outline"
                                    size="sm"
                                >
                                    View Details
                                </Button>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                    {paginationButtons}
                </div>
            </CardContent>
        </Card>
    )
}

export default ReportList
