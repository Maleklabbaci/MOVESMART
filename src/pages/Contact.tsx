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
      <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-24 items-start">
        
        {/* Left Side - Info */}
        <div className="animate-fade-in">
          <span className="inline-block mb-8 text-[11px] font-bold tracking-widest uppercase text-amber-500">
            {t('contact_tag', 'Prendre contact')}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider uppercase mb-12 leading-tight" style={{ color: 'var(--text)' }}>
            L'investissement<br/>
            <span className="text-amber-500">{t('contact_title_1', 'sur mesure.')}</span>
          </h1>
          <p className="text-lg leading-relaxed mb-20 font-light font-sans max-w-lg" style={{ color: 'var(--text3)' }}>
            {t('contact_sub', 'Réservez une consultation gratuite avec un expert MoveSmart. Nous analysons vos objectifs de rentabilité et vous proposons un plan d\'action clair.')}
          </p>

          <div className="space-y-16">
            <div className="flex items-start gap-8 group">
              <div className="w-14 h-14 border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <MapPin className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                  {t('office_label', 'Bureau Principal')}
                </h4>
                <p className="leading-relaxed text-xl font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  Boulevard Plaza Tower 1<br/>
                  Downtown Dubai<br/>
                  Émirats Arabes Unis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-8 group">
              <div className="w-14 h-14 border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <Phone className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                  WhatsApp Rapide
                </h4>
                <a href="https://wa.me/971501234567" className="text-xl font-bold uppercase tracking-wider transition-colors hover:text-amber-500 font-sans" style={{ color: 'var(--text)' }}>
                  +971 50 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="border p-12 animate-fade-in bg-black" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <h3 className="text-3xl font-bold uppercase tracking-wider mb-12 text-white">
            {t('form_title', 'Demande de consultation')}
          </h3>
          
          {success && (
            <div className="p-6 mb-12 flex items-center gap-4 border border-green-500/20 bg-green-500/10 text-green-500">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <p className="text-xs font-bold tracking-widest uppercase">{t('success_sub', 'Message envoyé avec succès. Notre expert vous contactera sous 2h ouvrées.')}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500">
                  {t('field_name', 'Nom complet')}
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                  placeholder={t('name_ph', 'Ex: Jean Dupont')}
                  className="w-full border-b border-gray-800 py-3 text-sm font-sans focus:outline-none transition-colors focus:border-amber-500 bg-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500">
                  {t('field_email', 'Email')}
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required
                  placeholder={t('email_ph', 'jean@email.com')}
                  className="w-full border-b border-gray-800 py-3 text-sm font-sans focus:outline-none transition-colors focus:border-amber-500 bg-transparent text-white"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500">
                  {t('field_phone', 'Téléphone (WhatsApp)')}
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder={t('phone_ph', '+33 6 00 00 00 00')}
                  className="w-full border-b border-gray-800 py-3 text-sm font-sans focus:outline-none transition-colors focus:border-amber-500 bg-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500">
                  {t('field_subject', 'Objectif Principal')}
                </label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  required
                  className="w-full border-b border-gray-800 py-3 text-sm font-sans focus:outline-none transition-colors focus:border-amber-500 bg-transparent cursor-pointer text-white"
                >
                  <option value="" className="bg-black text-white">{t('select_inquiry', 'Sélectionnez un objectif')}</option>
                  <option value="real_estate" className="bg-black text-white">{t('inquiry_re', 'Recherche de rendement locatif')}</option>
                  <option value="company" className="bg-black text-white">{t('inquiry_co', 'Achat sur plan (Plus-value)')}</option>
                  <option value="visa" className="bg-black text-white">{t('inquiry_vi', 'Obtention du Golden Visa')}</option>
                  <option value="general" className="bg-black text-white">{t('inquiry_ge', 'Autre')}</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500">
                {t('field_message', 'Détails du projet & Budget')}
              </label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required
                rows={4}
                placeholder={t('message_ph', 'Ex: Budget de 300k€, recherche de rendement...')}
                className="w-full border border-gray-800 px-6 py-5 text-sm font-sans focus:outline-none transition-colors resize-none focus:border-amber-500 bg-transparent text-white"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 transition-colors bg-amber-500 text-black hover:bg-amber-600"
            >
              {loading ? t('sending', 'Envoi en cours...') : (
                <>
                  {t('btn_send', 'Envoyer la demande')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Vos données sont strictement confidentielles.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
