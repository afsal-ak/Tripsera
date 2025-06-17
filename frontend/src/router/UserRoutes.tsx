import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/features/pages/user/home/Home";
 import Login from "@/features/pages/user/auth/Login";
 import PackageDetails from "@/features/pages/user/packages/pages/PackageDetail";
import Packages from "@/features/pages/user/packages/pages/Packages";
import Signup from "@/features/pages/user/auth/Signup";
import VerifyOtp from "@/features/pages/user/auth/OtpPage";
// Import your pages
// import UserLogin from "@/features/user/auth/pages/Login";
// import Signup from "@/features/user/auth/pages/Signup";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home/>}/>
      <Route path="/Home" element={<Home/>}/>
      <Route path="/packages" element={<Packages/>} />
      <Route path="/packages/:id" element={<PackageDetails/>} />
      {/* <Route path="/signup" element={<Signup />} /> */}
    </Routes>
  );
};

export default UserRoutes;
