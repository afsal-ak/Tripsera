
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '@/redux/slices/adminAuthSlice';
import type { AppDispatch, RootState } from '@/redux/store';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.adminAuth
  );
  const accessToken = useSelector((state: RootState) => state.adminAuth.accessToken);
console.log({accessToken})
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // Redirect to /home if already logged in

  
  useEffect(() => {
    const token = accessToken
    if (token) {
      //  If token exists, redirect to dashboard
      navigate("/admin/dashboard", { replace: true });
      console.log(token)
    }
  }, [accessToken,navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setLocalError('Email and password are required');
      return;
    }

    setLocalError(''); // clear local error

    try {
      const result=await dispatch(loginAdmin({ email: trimmedEmail, password: trimmedPassword })).unwrap();
       toast.success("Login successful"); 
      // Redux handles setting auth, and redirect happens via useEffect
    } catch (err:any) {
      // Don't do anything here — error is already handled in Redux state
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
              Admin Login 
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
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Enter your email"
                  autoComplete="email"

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

export default AdminLogin;
