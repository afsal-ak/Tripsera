import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserDetailsCard from "./UserDetailsCard";
import { Button } from "@/components/ui/button";
import { fetchUserDetails, toggleBlockUser } from "@/services/admin/userService";
import { Loader2 } from "lucide-react";
import type { IUser } from "@/types/IUser";
 

export default function UserDetailsPage() {
    const { id } = useParams();
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetchUserDetails(id);
                setUser(res.user);
            } catch (err) {
                console.error("Failed to fetch user details:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleToggleBlock = async () => {
        if (!user) return;
        try {
            const updatedStatus = !user.isBlocked;
            await toggleBlockUser(user?._id!);
            setUser((prev) => prev ? { ...prev, isBlocked: updatedStatus } : null);
        } catch (err) {
            console.error("Failed to update block status:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
        );
    }

    if (!user) {
        return <p className="text-center mt-10 text-red-500">User not found.</p>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">

            <UserDetailsCard
                userData={user!}
                onToggleBlock={handleToggleBlock}
            />
        </div>
    );
}
