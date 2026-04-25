import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Ajout de la traduction

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
    <div className="min-h-screen pt-20" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-20">
        
        {/* Left Side - Info */}
        <div>
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-6" style={{ color: 'var(--text)' }}>
            {t('contact_tag', 'Get in touch')}
          </h1>
          <p className="text-lg leading-relaxed mb-12 max-w-lg" style={{ color: 'var(--text3)' }}>
            {t('contact_sub', 'Ready to start your journey in Dubai? Our team of experts is here to guide you through every step of your investment and relocation process.')}
          </p>

          <div className="space-y-10">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 border rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', filter: 'brightness(1.1)' }}>
                <MapPin className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>
                  {t('office_label', 'Our Office')}
                </h4>
                <p className="leading-relaxed" style={{ color: 'var(--text)' }}>
                  Boulevard Plaza Tower 1<br/>
                  Downtown Dubai<br/>
                  United Arab Emirates
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 border rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', filter: 'brightness(1.1)' }}>
                <Phone className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>
                  WhatsApp
                </h4>
                <a href="https://wa.me/971501234567" className="text-xl font-light transition-colors" style={{ color: 'var(--text)' }}>
                  +971 50 123 4567
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 border rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', filter: 'brightness(1.1)' }}>
                <Mail className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>
                  Email Support
                </h4>
                <a href="mailto:contact@movesmartinvest.com" className="transition-colors" style={{ color: 'var(--text)' }}>
                  contact@movesmartinvest.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 border rounded-lg" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', filter: 'brightness(0.97)' }}>
          <h3 className="text-2xl font-bold uppercase tracking-wider mb-8" style={{ color: 'var(--text)' }}>
            {t('form_title', 'Send us a message')}
          </h3>
          
          {success && (
            <div className="p-4 rounded mb-8 flex items-center gap-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', border: '1px solid', color: '#22c55e' }}>
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{t('success_sub', 'Message sent successfully! We\'ll get back to you soon.')}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>
                  {t('field_name', 'Name')}
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                  placeholder={t('name_ph', 'Jean')}
                  className="w-full border rounded px-4 py-3 focus:outline-none transition-colors"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>
                  {t('field_email', 'Email')}
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required
                  placeholder={t('email_ph', 'jean@email.com')}
                  className="w-full border rounded px-4 py-3 focus:outline-none transition-colors"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>
                  {t('field_phone', 'Phone')}
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder={t('phone_ph', '+33 6 00 00 00 00')}
                  className="w-full border rounded px-4 py-3 focus:outline-none transition-colors"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>
                  {t('field_subject', 'Inquiry Type')}
                </label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  required
                  className="w-full border rounded px-4 py-3 focus:outline-none transition-colors"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <option value="">{t('select_inquiry', 'Select')}</option>
                  <option value="real_estate">{t('inquiry_re', 'Rental yield')}</option>
                  <option value="company">{t('inquiry_co', 'Off-plan buying')}</option>
                  <option value="visa">{t('inquiry_vi', 'Golden Visa')}</option>
                  <option value="general">{t('inquiry_ge', 'Other')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>
                {t('field_message', 'Message')}
              </label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required
                rows={5}
                placeholder={t('message_ph', 'Budget and goal...')}
                className="w-full border rounded px-4 py-3 focus:outline-none transition-colors resize-none"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)', color: '#000000' }}
            >
              {loading ? t('sending', 'Sending...') : (
                <>
                  {t('btn_send', 'Send Message')}
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}