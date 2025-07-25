import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { Button } from "@/features/components/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/components/ui/Table";
import { Input } from "@/features/components/ui/Input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@//components/ui/select";
import { usePaginationButtons } from "@/features/hooks/usePaginationButtons";
import { getAllBlogs } from "@/features/services/admin/blogService";
import type { IBlog } from "@/features/types/IBlog";

const AdminBlogList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

//   const [titleSearch, setTitleSearch] = useState(searchParams.get("blogSearch") || "");
//   const [status, setStatus] = useState(searchParams.get("status") || "");
//   const [authorUsername, setAuthorUsername] = useState(searchParams.get("authorUsername") || "");
//   const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
//   const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getAllBlogs(currentPage, limit);
        setBlogs(response.result.blogs);
        setTotalPages(response.result.totalPages);
      } catch (error) {
        toast.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
  };

//   const handleFilterChange = () => {
//     setSearchParams({
//       page: "1",
//       limit: limit.toString(),
//       ...(titleSearch && { blogSearch: titleSearch }),
//       ...(status && { status }),
//       ...(startDate && { startDate }),
//       ...(endDate && { endDate }),
//       ...(authorUsername && { authorUsername }),
//     });
//   };

//   const handleClearFilters = () => {
//     setTitleSearch("");
//     setStatus("");
//     setAuthorUsername("");
//     setStartDate("");
//     setEndDate("");
//     setSearchParams({ page: "1", limit: limit.toString() });
//   };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });
console.log(blogs,'blog')
  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Blogs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Search title" value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} />
            <Input placeholder="Author username" value={authorUsername} onChange={(e) => setAuthorUsername(e.target.value)} />
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* <div className="flex justify-end mt-4 gap-2">
            <Button onClick={handleFilterChange}>Apply Filters</Button>
            <Button variant="outline" onClick={handleClearFilters}>Clear</Button>
          </div> */}

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No blogs found.</TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell>{blog.title}</TableCell>
                      <TableCell>{blog.author?.username || "N/A"}</TableCell>
            <TableCell>{blog.isBlocked ? "Blocked" : "Active"}</TableCell>
                      <TableCell>{new Date(blog.createdAt!).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/blogs/${blog._id}`)}>
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

export default AdminBlogList;
