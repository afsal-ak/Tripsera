import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleForgotPassword } from '@/services/auth/authService';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleForgotPassword(email);
      localStorage.setItem('forgotEmail', email);
      navigate('/forgot-password/verfy-otp');
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-darkText text-center">Forgot Password</h2>
        <p className="text-sm text-muted-foreground text-center">
          Enter your email and we’ll send you a reset OTP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-darkText mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-2 border border-border rounded-md bg-bg focus:outline-none focus:ring-2 focus:ring-orange"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange text-white font-medium py-2 rounded-md hover:bg-orange-dark transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              'Send Reset OTP'
            )}
          </button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          Remember your password?{' '}
          <a href="/login" className="text-orange hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
