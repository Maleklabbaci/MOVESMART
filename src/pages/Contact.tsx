import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(r => setTimeout(r, 1500));
      console.log('Message:', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', type: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-40" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-32 items-start">
        
        {/* Left Side - Info */}
        <div className="animate-fade-in-up">
          <span className="inline-block py-1.5 px-4 rounded-full border mb-8 text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>
            {t('contact_tag', 'Prendre contact')}
          </span>
          <h1 className="text-6xl md:text-[80px] font-bold tracking-tighter mb-12 leading-[1.05]" style={{ color: 'var(--text)' }}>
            L'investissement<br/>
            <span className="text-amber-500 font-serif-italic font-normal">{t('contact_title_1', 'sur mesure.')}</span>
          </h1>
          <p className="text-xl leading-relaxed mb-20 max-w-lg font-light" style={{ color: 'var(--text3)' }}>
            {t('contact_sub', 'Réservez une consultation gratuite avec un expert MoveSmart. Nous analysons vos objectifs de rentabilité et vous proposons un plan d\'action clair.')}
          </p>

          <div className="space-y-16">
            <div className="flex items-start gap-8 group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-lg border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <MapPin className="w-7 h-7 text-amber-500" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text3)' }}>
                  {t('office_label', 'Bureau Principal')}
                </h4>
                <p className="leading-relaxed text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
                  Boulevard Plaza Tower 1<br/>
                  Downtown Dubai<br/>
                  Émirats Arabes Unis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-8 group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-lg border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <Phone className="w-7 h-7 text-amber-500" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text3)' }}>
                  WhatsApp Rapide
                </h4>
                <a href="https://wa.me/971501234567" className="text-2xl font-bold tracking-tight transition-colors hover:text-amber-500" style={{ color: 'var(--text)' }}>
                  +971 50 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 md:p-16 rounded-[40px] shadow-2xl border animate-fade-in-up delay-200" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h3 className="text-4xl font-bold tracking-tighter mb-12" style={{ color: 'var(--text)' }}>
            {t('form_title', 'Demande de consultation')}
          </h3>
          
          {success && (
            <div className="p-6 rounded-2xl mb-12 flex items-center gap-4 border" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
              <CheckCircle className="w-8 h-8 flex-shrink-0" />
              <p className="text-sm font-bold tracking-wide uppercase">{t('success_sub', 'Message envoyé avec succès. Notre expert vous contactera sous 2h ouvrées.')}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                  {t('field_name', 'Nom complet')}
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                  placeholder={t('name_ph', 'Ex: Jean Dupont')}
                  className="w-full border-b-2 py-4 text-lg font-bold focus:outline-none transition-colors focus:border-amber-500 bg-transparent font-sans"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                  {t('field_email', 'Email')}
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required
                  placeholder={t('email_ph', 'jean@email.com')}
                  className="w-full border-b-2 py-4 text-lg font-bold focus:outline-none transition-colors focus:border-amber-500 bg-transparent font-sans"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                  {t('field_phone', 'Téléphone (WhatsApp)')}
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder={t('phone_ph', '+33 6 00 00 00 00')}
                  className="w-full border-b-2 py-4 text-lg font-bold focus:outline-none transition-colors focus:border-amber-500 bg-transparent font-sans"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                  {t('field_subject', 'Objectif Principal')}
                </label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  required
                  className="w-full border-b-2 py-4 text-lg font-bold focus:outline-none transition-colors focus:border-amber-500 bg-transparent cursor-pointer font-sans"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <option value="" style={{ backgroundColor: 'var(--surface)' }}>{t('select_inquiry', 'Sélectionnez un objectif')}</option>
                  <option value="real_estate" style={{ backgroundColor: 'var(--surface)' }}>{t('inquiry_re', 'Recherche de rendement locatif')}</option>
                  <option value="company" style={{ backgroundColor: 'var(--surface)' }}>{t('inquiry_co', 'Achat sur plan (Plus-value)')}</option>
                  <option value="visa" style={{ backgroundColor: 'var(--surface)' }}>{t('inquiry_vi', 'Obtention du Golden Visa')}</option>
                  <option value="general" style={{ backgroundColor: 'var(--surface)' }}>{t('inquiry_ge', 'Autre')}</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                {t('field_message', 'Détails du projet & Budget')}
              </label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required
                rows={4}
                placeholder={t('message_ph', 'Ex: Budget de 300k€, recherche de rendement...')}
                className="w-full border-2 rounded-[24px] px-6 py-5 text-lg font-bold focus:outline-none transition-colors resize-none focus:border-amber-500 shadow-sm font-sans"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 rounded-full transition-transform hover:scale-[1.02] shadow-xl text-black"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {loading ? t('sending', 'Envoi en cours...') : (
                <>
                  {t('btn_send', 'Envoyer la demande')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
              Vos données sont strictement confidentielles.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
