import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/redux/slices/userAuthSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import GoogleLoginButton from '@/components/user/GoogleLoginButton';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.userAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      //   console.log(isAuthenticated,'isAuth')

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
      await dispatch(loginUser({ email: trimmedEmail, password: trimmedPassword })).unwrap();
      toast.success('Login successful');
    } catch (err: any) {
      console.error('Login error (handled in Redux):', err);
      toast.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins bg-background px-4">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden bg-white">
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-orange items-center justify-center p-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Welcome Back to Tripsera</h2>
            <p className="text-base leading-relaxed">
              Discover unforgettable journeys, explore breathtaking destinations, and turn your
              travel dreams into reality. Your next adventure starts here!
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
            <h2 className="text-2xl font-bold text-orange mb-6 text-center">Login to Tripsera</h2>

            {(localError || error) && (
              <p className="text-sm text-red-500 mb-4 text-center">{localError || error}</p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="Enter your password"
              />
              <div className="mb-6 text-right">
                <Link to="/forgot-password" className="text-sm text-orange hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange text-white py-2 rounded hover:bg-orange-dark transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="my-4 text-center text-sm text-muted-foreground">or</div>
            <div className="w-64 mx-auto flex items-center justify-center py-2 rounded  transition">
              <GoogleLoginButton />
            </div>

            <p className="mt-4 text-sm text-center text-muted-foreground">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-orange hover:underline">
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
