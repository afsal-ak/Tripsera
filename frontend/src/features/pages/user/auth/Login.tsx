// import React from 'react';

// const Login = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center font-poppins bg-gray-50 px-4">
//       {/* Wrapper with max width */}
//       <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden bg-white">
//         {/* Left Side - Show only on md+ screens */}
//         <div className="hidden md:flex md:w-1/2 bg-primary-light items-center justify-center p-8">
//           <div className="text-center text-white">
//             <h2 className="text-3xl font-bold mb-4">Welcome Back to Picnigo</h2>
// <p className="text-base">
//   Discover unforgettable journeys, explore breathtaking destinations, and turn your travel dreams into reality. Your next adventure starts here!
// </p>

//             {/* <img
//               src="/login-image.jpg"
//               alt="Travel"
//               className="w-full max-w-xs mt-6 mx-auto"
//             /> */}
//           </div>
//         </div>

//         {/* Right Side - Login Form (Always Visible) */}
//         <div className="w-full md:w-1/2 flex items-center justify-center p-8">
//           <form className="w-full max-w-md">
//             <h2 className="text-2xl font-bold text-primary mb-6 text-center">
//               Login to Picnigo
//             </h2>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Email</label>
//               <input
//                 type="email"
//                 className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="Enter your email"
//               />
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium mb-1">Password</label>
//               <input
//                 type="password"
//                 className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="Enter your password"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
//             >
//               Login
//             </button>

//             <p className="mt-4 text-sm text-center">
//               Don&apos;t have an account? <a href="/signup" className="text-primary underline">Sign Up</a>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
//  import { useState } from 'react';
//  import { useNavigate } from 'react-router-dom';
//  import { useDispatch,useSelector } from 'react-redux';
// // import { handleLogin } from '@/features/services/auth/authService';
// import { loginUser } from '@/redux/slices/userAuthSlice';
// import type { AppDispatch, RootState } from '@/redux/store';

// const Login = () => {
//   const navigate=useNavigate()
//   const dispatch = useDispatch<AppDispatch>();

//   const {loading,error,isAuthenticated}=useSelector((state:RootState)=>state.userAuth)

//   const [email,setEmail]=useState('')
//   const [password,setPassword]=useState('')
//  const [error,setError]=useState('')
 
//   // const handleSubmit=async()=>{
//   //   try {
//   //     const {accessToken,user}=await handleLogin(email,password);
//   //     localStorage.setItem("accessToken",accessToken)
//   //     localStorage.setItem('user',JSON.stringify(user))
//   //     navigate('/home')
//   //   } catch (error:any) {
//   //     console.error("Login failed", error);
//   // setError(error.response?.data?.message || "Something went wrong");

//   //   }
//   // }
// const handleSubmit = async () => {
//   try {
//     const trimmedEmail = email.trim();
//     const trimmedPassword = password.trim();

//     if (!trimmedEmail || !trimmedPassword) {
//       setError("Email and password are required");
//       return;
//     }

//     const result = await dispatch(
//       loginUser({ email: trimmedEmail, password: trimmedPassword })
//     ).unwrap();

//     if (result) {
//       navigate("/home");
//     }
//   } catch (error: any) {
//     console.error("Login failed", error);
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center font-poppins bg-background px-4">
//       <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden bg-white">
//         {/* Left Side */}
//         <div className="hidden md:flex md:w-1/2 bg-orange items-center justify-center p-8">
//           <div className="text-center text-white">
//             <h2 className="text-3xl font-bold mb-4">Welcome Back to Picnigo</h2>
//             <p className="text-base leading-relaxed">
//               Discover unforgettable journeys, explore breathtaking destinations, and turn your travel dreams into reality. Your next adventure starts here!
//             </p>
//           </div>
//         </div>

//         {/* Right Side - Login Form */}
//         <div className="w-full md:w-1/2 flex items-center justify-center p-8">
//           <form className="w-full max-w-md" onSubmit={(e)=>{e.preventDefault();
//             handleSubmit()
//           }}>
//             <h2 className="text-2xl font-bold text-orange mb-6 text-center">
//               Login to Picnigo
//             </h2>
//     {error && (
//               <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
//             )}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-foreground mb-1">
//                 Email
//               </label>
//               <input
//                 type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
//                 className="w-full border border-border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
//                 placeholder="Enter your email"
//               />
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-foreground mb-1">
//                 Password
//               </label>
//               <input
//                 type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
//                 className="w-full border border-border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
//                 placeholder="Enter your password"
//               />
//             </div>

//              <button
//               type="submit"
//               className="w-full bg-orange text-white py-2 rounded hover:bg-orange-dark transition"
//             >
//                {loading ? 'Logging in...' : 'Login'}
//               Login
//             </button>

//             <p className="mt-4 text-sm text-center text-muted-foreground">
//               Don&apos;t have an account?{" "}
//               <a href="/signup" className="text-orange underline">
//                 Sign Up
//               </a>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/redux/slices/userAuthSlice';
import type { AppDispatch, RootState } from '@/redux/store';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.userAuth
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setLocalError('Email and password are required');
      return;
    }

    setLocalError(''); 

    try {
      const result=await dispatch(loginUser({ email: trimmedEmail, password: trimmedPassword })).unwrap();
       toast.success("Login successful"); 
    } catch (err:any) {
      console.error("Login error (handled in Redux):", err);
      toast.error(err)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins bg-background px-4">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden bg-white">
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-orange items-center justify-center p-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Welcome Back to Picnigo</h2>
            <p className="text-base leading-relaxed">
              Discover unforgettable journeys, explore breathtaking destinations, and turn your travel dreams into reality. Your next adventure starts here!
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <form
            className="w-full max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h2 className="text-2xl font-bold text-orange mb-6 text-center">
              Login to Picnigo
            </h2>

            {(localError || error) && (
              <p className="text-sm text-red-500 mb-4 text-center">
                {localError || error}
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange text-white py-2 rounded hover:bg-orange-dark transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="mt-4 text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-orange underline">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
