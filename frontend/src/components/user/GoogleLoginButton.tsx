import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { handleGoogleLogin } from '@/services/auth/authService';
import { setUser } from '@/redux/slices/userAuthSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSuccess = async (credentialResponse: any) => {
    const { credential } = credentialResponse;

    if (!credential) {
      return toast.error('Google login failed');
    }
    try {
      const res = await handleGoogleLogin(credential);
      const { user, accessToken } = res;

      dispatch(setUser({ user, accessToken }));
      // console.log(accessToken,'from google')

      toast.success('Logged in with Google');
      navigate('/home');
    } catch (error: any) {
      toast.error('Google login failed');
    }
  };

  return (
    <GoogleLogin onSuccess={handleSuccess} onError={() => toast.error('Google Login Failed')} />
  );
};

export default GoogleLoginButton;
