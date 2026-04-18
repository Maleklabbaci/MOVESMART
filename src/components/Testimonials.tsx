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
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 px-6 md:px-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-600 text-xs tracking-[0.2em] uppercase font-semibold">Success Stories</span>
            <div className="h-px w-8 bg-amber-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600">
            Join hundreds of satisfied investors who trusted us with their Dubai journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-6 flex-grow leading-relaxed text-sm md:text-base">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</p>
                  <p className="text-xs md:text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
