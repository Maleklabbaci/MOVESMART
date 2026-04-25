import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
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
      // Simulated email send
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
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-20">
        
        {/* Left Side - Info */}
        <div>
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-6">Get in touch</h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg">
            Ready to start your journey in Dubai? Our team of experts is here to guide you through every step of your investment and relocation process.
          </p>

          <div className="space-y-10">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Our Office</h4>
                <p className="text-white leading-relaxed">
                  Boulevard Plaza Tower 1<br/>
                  Downtown Dubai<br/>
                  United Arab Emirates
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">WhatsApp</h4>
                <a href="https://wa.me/971501234567" className="text-xl font-light hover:text-amber-500 transition-colors">
                  +971 50 123 4567
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Email Support</h4>
                <a href="mailto:contact@movesmartinvest.com" className="text-white hover:text-amber-500 transition-colors">
                  contact@movesmartinvest.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-[#0a0a0a] p-10 border border-white/10 rounded-lg">
          <h3 className="text-2xl font-bold uppercase tracking-wider mb-8">Send us a message</h3>
          
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded mb-8 flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Message sent successfully! We'll get back to you soon.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Inquiry Type</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="">Select Inquiry Type</option>
                  <option value="real_estate">Real Estate Investment</option>
                  <option value="company">Company Formation</option>
                  <option value="visa">Visa Services</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Message</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required
                rows={5}
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-500 text-black py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : (
                <>
                  Send Message
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