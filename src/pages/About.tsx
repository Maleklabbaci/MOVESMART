import { companyInfo } from '../constants';
import { Target, Users, ShieldCheck, TrendingUp, Building2, Globe, Briefcase as BriefcaseIcon } from 'lucide-react';

export default function About() {
  const features = [
    { icon: Target, title: 'Strategic Vision', description: 'We define clear, actionable roadmaps tailored to your investment goals in Dubai.' },
    { icon: Users, title: 'Personalized Approach', description: 'Our 360° service ensures every aspect of your relocation and business setup is handled with care.' },
    { icon: ShieldCheck, title: 'Trusted Expertise', description: 'With deep local knowledge, we navigate the complexities of Dubai regulations for you.' },
    { icon: TrendingUp, title: 'Sustainable Growth', description: 'We focus on long-term success, helping you build and grow your assets effectively.' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-32 pb-20 px-10">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-20">
          <h1 className="text-7xl font-extrabold tracking-tighter mb-8">About {companyInfo.brand}</h1>
          <p className="text-3xl text-gray-900 font-medium mb-8 leading-tight max-w-4xl">
            {companyInfo.baseline}
          </p>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            {companyInfo.description}
          </p>
        </div>

        {/* Why Dubai Section */}
        <div className="mb-20 bg-gray-50 p-16 rounded-3xl">
          <h2 className="text-4xl font-extrabold tracking-tighter mb-12 text-center">Why Invest in Dubai?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Building2, title: 'Global Hub', desc: 'Strategic location connecting East and West.' },
              { icon: Globe, title: 'Tax Efficiency', desc: 'Attractive tax environment for businesses and individuals.' },
              { icon: BriefcaseIcon, title: 'Business Friendly', desc: 'World-class infrastructure and ease of doing business.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm">
                <item.icon className="w-10 h-10 mb-4" />
                <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
              <feature.icon className="w-12 h-12 text-black mb-6" />
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600 text-lg">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-black text-white p-16 rounded-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tighter mb-6">Our Commitment</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            At {companyInfo.brand}, we believe that success in Dubai is built on trust, transparency, and a deep understanding of the local landscape. We are your dedicated partner, committed to turning your ambitions into reality.
          </p>
        </div>
      </div>
    </div>
  );
}
