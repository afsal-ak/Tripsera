// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import UserProtectedRoutes from "./user/UserProtectedRoute";
// import RedirectIfAuth from "./user/RedirectIfAuth ";
// import Home from "@/features/pages/user/home/Home";
//  import Login from "@/features/pages/user/auth/Login";
//  import PackageDetails from "@/features/pages/user/packages/pages/PackageDetail";
// import Packages from "@/features/pages/user/packages/pages/Packages";
// import Signup from "@/features/pages/user/auth/Signup";
// import VerifyOtp from "@/features/pages/user/auth/OtpPage";
// import ForgotPassword from "@/features/pages/user/auth/ForgotPassword";
//  import ForgotOtpPage from "@/features/pages/user/auth/ForgotOtpPage";
//  import NewPasswordPage from "@/features/pages/user/auth/NewPasswordPage";
// const UserRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/verify-otp" element={<VerifyOtp />} />

//       <Route path="/forgot-password" element={<ForgotPassword/>}/>
//       <Route path="/forgot-password/verfy-otp" element={<ForgotOtpPage/>}/>
//       <Route path="/forgot-password/change-password" element={<NewPasswordPage/>}/>

//       <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
//       <Route path="/" element={<Home/>}/>
//       <Route path="/home" element={<UserProtectedRoutes><Home/></UserProtectedRoutes>}/>
//       <Route path="/packages" element={<UserProtectedRoutes><Packages/></UserProtectedRoutes>}  />
//       <Route path="/packages/:id" element={<UserProtectedRoutes><PackageDetails/></UserProtectedRoutes>} />
//       {/* <Route path="/signup" element={<Signup />} /> */}
//     </Routes>
//   );
// };

// export default UserRoutes;
