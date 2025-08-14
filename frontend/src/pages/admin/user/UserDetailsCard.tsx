import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Mail, User, Calendar, Users, UserCheck, Award, Shield,Loader2 } from "lucide-react";
import type { IUser } from "@/types/IUser";
import { InfoRow } from "@/components/InfoRow";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface UserDetailsProps {
  userData: IUser,
  onToggleBlock: (id: string, newStatus: boolean) => void;
}

const UserDetailsCard = (
  { userData, onToggleBlock }: UserDetailsProps) => {
 
  return (
    <Card className="max-w-full mx-auto shadow-lg border rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Details</h1>
       
        <ConfirmDialog
            title="Change   user status?"
            actionLabel={userData?.isBlocked ? "Unblock" : "Block"}
            onConfirm={() => {
              if (!userData?._id) return;
              onToggleBlock(userData._id, !userData.isBlocked);
            }}
          >
            <Button>{userData?.isBlocked ? "Unblock" : "Block"}</Button>
          </ConfirmDialog>
          
       </div>
      {/* Profile Header */}
      <CardHeader className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
        <div className="relative">
          <img
            src={userData.profileImage?.url || "/profile-default.jpg"}
            alt={userData.username}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        <CardTitle className="mt-4 text-xl font-bold">
          {userData.fullName || userData.username}
        </CardTitle>
        <Badge
          variant={userData.isBlocked ? "destructive" : "secondary"}
          className="mt-2 px-3 py-1 text-xs"
        >
          {userData.isBlocked ? "Blocked" : "Active"}
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <InfoRow icon={<User size={16} />} label="Username" value={userData.username} />
          <InfoRow icon={<Mail size={16} />} label="Email" value={userData.email} />
          <InfoRow icon={<Shield size={16} />} label="Role" value={userData.role} />
          <InfoRow icon={<User size={16} />} label="Phone Number" value={userData.phone?.toString()} />

          {userData.dob && (
            <InfoRow
              icon={<Calendar size={16} />}
              label="DOB"
              value={new Date(userData.dob).toLocaleDateString()}
            />
          )}
          {userData.gender && (
            <InfoRow
              icon={<UserCheck size={16} />}
              label="Gender"
              value={userData.gender}
            />
          )}
          <InfoRow
            icon={<Users size={16} />}
            label="Followers"
            value={userData?.followersCount.toString()}
          />
          <InfoRow
            icon={<Users size={16} />}
            label="Following"
            value={userData?.followingCount.toString()}
          />
          {userData.referralCode && (
            <InfoRow
              icon={<Award size={16} />}
              label="Referral Code"
              value={userData.referralCode}
            />
          )}

        </div>
      </CardContent>
    </Card>
  );
}


export default UserDetailsCard