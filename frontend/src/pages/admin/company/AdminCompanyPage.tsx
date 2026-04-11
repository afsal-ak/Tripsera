import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";

import { Button } from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Search, X } from "lucide-react";

import {
    getCompanies,
    approveCompany,
    blockCompany,
    unblockCompany,
} from "@/services/admin/companyService";

import { usePaginationButtons } from "@/hooks/usePaginationButtons";

interface Company {
    _id: string;
    name: string;
    email: string;
    isApproved: boolean;
    isBlocked: boolean;
}

const AdminCompanyPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [currentPage, setCurrentPage] = useState(
        Number(searchParams.get("page")) || 1
    );
    const [totalPages, setTotalPages] = useState(1);

    const [searchInput, setSearchInput] = useState(
        searchParams.get("search") || ""
    );
    const [debouncedSearch] = useDebounce(searchInput, 500);

    const [isApproved, setIsApproved] = useState(
        searchParams.get("approved") || ""
    );
    const [isBlocked, setIsBlocked] = useState(
        searchParams.get("blocked") || ""
    );

    const limit = 10;

    // Pagination buttons
    const paginationButtons = usePaginationButtons({
        currentPage,
        totalPages,
        onPageChange: (page) => setCurrentPage(page),
    });

    // Fetch companies
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getCompanies({
                    search: debouncedSearch,
                    isApproved:
                        isApproved === "" ? undefined : isApproved === "true",
                    isBlocked:
                        isBlocked === "" ? undefined : isBlocked === "true",
                    page: currentPage,
                    limit,
                });

                setCompanies(res.companies);
                setTotalPages(res.totalPages);
            } catch {
                toast.error("Failed to load companies");
            }
        };

        fetchData();
    }, [debouncedSearch, isApproved, isBlocked, currentPage]);

    // Sync URL
    useEffect(() => {
        const params: Record<string, string> = {};

        if (debouncedSearch) params.search = debouncedSearch;
        if (isApproved) params.approved = isApproved;
        if (isBlocked) params.blocked = isBlocked;
        if (currentPage > 1) params.page = currentPage.toString();

        setSearchParams(params);
    }, [debouncedSearch, isApproved, isBlocked, currentPage]);

    // Actions
    const handleApprove = async (id: string) => {
        await approveCompany(id);
        toast.success("Company approved");
        refresh();
    };

    const handleBlock = async (id: string) => {
        await blockCompany(id);
        toast.success("Company blocked");
        refresh();
    };

    const handleUnblock = async (id: string) => {
        await unblockCompany(id);
        toast.success("Company unblocked");
        refresh();
    };

    const refresh = async () => {
        const res = await getCompanies({
            search: debouncedSearch,
            isApproved:
                isApproved === "" ? undefined : isApproved === "true",
            isBlocked:
                isBlocked === "" ? undefined : isBlocked === "true",
            page: currentPage,
            limit,
        });

        setCompanies(res.companies);
        setTotalPages(res.totalPages);
    };

    const handleClearAll = () => {
        setSearchInput("");
        setIsApproved("");
        setIsBlocked("");
        setCurrentPage(1);
        setSearchParams({});
    };

    return (
        <Card className="shadow-md border border-gray-200">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle>Companies</CardTitle>

                <div className="flex gap-3 flex-wrap items-center">
                    {/* Search */}
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search companies..."
                            className="pl-8 pr-8"
                        />
                        {searchInput && (
                            <button
                                onClick={() => setSearchInput("")}
                                className="absolute right-2 top-2.5"
                            >
                                <X className="h-4 w-4 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <select
                        value={isApproved}
                        onChange={(e) => setIsApproved(e.target.value)}
                        className="border px-3 py-2 rounded"
                    >
                        <option value="" disabled hidden>
                            Filter by Approval
                        </option>
                        <option value="">All</option>
                        <option value="true">Approved</option>
                        <option value="false">Pending</option>
                    </select>

                    <select
                        value={isBlocked}
                        onChange={(e) => setIsBlocked(e.target.value)}
                        className="border px-3 py-2 rounded"
                    >
                        <option value="" disabled hidden>
                            Filter by Status
                        </option>
                        <option value="">All</option>
                        <option value="true">Blocked</option>
                        <option value="false">Active</option>
                    </select>

                    <Button variant="outline" onClick={handleClearAll}>
                        Clear
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {companies.length ? (
                            companies.map((c, index) => (
                                <TableRow key={c._id}>
                                    <TableCell>
                                        {(currentPage - 1) * limit + index + 1}
                                    </TableCell>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>{c.email}</TableCell>

                                    <TableCell>
                                        {c.isBlocked ? (
                                            <span className="text-red-500">Blocked</span>
                                        ) : c.isApproved ? (
                                            <span className="text-green-500">Approved</span>
                                        ) : (
                                            <span className="text-yellow-500">Pending</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="flex gap-2">
                                        {!c.isApproved && (
                                            <Button size="sm" onClick={() => handleApprove(c._id)}>
                                                Approve
                                            </Button>
                                        )}

                                        {c.isBlocked ? (
                                            <ConfirmDialog
                                                title="Unblock company?"
                                                actionLabel="Unblock"
                                                onConfirm={() => handleUnblock(c._id)}
                                            >
                                                <Button size="sm" variant="outline">
                                                    Unblock
                                                </Button>
                                            </ConfirmDialog>
                                        ) : (
                                            <ConfirmDialog
                                                title="Block company?"
                                                actionLabel="Block"
                                                onConfirm={() => handleBlock(c._id)}
                                            >
                                                <Button size="sm" variant="destructive">
                                                    Block
                                                </Button>
                                            </ConfirmDialog>
                                        )}

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate(`/admin/company/${c._id}`)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    No companies found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-center mt-6 gap-2 flex-wrap">
                    {paginationButtons}
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminCompanyPage;
