import { companyInfo } from '../constants';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

export default function Contact() {
  const position: [number, number] = [25.2048, 55.2708];
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulated email send (replace with real service like EmailJS)
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
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 md:pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 md:mb-8">Get in touch</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 leading-relaxed">
              Ready to start your journey in Dubai? Our team of experts is here to guide you through every step of your investment and relocation process.
            </p>
            
            <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
              <div className="flex items-start gap-3 md:gap-4">
                <MapPin className="w-6 md:w-8 h-6 md:h-8 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-base md:text-lg">Our Office</h4>
                  <p className="text-sm md:text-base text-gray-600">{companyInfo.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <Phone className="w-6 md:w-8 h-6 md:h-8 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-base md:text-lg">WhatsApp</h4>
                  <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm md:text-base text-amber-600 hover:text-amber-700">
                    {companyInfo.whatsapp}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <Mail className="w-6 md:w-8 h-6 md:h-8 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-base md:text-lg">Email Support</h4>
                  <a href="mailto:contact@movesmartinvest.com" className="text-sm md:text-base text-amber-600 hover:text-amber-700">
                    contact@movesmartinvest.com
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-3xl h-64 md:h-80 overflow-hidden shadow-sm border border-gray-100">
              <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>{companyInfo.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <div className="bg-gray-50 p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Send us a message</h3>
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium text-sm md:text-base">Message sent successfully!</p>
                  <p className="text-green-700 text-xs md:text-sm">We'll get back to you soon.</p>
                </div>
              </div>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 md:px-5 py-3 md:py-5 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-600 outline-none bg-white transition-all focus:border-amber-600 text-sm md:text-base"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 md:px-5 py-3 md:py-5 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-600 outline-none bg-white transition-all focus:border-amber-600 text-sm md:text-base"
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 md:px-5 py-3 md:py-5 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-600 outline-none bg-white transition-all focus:border-amber-600 text-sm md:text-base"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 md:px-5 py-3 md:py-5 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-600 outline-none bg-white text-gray-700 transition-all focus:border-amber-600 text-sm md:text-base"
              >
                <option value="">Select Inquiry Type</option>
                <option value="real-estate">Real Estate Investment</option>
                <option value="company">Company Formation</option>
                <option value="visa">Visa Services</option>
                <option value="general">General Inquiry</option>
              </select>
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 md:px-5 py-3 md:py-5 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-amber-600 outline-none bg-white transition-all focus:border-amber-600 text-sm md:text-base"
                rows={6}
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 text-white px-10 py-3 md:py-5 rounded-full font-bold hover:bg-amber-700 transition text-base md:text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
