import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import type { IUser } from '@/types/IUser';
import { getUserProfile } from '@/services/user/profileService';
import { toast } from 'sonner';

import EditProfileTab from './EditProfileTab';
import SecurityTab from './SecurityTab';
import AddressTab from './AddressTab';
import Dashboard from './Dashboard';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setUser(response.userProfile);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-4">
      <div className="max-w-5xl mx-auto">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">



          {/* ✅ TABLET + DESKTOP TABS */}
          <TabsList className="grid grid-cols-4 gap-2 border-black w-full mb-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Dashboard
            </TabsTrigger>

            <TabsTrigger value="edit" className="text-xs sm:text-sm">
              Edit
            </TabsTrigger>

            <TabsTrigger value="address" className="text-xs sm:text-sm">
              Address
            </TabsTrigger>

            <TabsTrigger value="security" className="text-xs sm:text-sm">
              Security
            </TabsTrigger>
          </TabsList>
          {/* ✅ CONTENT */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">

            <TabsContent value="overview">
              <Dashboard user={user} loading={loading} refetchUser={getUserInfo} />
            </TabsContent>

            <TabsContent value="edit">
              <EditProfileTab user={user} loading={loading} refetchUser={getUserInfo} />
            </TabsContent>

            <TabsContent value="address">
              <AddressTab user={user} loading={loading} refetchUser={getUserInfo} />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>

          </div>

        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { useState, useEffect } from 'react';
// import type { IUser } from '@/types/IUser';
// import { getUserProfile } from '@/services/user/profileService';
// import { toast } from 'sonner';
// import EditProfileTab from './EditProfileTab';
// import SecurityTab from './SecurityTab';
// import AddressTab from './AddressTab';
// import Dashboard from './Dashboard';
// const Profile = () => {
//   const [user, setUser] = useState<IUser>();
//   const [loading, setLoading] = useState(true);

//   const getUserInfo = async () => {
//     try {
//       setLoading(true);
//       const response = await getUserProfile();
//       setUser(response.userProfile);
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || 'Failed to fetch user data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getUserInfo();
//   }, []);

//   return (
//     <div className="w-full px-3 sm:px-6 lg:px-8 py-4">

//       <div className="max-w-5xl mx-auto">

//         <Tabs defaultValue="overview" className="w-full">

//           {/* 🔥 MOBILE FRIENDLY TABS */}
//           <TabsList className="
//             flex 
//             gap-2 
//             border-b 
//             mb-6 
//             overflow-x-auto 
//             whitespace-nowrap 
//             no-scrollbar
//             pb-2
//           ">
//             <TabsTrigger value="overview" className="min-w-fit">
//               Dashboard
//             </TabsTrigger>

//             <TabsTrigger value="edit" className="min-w-fit">
//               Edit Profile
//             </TabsTrigger>

//             <TabsTrigger value="address" className="min-w-fit">
//               Address
//             </TabsTrigger>

//             <TabsTrigger value="security" className="min-w-fit">
//               Security
//             </TabsTrigger>
//           </TabsList>

//           {/* 🔥 CONTENT WRAPPER */}
//           <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">

//             <TabsContent value="overview" className="mt-0">
//               <Dashboard user={user} loading={loading} refetchUser={getUserInfo} />
//             </TabsContent>

//             <TabsContent value="edit" className="mt-0">
//               <EditProfileTab user={user} loading={loading} refetchUser={getUserInfo} />
//             </TabsContent>

//             <TabsContent value="address" className="mt-0">
//               <AddressTab user={user} loading={loading} refetchUser={getUserInfo} />
//             </TabsContent>

//             <TabsContent value="security" className="mt-0">
//               <SecurityTab />
//             </TabsContent>

//           </div>

//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default Profile;
