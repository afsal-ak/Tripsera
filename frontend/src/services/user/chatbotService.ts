import api from '@/lib/axios/api';

export const chatWithBot = async (message: string) => {
  try {
    const response = await api.post('/user/chatbot', { message });
    console.log('rs');
    return response.data.reply;
  } catch (error: any) {
    console.error('Chatbot API Error:', error.response?.data || error.message);
  }
};
