import React, { useState } from 'react';
import { companyInfo } from '../constants';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const url = `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: hovered ? '84px' : '80px',
        right: '20px',
        zIndex: 40,
        transition: 'all 0.3s ease',
      }}
      className="md:bottom-8 group">
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        backgroundColor: '#25D366',
        opacity: hovered ? 0.2 : 0,
        transform: hovered ? 'scale(1.5)' : 'scale(1)',
        transition: 'all 0.4s ease',
        pointerEvents: 'none',
      }} />
      {/* Button */}
      <div style={{
        width: 52, height: 52,
        background: 'linear-gradient(135deg, #25D366, #20BA5E)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: hovered ? '0 8px 30px rgba(37,211,102,0.35)' : '0 4px 15px rgba(37,211,102,0.2)',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.535 5.862L.057 23.943l6.261-1.641A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.523-5.175-1.432l-.371-.22-3.851 1.01 1.027-3.748-.242-.386A9.937 9.937 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
        </svg>
      </div>
      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute', bottom: '100%', right: 0, marginBottom: 10,
          backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)',
          color: 'white', fontSize: 11, padding: '6px 12px', whiteSpace: 'nowrap',
          fontFamily: 'sans-serif', letterSpacing: '0.1em',
        }}>
          WhatsApp
        </div>
      )}
    </a>
  );
}
