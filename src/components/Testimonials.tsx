import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Ahmed Al Mansouri",
    title: "Property Investor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    text: "MoveSmart made the entire investment process seamless. From property selection to visa approval, they handled everything professionally. Highly recommended!",
    rating: 5
  },
  {
    name: "Sophie Dupont",
    title: "French Entrepreneur",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    text: "Exceptional service! The team understood my needs perfectly and found the ideal property. Their legal support was outstanding. Worth every penny!",
    rating: 5
  },
  {
    name: "Michael Chen",
    title: "Business Owner",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    text: "Best decision I made was working with MoveSmart. They simplified the complex process and delivered results beyond expectations. Professional team!",
    rating: 5
  },
  {
    name: "Maria Garcia",
    title: "Real Estate Investor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    text: "From the first consultation to closing, everything was handled perfectly. Their expertise in Dubai market is unmatched. Highly satisfied!",
    rating: 5
  },
  {
    name: "James Wilson",
    title: "Property Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    text: "MoveSmart's professionalism and market knowledge are exceptional. They secured financing and handled negotiations like true experts. Outstanding service!",
    rating: 5
  },
  {
    name: "Lisa Zhang",
    title: "Investment Advisor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    text: "Working with MoveSmart was refreshing. Their transparency, expertise, and dedication made my Dubai investment journey smooth and profitable. 5/5!",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <div className="py-24 bg-black/95">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4">Success Stories</p>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wider mb-6">What Our Clients Say</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join hundreds of satisfied investors who trusted us with their Dubai journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-black border border-white/10 p-8 rounded-xl hover:border-amber-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-1 mb-6 text-amber-500">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{testimonial.name}</h4>
                  <p className="text-xs text-amber-500/80">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}