import { companyInfo } from '../constants';
import { MapPin, MessageSquare, Phone, Mail } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Contact() {
  const position: [number, number] = [25.2048, 55.2708]; // Dubai coordinates

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-32 pb-20 px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h1 className="text-6xl font-extrabold tracking-tighter mb-8">Get in touch</h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Ready to start your journey in Dubai? Our team of experts is here to guide you through every step of your investment and relocation process.
            </p>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-black mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Our Office</h4>
                  <p className="text-gray-600">{companyInfo.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-8 h-8 text-black mt-1" />
                <div>
                  <h4 className="font-bold text-lg">WhatsApp</h4>
                  <p className="text-gray-600">{companyInfo.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-8 h-8 text-black mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Email Support</h4>
                  <p className="text-gray-600">contact@movesmartinvest.com</p>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="rounded-3xl h-80 overflow-hidden shadow-sm border border-gray-100">
              <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    {companyInfo.name}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-3xl font-bold mb-8">Send us a message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <input type="text" placeholder="First Name" className="w-full p-5 border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none bg-white transition-all focus:border-black" />
                <input type="text" placeholder="Last Name" className="w-full p-5 border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none bg-white transition-all focus:border-black" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full p-5 border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none bg-white transition-all focus:border-black" />
              <select className="w-full p-5 border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none bg-white text-gray-500 transition-all focus:border-black">
                <option>Select Inquiry Type</option>
                <option>Real Estate Investment</option>
                <option>Company Formation</option>
                <option>Visa Services</option>
                <option>General Inquiry</option>
              </select>
              <textarea placeholder="How can we help you?" className="w-full p-5 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-black outline-none bg-white transition-all focus:border-black" rows={6}></textarea>
              <button className="w-full bg-black text-white px-10 py-5 rounded-full font-bold hover:bg-gray-800 transition text-lg shadow-lg hover:shadow-xl">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
