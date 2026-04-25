import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Added translation

export default function Testimonials() {
  const { t } = useTranslation();

  // Testimonials usually stay static or come from DB, but let's translate titles if needed
  const testimonials = [
    {
      name: "Ahmed Al Mansouri",
      title: t('testimonial_1_title', 'Property Investor'),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      text: t('testimonial_1_text', 'MoveSmart made the entire investment process seamless. From property selection to visa approval, they handled everything professionally. Highly recommended!'),
      rating: 5
    },
    {
      name: "Sophie Dupont",
      title: t('testimonial_2_title', 'French Entrepreneur'),
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      text: t('testimonial_2_text', 'Exceptional service! The team understood my needs perfectly and found the ideal property. Their legal support was outstanding. Worth every penny!'),
      rating: 5
    },
    {
      name: "Michael Chen",
      title: t('testimonial_3_title', 'Business Owner'),
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      text: t('testimonial_3_text', 'Best decision I made was working with MoveSmart. They simplified the complex process and delivered results beyond expectations. Professional team!'),
      rating: 5
    }
  ];

  return (
    <div className="py-24" style={{ backgroundColor: 'var(--bg)', filter: 'brightness(0.97)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-bold uppercase tracking-widest text-sm mb-4" style={{ color: 'var(--accent)' }}>
            {t('testimonials_tag', 'Success Stories')}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wider mb-6" style={{ color: 'var(--text)' }}>
            {t('testimonials_title', 'What Our Clients Say')}
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text3)' }}>
            {t('testimonials_sub', 'Join hundreds of satisfied investors who trusted us with their Dubai journey')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="border p-8 rounded-xl hover:border-amber-500/30 transition-all duration-300 transform hover:-translate-y-1"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-1 mb-6" style={{ color: 'var(--accent)' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              
              <p className="text-sm leading-relaxed mb-8 italic" style={{ color: 'var(--text)' }}>
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border"
                  style={{ borderColor: 'var(--border)' }}
                />
                <div>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{testimonial.name}</h4>
                  <p className="text-xs" style={{ color: 'var(--accent)', opacity: 0.8 }}>{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}