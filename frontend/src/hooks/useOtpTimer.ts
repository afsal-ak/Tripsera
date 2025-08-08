import { useEffect, useState } from 'react';

const OTP_EXPIRY_MINUTES = 5;
const OTP_TIMER_KEY = 'otp_expiry_timestamp';

export const useOtpTimer = (onExpire?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(0);

  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');

    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Start a new timer and store expiry in localStorage
  const startTimer = () => {
    const expiryTime = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
    localStorage.setItem(OTP_TIMER_KEY, expiryTime.toString());
    updateTimeLeft();
  };

  // Update the remaining time
  const updateTimeLeft = () => {
    const expiry = parseInt(localStorage.getItem(OTP_TIMER_KEY) || '0', 10);
    const now = Date.now();
    const diff = Math.floor((expiry - now) / 1000);

    if (diff <= 0) {
      localStorage.removeItem(OTP_TIMER_KEY); // Optional cleanup
      setTimeLeft(0);
    } else {
      setTimeLeft(diff);
    }
  };

  // Watch for timer expiry and handle updates every second
  useEffect(() => {
    const expiry = localStorage.getItem(OTP_TIMER_KEY);

    if (!expiry) {
      startTimer();
    } else {
      updateTimeLeft();
    }

    const interval = setInterval(() => {
      updateTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Optional callback on expiry
  useEffect(() => {
    if (timeLeft === 0 && onExpire) {
      onExpire();
    }
  }, [timeLeft, onExpire]);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isExpired: timeLeft <= 0,
    startTimer,
  };
};
