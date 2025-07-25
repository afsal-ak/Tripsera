import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleVerifyOtp, handleForgotPassword } from '@/features/services/auth/authService';
import { toast } from 'sonner';
import { useOtpTimer } from '@/features/hooks/useOtpTimer';
import { Loader2 } from 'lucide-react';

const ForgotOtpPage = () => {
  const navigate = useNavigate();
  const { timeLeft, formattedTime, isExpired, startTimer } = useOtpTimer();

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('forgotEmail');
    const existingExpiry = localStorage.getItem('otp_expiry_timestamp');

    if (storedEmail) {
      setEmail(storedEmail);
      if (!existingExpiry) {
        startTimer();
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    if (isExpired) {
      toast.error('OTP expired. Please resend.');
      return;
    }

    try {
      setLoading(true);
      const res = await handleVerifyOtp(email, otp);
      const token = res.token;

      localStorage.setItem('forgotToken', token);
      localStorage.removeItem('forgotEmail');
      localStorage.removeItem('otp_expiry_timestamp');

      navigate('/forgot-password/change-password');
      toast.success('OTP verification successful');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (!email) return;
      await handleForgotPassword(email);
      toast.success('OTP resent successfully');
      startTimer();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-darkText text-center">Verify OTP</h2>

        <p className="text-sm text-muted-foreground text-center">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter OTP"
            className="w-full text-center tracking-widest border border-border rounded-md py-2"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange text-white font-medium py-2 rounded-md hover:bg-orange-dark transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Didn’t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={!isExpired}
            className={`font-semibold ${
              isExpired ? 'text-orange hover:underline' : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            {isExpired ? 'Resend' : `Resend in ${formattedTime}`}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotOtpPage;
