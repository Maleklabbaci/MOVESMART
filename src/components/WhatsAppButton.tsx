import React from 'react';
import { MessageCircle } from 'lucide-react';
import { companyInfo } from '../constants';

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
}
