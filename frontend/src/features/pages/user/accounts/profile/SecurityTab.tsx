import { Input } from '@/features/components/ui/Input';
import { Label } from '@/features/components/ui/Lable';
import { Button } from '@/features/components/Button';
import { requestEmailChange, passwordChange } from '@/features/services/user/profileService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOtpTimer } from '@/features/hooks/useOtpTimer';

const SecurityTab = () => {
  const { startTimer } = useOtpTimer();

  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ password?: string; confirm?: string }>({});

  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || newEmail.trim() === '') {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const emailChange = await requestEmailChange(newEmail);
      localStorage.setItem('newEmail', newEmail);
      startTimer();
      navigate('/account/verify-otp');

      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'something went wrong');
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    setLoadingPassword(true);
    e.preventDefault();
    if (!currentPassword || currentPassword.trim() === '') {
      toast.error('Please enter a valid password.');
      return;
    }

    const trimmedPassword = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    const errors: { password?: string; confirm?: string } = {};

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    if (!passwordRegex.test(trimmedPassword)) {
      errors.password =
        'Password must be at least 6 characters, include one letter, one number, and one special character.';
    }

    if (trimmedPassword !== trimmedConfirm) {
      errors.confirm = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      const response = await passwordChange(currentPassword, newPassword);
      toast.success('password changed successfully');
      navigate('/account/profile');
    } catch (error: any) {
      toast.error(error.response.data.message || 'Failed to reset password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <form onSubmit={handleEmailSubmit}>
          <Label htmlFor="newEmail">New Email</Label>
          <Input
            name="email"
            type="email"
            value={newEmail}
            onChange={handleEmailChange}
            placeholder="Enter new email"
          />
          <Button type="submit" disabled={loading} className="mt-2">
            {' '}
            {loading ? 'Loading...' : 'Send Otp'}
          </Button>
        </form>
      </div>
      <form onSubmit={handlePasswordSubmit}>
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type="password"
            placeholder="Current password"
          />
        </div>
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="New password"
          />
          {formErrors.password && (
            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
          )}
        </div>
        <div>
          <Label htmlFor="confirm password">Coonfirm Password</Label>
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="New password"
          />
          {formErrors.confirm && <p className="text-red-500 text-xs mt-1">{formErrors.confirm}</p>}
        </div>
        <Button>{loadingPassword ? 'Loading...' : 'Change Password'}</Button>
      </form>
    </div>
  );
};

export default SecurityTab;
