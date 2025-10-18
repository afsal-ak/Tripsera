import { useEffect, useState } from 'react';
import { handleFetchReport, handleChangeStatusReport } from '@/services/admin/reportService';
import { fetchBlogById, changeBlogStatus, deleteBlogAdmin } from '@/services/admin/blogService';
import {
  handleChangeStatus,
  handleReviewDetail,
  handleDeleteReview,
} from '@/services/admin/reviewService';
import { toggleBlockUser, fetchUserDetails } from '@/services/admin/userService';
import type { IReport } from '@/types/IReport';
import type { IUser } from '@/types/IUser';
import type { IBlog } from '@/types/IBlog';
import type { IReview } from '@/types/IReview';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import BlogDetailCard from '../blog/BlogDetailCard';
import ReviewDetailCard from '../review/ReviewDetailCard';

import UserDetailsCard from '../user/UserDetailsCard';
const ReportDetails = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<IReport>();
  //const [targetData, setTargetData] = useState<IUser | IBlog | IReview>();
  const [blogData, setBlogData] = useState<IBlog>();
  const [userData, setUserData] = useState<IUser>();
  const [reviewData, setReviewData] = useState<IReview>();
  const [status, setStatus] = useState('pending'); // initial value

  // Fetch main report
  useEffect(() => {
    if (!reportId) {
      return;
    }
    const fetchReport = async () => {
      try {
        const response = await handleFetchReport(reportId);
        console.log(response, 'response');
        setReport(response.report);
        setStatus(response.report.status);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load report');
      }
    };
    fetchReport();
  }, [reportId]);

  useEffect(() => {
    if (!report?.reportedId || !report?.reportedType) {
      console.log('fetch');
      return;
    }
    console.log('fetch');

    const fetchTarget = async () => {
      if (!report?.reportedId || !report?.reportedType) {
        console.log('fetch');
        return;
      }
      try {
        console.log('fetch');
        if (report.reportedType == 'blog') {
          const response = await fetchBlogById(report.reportedId);
          // console.log(response, 'blog res')

          setBlogData(response.blog);
        } else if (report.reportedType == 'review') {
          const response = await handleReviewDetail(report.reportedId);
          console.log(response, 'review res');

          setReviewData(response.review);
        } else if (report.reportedType == 'user') {
          const response = await fetchUserDetails(report.reportedId);
          console.log(response, 'user res');

          setUserData(response.user);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load target');
      }
    };
    fetchTarget();
  }, [!report?.reportedId || !report?.reportedType]);

  const handleStatusChange = async (value: string) => {
    if (!reportId) return;
    try {
      console.log(value, 'value');
      await handleChangeStatusReport(reportId, value);
      setStatus(value);
      toast.success('Report status updated');
    } catch (error: any) {
      console.log(error, 'error');
      toast.error(error?.response?.data?.message || 'Failed to change status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      if (report?.reportedType == 'blog') {
        await deleteBlogAdmin(id);
        toast.success('Blog deleted successfully');
      } else if (report?.reportedType == 'review') {
        await handleDeleteReview(id);
        toast.success('Review deleted successfully');
      }

      navigate('/admin/reports');
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  const handleBlockToggle = async (id: string, isBlocked: boolean) => {
    if (!id) return;
    try {
      if (report?.reportedType == 'blog') {
        console.log(isBlocked, 'blocked in blog');

        await changeBlogStatus(id, isBlocked);
        setBlogData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            isBlocked: !prev.isBlocked,
          };
        });
      } else if (report?.reportedType == 'review') {
        console.log(isBlocked, 'blocked in review');
        await handleChangeStatus(reviewData?._id!, isBlocked);

        setReviewData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            isBlocked,
          };
        });
      } else if (report?.reportedType == 'user') {
        console.log(isBlocked, 'blocked in review');
        await toggleBlockUser(userData?._id!);

        setUserData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            isBlocked,
          };
        });
      }
      toast.success(` ${!isBlocked ? 'blocked' : 'unblocked'} successfully`);
      navigate(`/admin/reports/${reportId}`);
    } catch {
      toast.error('Failed to change blog status');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Report Info */}
      <Card className="shadow-sm border rounded-lg">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">Report Details</CardTitle>
              <p className="text-sm text-gray-500 mt-1">View the report and update its status</p>
            </div>
            <Badge
              variant={
                status === 'pending'
                  ? 'secondary'
                  : status === 'resolved'
                    ? 'default'
                    : 'destructive'
              }
              className={status === 'resolved' ? 'bg-green-500 text-white' : ''}
            >
              {status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="grid gap-2">
            <p>
              <strong>Reported Type:</strong> {report?.reportedType || 'N/A'}
            </p>
            <p>
              <strong>Reason:</strong> {report?.reason || 'N/A'}
            </p>
            <p>
              <strong>Description:</strong> {report?.description || 'No description provided'}
            </p>
            <p>
              <strong>Reported At:</strong>{' '}
              {report?.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>

          {/* Status Selector */}
          <div>
            <label className="font-medium text-gray-700">Change Status</label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48 mt-2">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Target Info */}
      <Card className="shadow-sm border rounded-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">Target Details</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Information about the reported entity</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User */}
          {userData && (
            <UserDetailsCard
              userData={userData}
              onToggleBlock={() => handleBlockToggle(userData?._id!, !userData.isBlocked)}
            />
          )}

          {/* Blog */}
          {blogData && (
            <BlogDetailCard
              blog={blogData}
              likesCount={blogData?.likes?.length || 0}
              onDelete={() => handleDelete(blogData?._id!)}
              onToggleBlock={() => handleBlockToggle(blogData?._id!, !blogData.isBlocked)}
            />
          )}

          {/* Review */}
          {reviewData && (
            <ReviewDetailCard
              reviewData={reviewData}
              onDelete={() => handleDelete(reviewData._id)}
              onToggleBlock={handleBlockToggle}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDetails;
