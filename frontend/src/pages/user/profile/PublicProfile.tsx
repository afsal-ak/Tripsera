import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/Button";
import { Card } from "@/components/ui/Card";
import { Grid, Settings } from "lucide-react";
import ProfileGallery from "./ProfileGallery";
import { fetchPublicProfile, handleFollow, handleUnFollow } from "@/services/user/profileService";
import { handlePublicUserBlogs } from "@/services/user/blogService";
import { toast } from "sonner";
import type { IPublicProfile } from "@/types/IPublicProfile";
import type { IBlog } from "@/types/IBlog";
import { useSearchParams, useParams } from "react-router-dom";
import { OptionsDropdown } from "@/components/OptionsDropdown ";
import ReportForm from "../report/ReportForm";
import type { IReportedType, ISelectedReport } from "@/types/IReport";
import Modal from "@/components/ui/Model";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

import { handleBlockUser, handelUnBlockUser, handelIsBlocked } from "@/services/user/blockService";

const PublicProfile = () => {
    const { username } = useParams();
    const userId = useSelector((state: RootState) => state.userAuth.user?._id)


    const [profile, setProfile] = useState<IPublicProfile>();
    const [isFollowing, setIsFollowing] = useState<Boolean>(false);
    const [followers, setFollowers] = useState<number>(0);
    const [isBlocked, setIsBlocked] = useState<boolean>();
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [loading, setLoading] = useState(false);

    const [selectedReport, setSelectedReport] = useState<ISelectedReport | null>(null)
    const [showReportModal, setShowReportModal] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    useEffect(() => {
        if (!username) {
            return
        }
        const fetchProfile = async () => {
            try {

                const response = await fetchPublicProfile(username);
                console.log(response)
                setProfile(response.profile);
                setFollowers(response.profile.followersCount)
                setIsFollowing(response.isFollowing)
                if (response.profile?._id) {
                    console.log('is bloked')

                    const isBlocked = await handelIsBlocked(response.profile?._id!)
                    setIsBlocked(isBlocked.data)
                    console.log(isBlocked, 'is bloked')
                }
            } catch (error) {
                toast.error("Failed to fetch profile");
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                if (!profile?._id) return;
                const response = await handlePublicUserBlogs(profile._id, currentPage, limit);
                setBlogs(response.data);
                setTotalBlogs(response.totalBlogs);
            } catch (error) {
                toast.error("Failed to fetch posts");
            }
        };
        fetchUserBlogs();
    }, [profile?._id, currentPage, limit]);

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString(), limit: limit.toString() });
    };

    const toggleFollow = async () => {
        if (!profile?._id!) {
            return;
        }
        try {
            setLoading(true);
            if (isFollowing) {
                const response = await handleUnFollow(profile._id);
                setIsFollowing(false);
                setFollowers(prev => prev - 1)

                toast.success('unfollow  Succes')

            } else {
                const response = await handleFollow(profile._id);
                setIsFollowing(true);
                setFollowers(prev => prev + 1);
                toast.success('Following Succes')

            }
        } catch (error) {
            console.error('Follow toggle failed', error);
        } finally {
            setLoading(false);
        }
    };


    const blockUser = async () => {
        if (!profile?._id) {
            return
        }
        setLoading(true);

        try {
            const response = await handleBlockUser(profile?._id)
            toast.success(response.message)
        } catch (error: any) {
            toast.error(error?.response?.data.message || 'Something went wrong')
        } finally {
            setLoading(false);

        }
    }

    const unblockUser = async () => {
        if (!profile?._id) {
            return
        }
        setLoading(true);

        try {
            const response = await handelUnBlockUser(profile?._id)
            toast.success(response.message)
        } catch (error: any) {
            toast.error(error?.response?.data.message || 'Something went wrong')
        } finally {
            setLoading(false);

        }
    }

    const options = useMemo(() => [
        { label: 'Report', value: 'report', className: 'text-red-500' },
        isBlocked
            ? { label: 'Unblock', value: 'unblock', className: 'text-green-500' }
            : { label: 'Block', value: 'block', className: 'text-red-500' }
    ], [isBlocked]);

    const handleOptionSelect = (value: string, _id: string, reportedType: IReportedType) => {
        if (value == 'report') {
            setSelectedReport({ _id, reportedType })
            setShowReportModal(true)
        } else if (value == 'block') {
            blockUser()
            setIsBlocked(true)
        } else if (value == 'unblock') {
            unblockUser()
            setIsBlocked(false)
        }
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="h-64 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                <img
                    src={profile?.coverImage?.url.replace(
                        "/upload/",
                        "/upload/f_auto,q_auto/"
                    )}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
                    <div className="flex justify-center md:justify-start">
                        <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
                            <AvatarImage src={profile?.profileImage?.url.replace(
                                "/upload/",
                                "/upload/f_auto,q_auto/"
                            ) || '/profile-default.jpg'} />
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-1 mt-4 md:mt-0 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-900">{profile?.fullName}</h1>
                        <p className="text-gray-600">@{profile?.username}</p>
                        <p className="mt-2 text-gray-700">{profile?.bio}</p>
                    </div>

                    {userId !== profile?._id && (
                        <div className="mt-4 md:mt-0 flex flex-col md:items-end space-y-2">
                            <div className="flex space-x-2">
                                <Button onClick={toggleFollow} disabled={loading}>
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </Button>
                                <Button variant="outline">Message</Button>
                            </div>
                        </div>
                    )}
                    <OptionsDropdown options={options} onSelect={(value) => handleOptionSelect(value, profile?._id!, 'user')} />
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
                    <Card className="p-4 text-center">
                        <p className="font-bold text-xl">{totalBlogs}</p>

                        <p className="text-gray-600 text-sm">Posts</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <p className="font-bold text-xl">{followers}</p>
                        <p className="text-gray-600 text-sm">Followers</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <p className="font-bold text-xl">{profile?.followingCount}</p>
                        <p className="text-gray-600 text-sm">Following</p>
                    </Card>
                </div>

                <div className="mt-8 border-b border-gray-200">
                    <div className="flex space-x-8">
                        <button className="py-4 border-b-2 border-black font-medium flex items-center">
                            <Grid className="mr-2 h-5 w-5" /> Posts
                        </button>
                    </div>
                </div>

                <ProfileGallery
                    posts={blogs}
                    totalBlogs={totalBlogs}
                    currentPage={currentPage}
                    limit={limit}
                    onPageChange={handlePageChange}
                />
            </div>
            {showReportModal && selectedReport && (
                <Modal onClose={() => setShowReportModal(false)}>

                    <ReportForm
                        id={selectedReport._id}
                        status={selectedReport.reportedType}
                        onSuccess={() => setShowReportModal(false)}
                    />
                </Modal>

            )}
        </div>
    );
};

export default PublicProfile;
