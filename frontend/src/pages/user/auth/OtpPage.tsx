import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleVerifyAndRegister, handleResendOtp } from '@/services/auth/authService';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { useOtpTimer } from '@/hooks/useOtpTimer';
const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);

  const { timeLeft, formattedTime, isExpired, startTimer } = useOtpTimer();

  const navigate = useNavigate();

  useEffect(() => {
    const signupEmail = localStorage.getItem('signupEmail');

    console.log(signupEmail, 'emial');
    if (signupEmail) {
      setEmail(signupEmail);
    }
  }, []);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Enter a valid 6-digit OTP');
      return;
    }
    if (isExpired) {
      toast.error('OTP expired. Please resend.');
      return;
    }

    setLoading(true);
    try {
      await handleVerifyAndRegister(email, otp);
      toast.success('Registration successful!');
      localStorage.removeItem('signupEmail');
      localStorage.removeItem('otp_expiry_timestamp');

      navigate('/login');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    setResendLoading(true);
    try {
      await handleResendOtp(email);
      toast.success('OTP resent to your email');
      startTimer();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to resend OTP');
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
        >
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter OTP"
            className="mb-4 text-center tracking-widest"
          />

          <Button
            className="w-full mb-2 bg-orange"
            onClick={handleVerify}
            disabled={otp.length !== 6 || loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          {/* <Button
          variant="ghost"
          className="w-full text-sm text-blue-600"
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </Button> */}
          <p className="text-sm text-center text-muted-foreground">
            Didn’t receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={!isExpired || resendLoading}
              className={`font-semibold transition ${
                isExpired && !resendLoading
                  ? 'text-orange hover:underline'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {resendLoading
                ? 'Resending...'
                : isExpired
                  ? 'Resend OTP'
                  : `Resend in ${formattedTime}`}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
