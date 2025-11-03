import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  adminPhone: string;
  message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  adminPhone,
  message = 'Hello! I need help with my booking.',
}) => {
  const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-32 right-6 z-50 bg-green-500 hover:bg-green-600 
                 w-16 h-16 rounded-full shadow-lg flex items-center justify-center 
                 transition-transform transform hover:scale-110"
    >
      <MessageCircle size={28} className="text-white" />
    </a>
  );
};

export default WhatsAppButton;
