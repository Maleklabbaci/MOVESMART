import React from 'react';
import { MessageCircle } from 'lucide-react';
import { companyInfo } from '../constants';

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-20 md:bottom-6 right-6 z-40 group"
    >
      {/* Animated background pulse */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full opacity-0 group-hover:opacity-20 scale-0 group-hover:scale-150 transition-all duration-500" />
      
      {/* Main button */}
      <div className={`relative w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#20BA5E] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group-hover:scale-110 ${
        isHovered ? 'animate-pulse' : ''
      }`}>
        <MessageCircle className="w-7 h-7" strokeWidth={1.5} />
      </div>

      {/* Tooltip */}
      <div className={`absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <span className="font-medium">Chat with us</span>
        {/* Tooltip arrow */}
        <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </a>
  );
}
