import React from 'react';
import { Phone, X } from 'lucide-react';
import { companyInfo } from '../constants';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasHovered, setHasHovered] = React.useState(false);

  // Close when clicked outside
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.wa-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen]);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Bonjour, je souhaite obtenir plus d'informations sur vos services d'investissement à Dubaï.");
    window.open(`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] wa-container flex flex-col items-end">
      
      {/* Tooltip / Popup Message */}
      <div 
        className={`mb-4 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="p-5 rounded-2xl shadow-2xl relative max-w-[280px]"
          style={{ backgroundColor: 'var(--header-bg)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="absolute top-3 right-3 p-1 rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            style={{ color: 'var(--text3)' }}
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img 
                src="https://ui-avatars.com/api/?name=MoveSmart&background=b8860b&color=fff&rounded=true" 
                alt="Agent" 
                className="w-10 h-10 rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h4 className="text-sm font-bold font-serif tracking-tight" style={{ color: 'var(--text)' }}>MoveSmart</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-500">En ligne</p>
            </div>
          </div>
          
          <p className="text-[13px] leading-relaxed mb-4 font-light" style={{ color: 'var(--text3)' }}>
            Besoin d'aide pour votre projet d'investissement à Dubaï ? Discutez directement avec l'un de nos experts.
          </p>
          
          <button 
            onClick={handleWhatsAppClick}
            className="w-full py-3 flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-widest text-[10px] text-white shadow-lg transition-transform hover:-translate-y-1"
            style={{ backgroundColor: '#25D366' }} // Vrai vert WhatsApp
          >
            Démarrer la discussion
          </button>
        </div>
      </div>

      {/* Main Button */}
      <button
        onMouseEnter={() => !hasHovered && setHasHovered(true)}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          else handleWhatsAppClick();
        }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 group relative"
        style={{ backgroundColor: '#25D366', color: '#ffffff' }}
        aria-label="Contact on WhatsApp"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></span>
        
        <Phone className="w-6 h-6 relative z-10" />
      </button>

    </div>
  );
}
