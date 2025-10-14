import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export const useCurrentUser = () => {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const admin = useSelector((state: RootState) => state.adminAuth.admin);
 
  // Pick the first logged-in role
  const current = user || admin ;

  return {
    id: current?._id || null,
    role: user ? "user" : admin ? "admin" : null,
    username: current?.username,
    profilePic:current?.profileImage?.url,
    data: current,
  };
};
