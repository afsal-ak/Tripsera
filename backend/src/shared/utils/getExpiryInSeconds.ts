import ms, { StringValue } from 'ms';

// Convert expiry string to seconds
export const getExpiryInSeconds = (expiry: StringValue): number => {
  const milliseconds = ms(expiry);
  if (typeof milliseconds !== 'number') {
    throw new Error(`Invalid expiry value: ${expiry}`);
  }
  return milliseconds / 1000; // seconds
};
