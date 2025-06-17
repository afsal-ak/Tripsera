import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
 import { useDispatch } from "react-redux";
 import type { AppDispatch, RootState } from '@/redux/store';

import { toast } from "sonner";
 import { preRegisterUser } from "@/redux/slices/signupSlice";

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

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

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

   //

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Minimum 6 characters with one letter, one number, and one special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await dispatch(
        preRegisterUser({
          email: formData.email,
          username: formData.username,
          password: formData.password, // ✅ pass password

        })
      ).unwrap();

      toast.success( "OTP sent to your email");
      navigate("/verify-otp", {
        state: {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        },
      });
    } catch (err: any) {
      console.log(err,'front')
      toast.error(err || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins bg-gray-50 px-4">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden bg-white">
        {/* Left Side - Only on md+ */}
        <div className="hidden md:flex md:w-1/2 bg-orange items-center justify-center p-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Picnigo Today</h2>
            <p className="text-base">
              Start your journey with us — explore amazing destinations, connect
              with fellow travelers, and book unforgettable experiences.
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-orange mb-6 text-center">
              Create an Account
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                name="username"
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Enter your name"
                value={formData.username}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
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
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange text-white py-2 rounded hover:bg-orange-dark transition mb-4"
            >
              Sign Up
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
            >
              <img
                src="/google-logo.png"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
            </button>

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
