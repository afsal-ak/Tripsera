import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@//components/ui/tabs";
import { useState, useEffect } from "react";
import type { IUser } from "@/features/types/IUser";
import { getUserProfile } from "@/features/services/user/profileService";
import { toast } from "sonner";
import EditProfileTab from "./EditProfileTab";
import SecurityTab from "./SecurityTab";
import AddressTab from "./AddressTab";
import Dashboard from "./Dashboard";

const Profile = () => {
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        setUser(response.userProfile);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    getUserInfo();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex gap-2 border-b mb-6 overflow-x-auto">
          <TabsTrigger value="overview" className="px-4 py-2">Dashboared</TabsTrigger>
          <TabsTrigger value="edit" className="px-4 py-2">Edit Profile</TabsTrigger>
          <TabsTrigger value="address" className="px-4 py-2">Address</TabsTrigger>
          <TabsTrigger value="security" className="px-4 py-2">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Dashboard user={user} loading={loading} />
        </TabsContent>
        <TabsContent value="edit">
          <EditProfileTab user={user} loading={loading} />
        </TabsContent>
        <TabsContent value="address">
          <AddressTab user={user} loading={loading} />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab  />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
