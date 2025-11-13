import api from '@/lib/axios/api';

export const subscribeToNewsletterToggle = async (subscribed: boolean) => {
  const response = await api.put('/user/newsletter/subscribe', { subscribed });
  return response.data;
}

