import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { loginUser } from '@/redux/slices/userAuthSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import GoogleLoginButton from '@/components/user/GoogleLoginButton';
import { useAuthModal } from '@/context/AuthModalContext';
import { useNavigate } from 'react-router-dom';
import { useAppSnackbar } from '@/hooks/useSnackbar';
import { Eye, EyeOff } from 'lucide-react'; // 👈 added

const LoginModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const snackbar = useAppSnackbar();

    const { closeLogin } = useAuthModal();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state: RootState) => state.userAuth);

    const [email, setEmail] = useState('user@tripsera.com');
    const [password, setPassword] = useState('Asd@1234');
    const [localError, setLocalError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 👈 added

    const handleSubmit = async () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword) {
            setLocalError('Email and password are required');
            return;
        }

        setLocalError('');

        try {
            await dispatch(loginUser({ email: trimmedEmail, password: trimmedPassword })).unwrap();
            snackbar.success('Login successful');
            closeLogin();
        } catch (err: any) {
            snackbar.error(err || 'Login Failed');
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row w-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl">

                {/* Left Side */}
                <div className="hidden lg:flex lg:w-1/2 bg-orange items-center justify-center p-8">
                    <div className="text-center text-white">
                        <h2 className="text-2xl font-bold mb-3">Welcome Back 👋</h2>
                        <p className="text-sm leading-relaxed">
                            Explore destinations, plan trips, and manage your bookings easily.
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full lg:w-1/2 p-5 sm:p-8">
                    <h2 className="text-2xl font-bold text-orange mb-5 text-center">
                        Login to Tripsera
                    </h2>

                    {(localError || error) && (
                        <p className="text-sm text-red-500 mb-4 text-center">
                            {localError || error}
                        </p>
                    )}

                    {/* Email */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-3 
                        focus:outline-none focus:ring-2 focus:ring-orange transition"
                    />

                    {/* Password with Eye */}
                    <div className="relative mb-4">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 px-4 py-2 pr-10 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-orange transition"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Forgot password */}
                    <div className="text-right mb-4">
                        <button
                            onClick={() => {
                                closeLogin();
                                navigate('/forgot-password');
                            }}
                            className="text-sm text-orange hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Login button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-orange text-white py-2.5 rounded-lg 
                        hover:bg-orange-dark transition font-medium"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center my-5">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="px-3 text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    {/* Google */}
                    <div className="flex justify-center mb-4">
                        <GoogleLoginButton />
                    </div>

                    {/* Signup */}
                    <p className="text-sm text-center text-gray-600">
                        Don’t have an account?{' '}
                        <button
                            onClick={() => {
                                closeLogin();
                                navigate('/signup');
                            }}
                            className="text-orange font-medium hover:underline"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'sonner';
// import { loginUser } from '@/redux/slices/userAuthSlice';
// import type { AppDispatch, RootState } from '@/redux/store';
// import GoogleLoginButton from '@/components/user/GoogleLoginButton';
// import { useAuthModal } from '@/context/AuthModalContext';
// import { useNavigate } from 'react-router-dom';
// import { useAppSnackbar } from '@/hooks/useSnackbar';

// const LoginModal = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const snackbar = useAppSnackbar();

//     const { closeLogin } = useAuthModal();
//     const navigate = useNavigate();

//     const { loading, error } = useSelector((state: RootState) => state.userAuth);

//     const [email, setEmail] = useState('user@tripsera.com');
//     const [password, setPassword] = useState('Asd@1234');
//     const [localError, setLocalError] = useState('');

//     const handleSubmit = async () => {
//         const trimmedEmail = email.trim();
//         const trimmedPassword = password.trim();

//         if (!trimmedEmail || !trimmedPassword) {
//             setLocalError('Email and password are required');
//             return;
//         }

//         setLocalError('');

//         try {
//             await dispatch(loginUser({ email: trimmedEmail, password: trimmedPassword })).unwrap();
//             snackbar.success('Login successful');
//             //toast.success('Login successful');
//             closeLogin();
//         } catch (err: any) {
//             snackbar.error(err || 'Login Failed');
//             //toast.error(err);
//         }
//     };

//     return (
//         <div className="w-full">
//             <div className="flex flex-col lg:flex-row w-full bg-white rounded-xl overflow-hidden">

//                 {/* Left Side (Desktop only) */}
//                 <div className="hidden lg:flex lg:w-1/2 bg-orange items-center justify-center p-8">
//                     <div className="text-center text-white">
//                         <h2 className="text-2xl font-bold mb-3">Welcome Back 👋</h2>
//                         <p className="text-sm leading-relaxed">
//                             Explore destinations, plan trips, and manage your bookings easily.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Right Side */}
//                 <div className="w-full lg:w-1/2 p-5 sm:p-8">
//                     <h2 className="text-2xl font-bold text-orange mb-5 text-center">
//                         Login to Tripsera
//                     </h2>

//                     {(localError || error) && (
//                         <p className="text-sm text-red-500 mb-4 text-center">
//                             {localError || error}
//                         </p>
//                     )}

//                     {/* Email */}
//                     <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="Enter your email"
//                         className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-3 
//                        focus:outline-none focus:ring-2 focus:ring-orange transition"
//                     />

//                     {/* Password */}
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Enter your password"
//                         className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 
//                        focus:outline-none focus:ring-2 focus:ring-orange transition"
//                     />

//                     {/* Forgot password */}
//                     <div className="text-right mb-4">
//                         <button
//                             onClick={() => {
//                                 closeLogin();
//                                 navigate('/forgot-password');
//                             }}
//                             className="text-sm text-orange hover:underline"
//                         >
//                             Forgot password?
//                         </button>
//                     </div>

//                     {/* Login button */}
//                     <button
//                         onClick={handleSubmit}
//                         className="w-full bg-orange text-white py-2.5 rounded-lg 
//                        hover:bg-orange-dark transition font-medium"
//                     >
//                         {loading ? 'Logging in...' : 'Login'}
//                     </button>

//                     {/* Divider */}
//                     <div className="flex items-center my-5">
//                         <div className="flex-1 h-px bg-gray-300" />
//                         <span className="px-3 text-sm text-gray-500">or</span>
//                         <div className="flex-1 h-px bg-gray-300" />
//                     </div>

//                     {/* Google */}
//                     <div className="flex justify-center mb-4">
//                         <GoogleLoginButton />
//                     </div>

//                     {/* Signup */}
//                     <p className="text-sm text-center text-gray-600">
//                         Don’t have an account?{' '}
//                         <button
//                             onClick={() => {
//                                 closeLogin();
//                                 navigate('/signup'); // or switch modal later
//                             }}
//                             className="text-orange font-medium hover:underline"
//                         >
//                             Sign up
//                         </button>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginModal;
