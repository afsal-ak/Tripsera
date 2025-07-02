

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
 import { handlePreRegister } from "@/features/services/auth/authService"; 
import GoogleLoginButton from "@/features/components/GoogleLoginButton";
import { toast } from "sonner";
 
const Signup = () => {
   const navigate = useNavigate();

   const [email,setEmail]=useState<string>('')
   const [username,setUsername]=useState<string>('')
   const [password,setPassword]=useState<string>('')
   const [confirmPassword,setConfirmPassword]=useState<string>('')
  const [loading,setLoading]=useState(false)


  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newErrors = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    };

    if (!email.includes("@")) {
      newErrors.email = "Invalid email";
    }

 
if (!username.trim()) {
  newErrors.username = "Username is required";
} else if (username.length < 3 || username.length > 20) {
  newErrors.username = "Username must be 3–20 characters long";
} else if (!/^[a-zA-Z0-9._]+$/.test(username)) {
  newErrors.username = "Username can only contain letters, numbers, dot (.), or underscore (_)";
} else if (/^[._]/.test(username)) {
  newErrors.username = "Username cannot start with a dot (.) or underscore (_)";
} else if (/[._]$/.test(username)) {
  newErrors.username = "Username cannot end with a dot (.) or underscore (_)";
} else if (/([._])\1/.test(username)) {
  newErrors.username = "Username cannot contain consecutive dots or underscores";
}
 


    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Minimum 6 characters with one letter, one number, and one special character";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

   
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()){
      return;
    } 
setLoading(true)
    try {
      const result = await handlePreRegister(email,username,password)
      localStorage.setItem('signupEmail',email)
      toast.success( "OTP sent to your email");
      console.log(email,'preregistration')
 
      navigate("/verify-otp");
 
     } catch (error: any) {
      console.log(error,'front')
      toast.error(error.response?.data?.message || "Signup failed");
    }finally{
      setLoading(false)

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins bg-gray-50 px-4">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden bg-white">
        
         <div className="hidden md:flex md:w-1/2 bg-orange items-center justify-center p-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Picnigo Today</h2>
            <p className="text-base">
              Start your journey with us — explore amazing destinations, connect
              with fellow travelers, and book unforgettable experiences.
            </p>
          </div>
        </div>

         <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-orange mb-6 text-center">
              Create an Account
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                name="username"
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Enter username"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                name="password"
                type="password"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Create a password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

                <button
        type="submit"
        className="w-full bg-orange text-white py-2 rounded hover:bg-orange-dark transition mb-4 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        )}
        {loading ? "Processing..." : "Sign Up"}
      </button>



            {/* <button
              type="button"
              className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
            >
              <img
                src="/google-logo.png"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
            </button> */}
            <div className="my-4 text-center text-sm text-muted-foreground">
  or
</div>
<div className="w-64 mx-auto flex items-center justify-center py-2 rounded  transition">
  <GoogleLoginButton />
</div>
            <p className="mt-4 text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-orange underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
