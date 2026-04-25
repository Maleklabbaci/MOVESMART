import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const articles = [
  {
    id: 1,
    title: "Complete Guide to Golden Visa Dubai 2024",
    excerpt: "Learn everything about UAE's Golden Visa program, eligibility requirements, and how to apply for this 10-year residency.",
    author: "Sarah Al Mansoori",
    date: "April 15, 2024",
    category: "Visa",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Dubai Real Estate Investment Trends 2024",
    excerpt: "Discover the latest trends in Dubai property market, emerging neighborhoods, and investment opportunities for 2024.",
    author: "Mohammed Al Hashmi",
    date: "April 10, 2024",
    category: "Investment",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Marina vs Downtown Dubai: Which is Better?",
    excerpt: "Compare two of Dubai's most popular neighborhoods: Marina and Downtown. Analyze prices, lifestyle, and investment potential.",
    author: "Fatima Saeed",
    date: "April 5, 2024",
    category: "Comparison",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "How to Calculate Rental Yield on Dubai Properties",
    excerpt: "Master the art of calculating rental yield. Learn formulas, factors to consider, and strategies to maximize returns.",
    author: "Ahmed Al Khouri",
    date: "March 28, 2024",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Expat Guide: Living in Dubai as an Investor",
    excerpt: "Complete guide for expats moving to Dubai: visa, banking, healthcare, education, and lifestyle tips for newcomers.",
    author: "Lisa Anderson",
    date: "March 20, 2024",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Financing Your Dubai Property: Complete Walkthrough",
    excerpt: "Everything about Dubai property financing: banks, loan requirements, interest rates, and how to get approved quickly.",
    author: "Rashid Al Maktoumi",
    date: "March 15, 2024",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1507537362392-63e93d2f53b5?q=80&w=600&auto=format&fit=crop"
  }
];

export default function Blog() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-40 pb-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-24 animate-fade-in">
          <span className="tag-gold mb-10">
            BLOG
          </span>
          <h1 className="text-6xl md:text-[90px] font-serif tracking-tighter leading-[1.05] mb-12">
            Real Estate <br/>
            <span className="font-serif-italic text-accent">Insights.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl font-light leading-[1.8]" style={{ color: 'var(--text3)' }}>
            Expert tips, market analysis, and guides to help you make informed investment decisions in Dubai.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, i) => (
            <article key={article.id} className="group flex flex-col card-border animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="aspect-[4/3] relative overflow-hidden bg-black/5">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
                <div className="absolute top-5 left-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg backdrop-blur-md" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {article.category}
                </div>
              </div>
              
              <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] mb-8 gap-6" style={{ color: 'var(--text3)' }}>
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" /> {article.date}</span>
                  <span className="flex items-center gap-2"><User className="w-4 h-4 text-accent" /> {article.author}</span>
                </div>
                
                <h3 className="text-2xl font-serif tracking-tight mb-5 line-clamp-2 transition-colors flex-1 group-hover:text-accent" style={{ color: 'var(--text)' }}>
                  {article.title}
                </h3>
                
                <p className="text-[15px] font-light leading-[1.8] mb-10 line-clamp-3" style={{ color: 'var(--text3)' }}>
                  {article.excerpt}
                </p>
                
                <button className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform w-fit" style={{ color: 'var(--accent)' }}>
                  Read More <ArrowRight className="w-4 h-4 ml-3" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* NEWSLETTER CTA */}
        <div className="mt-32 p-16 md:p-24 text-center border shadow-2xl animate-fade-in delay-200" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)' }}>
          <span className="tag-gold mb-8">
            Stay Updated
          </span>
          <h3 className="text-4xl md:text-6xl font-serif tracking-tighter mb-8" style={{ color: 'var(--text)' }}>Subscribe to Our Newsletter</h3>
          <p className="mb-14 max-w-2xl mx-auto text-xl font-light leading-[1.8]" style={{ color: 'var(--text3)' }}>
            Get the latest Dubai real estate insights, investment tips, and market updates delivered directly to your inbox.
          </p>
          <form className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-6" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 border-b-2 px-4 py-4 text-lg font-light focus:outline-none transition-colors focus:border-accent bg-transparent"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
            <button type="submit" className="btn-gold sm:w-auto w-full flex items-center justify-center gap-4">
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
