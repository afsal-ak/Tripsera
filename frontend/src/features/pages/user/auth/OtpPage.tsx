// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import type{  AppDispatch,RootState } from "@/redux/store";
// import { verifyAndRegisterUser, resendOtp } from "@/redux/slices/signupSlice";
// import { toast } from "sonner";
// import { Button } from "@/features/components/Button";
// import { Input } from "@/features/components/ui/Input";
// import { useDispatch, useSelector } from "react-redux";
// const VerifyOtp = () => {
//   const [otp, setOtp] = useState("");
//   const [resendLoading, setResendLoading] = useState(false);

//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { email, username } = useSelector((state:RootState) => state.signup);
//   const password = location.state?.password;

//   // if user reloads and email is gone, redirect
//   useEffect(() => {
//     if (!email || !username || !password) {
//       navigate("/signup");
//     }
//   }, [email, username, password, navigate]);

//   const handleVerify = async () => {
//     if (!otp || otp.length !== 6) {
//       toast.error("Enter valid 6-digit OTP");
//       return;
//     }

//     try {
//       await dispatch(
//         verifyAndRegisterUser({ email, username, password, otp })
//       ).unwrap();

//       toast.success("Registration successful!");
//       navigate("/login");
//     } catch (err: any) {
//       toast.error(err?.message || "OTP verification failed");
//     }
//   };

//   const handleResend = async () => {
//     setResendLoading(true);
//     try {
//       await dispatch(resendOtp({ email })).unwrap();
//       toast.success("OTP resent to your email");
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to resend OTP");
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
//         <h2 className="mb-4 text-center text-2xl font-bold">Verify OTP</h2>
//         <p className="mb-6 text-center text-sm text-muted-foreground">
//           We've sent a 6-digit OTP to your email: <strong>{email}</strong>
//         </p>

//         <Input
//           type="text"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           placeholder="Enter OTP"
//           className="mb-4 text-center tracking-widest"
//         />

//         <Button className="w-full mb-2" onClick={handleVerify}>
//           Verify OTP
//         </Button>

//         <Button
//           variant="ghost"
//           className="w-full text-sm text-blue-600"
//           onClick={handleResend}
//           disabled={resendLoading}
//         >
//           {resendLoading ? "Resending..." : "Resend OTP"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default VerifyOtp;
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { AppDispatch, RootState } from "@/redux/store";
import { verifyAndRegisterUser, resendOtp } from "@/redux/slices/signupSlice";
import { toast } from "sonner";
import { Button } from "@/features/components/Button";
import { Input } from "@/features/components/ui/Input";
import { useDispatch, useSelector } from "react-redux";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const signup = useSelector((state: RootState) => state.signup);
  const email = signup.email;
  const username = signup.username;
  const password = location.state?.password as string | undefined;

  // Redirect if required fields are missing
  useEffect(() => {
    if (!email || !username || !password) {
      navigate("/signup");
    }
  }, [email, username, password, navigate]);

  // Stop rendering if any field is missing
  if (!email || !username || !password) return null;

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      await dispatch(
        verifyAndRegisterUser({
          email,
          username,
          password,
          otp,
        })
      ).unwrap();

      toast.success("Registration successful!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await dispatch(resendOtp({ email })).unwrap();
      toast.success("OTP resent to your email");
    } catch (err: any) {
      toast.error(err?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-bold">Verify OTP</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          We've sent a 6-digit OTP to your email: <strong>{email}</strong>
        </p>

        <Input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="mb-4 text-center tracking-widest"
        />

        <Button className="w-full mb-2" onClick={handleVerify}>
          Verify OTP
        </Button>

        <Button
          variant="ghost"
          className="w-full text-sm text-blue-600"
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyOtp;
