import { companyInfo } from '../constants';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSuccess(true);
    setForm({ name: '', email: '', phone: '', type: '', message: '' });
    setLoading(false);
    setTimeout(() => setSuccess(false), 4000);
  };

  const inputClass = "w-full bg-transparent border-b border-white/10 focus:border-[var(--accent)] outline-none py-3 text-white placeholder-gray-600 font-sans font-light text-sm transition-colors duration-300";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <section className="pt-40 pb-20 px-6 border-b border-[var(--border2)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <span className="text-[var(--accent)] text-xs font-sans tracking-[0.3em] uppercase">Contact</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-light leading-[0.9] mb-6">
            Parlons de<br /><em className="not-italic text-[var(--accent)]">votre projet.</em>
          </h1>
          <p className="text-[var(--text3)] font-sans font-light text-base max-w-lg leading-relaxed">
            Notre équipe répond sous 24h pour étudier votre projet d'investissement à Dubaï.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <div className="space-y-10 mb-16">
              {[
                { icon: MapPin, label: 'Notre bureau', value: companyInfo.location, href: null },
                { icon: Phone, label: 'WhatsApp', value: companyInfo.whatsapp, href: `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}` },
                { icon: Mail, label: 'Email', value: 'contact@movesmartinvest.com', href: 'mailto:contact@movesmartinvest.com' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="w-10 h-10 border border-[var(--accent)]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <item.icon className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <div>
                    <div className="text-xs font-sans text-[var(--text4)] tracking-[0.3em] uppercase mb-2">{item.label}</div>
                    {item.href
                      ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-light hover:text-amber-300 transition-colors text-sm font-sans">{item.value}</a>
                      : <p className="text-gray-300 font-light">{item.value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
            <div className="border border-[var(--border2)] p-8 hidden md:block">
              <div className="text-xs font-sans text-[var(--text4)] tracking-[0.3em] uppercase mb-4">Disponibilité</div>
              <div className="space-y-2 text-sm font-sans text-[var(--text3)] font-light">
                <div className="flex justify-between"><span>Lun – Ven</span><span className="text-[var(--text2)]">9:00 – 18:00</span></div>
                <div className="flex justify-between"><span>Samedi</span><span className="text-[var(--text2)]">10:00 – 15:00</span></div>
                <div className="flex justify-between"><span>WhatsApp</span><span className="text-[var(--accent)]">Toujours disponible</span></div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-sans text-[var(--text4)] tracking-[0.3em] uppercase mb-10">Envoyer un message</div>
            {success && (
              <div className="mb-8 flex items-center gap-3 text-green-400 border border-green-400/20 p-4">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-sans font-medium text-sm">Message envoyé.</p>
                  <p className="font-sans font-light text-xs text-green-500">Nous vous répondons sous 24h.</p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-sans text-[var(--text4)] tracking-[0.2em] uppercase block mb-3">Nom *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Jean Dupont" required />
                </div>
                <div>
                  <label className="text-xs font-sans text-[var(--text4)] tracking-[0.2em] uppercase block mb-3">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="jean@email.com" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-sans text-[var(--text4)] tracking-[0.2em] uppercase block mb-3">Téléphone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+33 6 00 00 00 00" />
              </div>
              <div>
                <label className="text-xs font-sans text-[var(--text4)] tracking-[0.2em] uppercase block mb-3">Sujet</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={`${inputClass} cursor-pointer`} style={{ background: 'transparent' }}>
                  <option value="" className="bg-[var(--bg)]">Sélectionner</option>
                  <option value="real-estate" className="bg-[var(--bg)]">Investissement immobilier</option>
                  <option value="company" className="bg-[var(--bg)]">Création de société</option>
                  <option value="visa" className="bg-[var(--bg)]">Visa & résidence</option>
                  <option value="general" className="bg-[var(--bg)]">Question générale</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-sans text-[var(--text4)] tracking-[0.2em] uppercase block mb-3">Message *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} placeholder="Décrivez votre projet..." rows={5} required />
              </div>
              <button type="submit" disabled={loading}
                className="group inline-flex items-center gap-4 bg-[var(--accent)] text-black px-10 py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:bg-amber-300 transition-all duration-300 disabled:opacity-60 w-full sm:w-auto justify-center">
                {loading ? 'Envoi...' : <><span>Envoyer</span><Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--bg4)] border-t border-[var(--border2)] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text5)] font-sans">© 2026 MoveSmart Invest. Tous droits réservés.</p>
          <div className="flex gap-6 text-xs text-[var(--text5)] font-sans">
            <a href="#" className="hover:text-[var(--accent)] transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-[var(--accent)] transition-colors">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
