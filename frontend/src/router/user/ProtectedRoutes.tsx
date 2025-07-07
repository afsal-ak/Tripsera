import { Route } from "react-router-dom";
import UserProtectedRoutes from "./UserProtectedRoute";
import Home from "@/features/pages/user/home/Home";
//import Profile from "@/features/pages/user/profile/Profile";
//import Wishlist from "@/features/pages/user/wishlist/Wishlist";
//import Home from "@/features/pages/user/home/Home";
 const ProtectedRoutes = (
  
  <Route element={<UserProtectedRoutes />}>
    <Route path="/home" element={<Home />} />
    {/* <Route path="/profile" element={<Profile />} />
    <Route path="/wishlist" element={<Wishlist />} /> */}
  </Route>
);

export default ProtectedRoutes;
