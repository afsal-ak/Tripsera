import type { IUser } from '@/types/IUser';
import { Mail, MapPin, Calendar, Lock, Globe, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import ReferralLinkBox from './ReferralLink';
import { handleProfilePrivacy } from '@/services/user/profileService';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
type Props = {
  user?: IUser;
  loading: boolean;
  refetchUser: () => Promise<void>;
};

const Dashboard = ({ user, loading, refetchUser }: Props) => {
  const profilePic = user?.profileImage?.url
    ? user.profileImage.url.replace('/upload/', '/upload/f_webp,q_auto/')
    : '/profile-default.jpg';

  const coverPic = user?.coverImage?.url
    ? user.coverImage.url.replace('/upload/', '/upload/f_webp,q_auto/')
    : '/profile-default.jpg';

  const handleProfilePrivacyToggle = async () => {
    try {
      const newStatus = !user?.isPrivate;
      const result = await handleProfilePrivacy(newStatus);
      await refetchUser();
      if (result) {
        toast.success(`Profile set to ${newStatus ? 'Private' : 'Public'}`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 text-center">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Profile Card */}
        <div className="relative w-full bg-white rounded-3xl shadow-lg">
          {/* Cover */}
          <div className="w-full h-48 sm:h-56 md:h-64 relative">
            <img src={coverPic} alt="Cover" className="w-full h-full object-contain" />
          </div>

          {/* Profile Image */}
          <div className="absolute inset-x-0 -bottom-16 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <img
                src={profilePic}
                alt="Profile"
                className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-all duration-300"
              />
              {/* Online Dot */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-20"></div>

        {/* Profile Info */}
        <Card className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="flex-1 text-center lg:text-left space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {user?.fullName || 'User Name'}
                </h1>
                <p className="text-lg text-orange-600 font-medium mb-1">
                  @{user?.username || 'username'}
                </p>

                {user?.email && (
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                )}

                {user?.bio && (
                  <p className="text-gray-700 leading-relaxed text-base max-w-2xl">{user.bio}</p>
                )}

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-4">
                  <ConfirmDialog
                    title={user?.isPrivate ? 'Make profile Public' : 'Make profile Private'}
                    actionLabel={user?.isPrivate ? 'Public' : 'Private'}
                    onConfirm={handleProfilePrivacyToggle}
                  >
                    <Button
                      className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300
                      ${
                        user?.isPrivate
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {user?.isPrivate ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Make Public
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          Make Private
                        </>
                      )}
                    </Button>
                  </ConfirmDialog>

                  <Button
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-full transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>

                  <Button
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-full transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Message
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Followers */}
          <Card className="bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-orange-600">
                    {user?.followers?.length || 0}
                  </h3>
                  <p className="text-gray-600 font-medium">Followers</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Following */}
          <Card className="bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-orange-600">
                    {user?.following?.length || 0}
                  </h3>
                  <p className="text-gray-600 font-medium">Following</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral */}
        <ReferralLinkBox referralCode={user?.referralCode || ''} />

        {/* Extra Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Member Since</h4>
              <p className="text-gray-600">
                {user?.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : ''}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Location</h4>
              <p className="text-gray-600">{user?.address?.state}</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
              <h4 className="text-lg font-semibold text-gray-900 mt-2">Status</h4>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
