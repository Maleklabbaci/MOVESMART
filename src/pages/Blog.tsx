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
    <div className="min-h-screen pt-32 pb-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-20 animate-fade-in">
          <span className="inline-block mb-6 text-[10px] font-bold tracking-widest uppercase text-amber-500">
            BLOG
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider uppercase leading-tight mb-8">
            Real Estate <br/>
            <span className="font-serif-italic lowercase text-amber-500">Insights</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base font-light font-sans" style={{ color: 'var(--text3)' }}>
            Expert tips, market analysis, and guides to help you make informed investment decisions in Dubai.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="group flex flex-col overflow-hidden border transition-all hover:-translate-y-1 shadow-sm hover:shadow-lg bg-black" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="aspect-[4/3] relative overflow-hidden bg-black/5">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black">
                  {article.category}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest mb-6 gap-5 text-gray-500">
                  <span className="flex items-center gap-2"><Calendar className="w-3 h-3 text-amber-500" /> {article.date}</span>
                  <span className="flex items-center gap-2"><User className="w-3 h-3 text-amber-500" /> {article.author}</span>
                </div>
                
                <h3 className="text-xl font-bold tracking-wider uppercase mb-4 line-clamp-2 transition-colors flex-1 text-white group-hover:text-amber-500">
                  {article.title}
                </h3>
                
                <p className="text-sm font-light font-sans mb-8 line-clamp-3 text-gray-400">
                  {article.excerpt}
                </p>
                
                <button className="flex items-center text-[10px] font-bold uppercase tracking-widest text-amber-500 group-hover:translate-x-2 transition-transform w-fit">
                  Read More <ArrowRight className="w-3 h-3 ml-3" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* NEWSLETTER CTA */}
        <div className="mt-32 border p-12 md:p-20 text-center bg-black" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-6 text-white">Subscribe to Our Newsletter</h3>
          <p className="mb-12 max-w-xl mx-auto text-sm font-light font-sans text-gray-400">
            Get the latest Dubai real estate insights, investment tips, and market updates delivered to your inbox.
          </p>
          <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 border-b border-gray-800 px-4 py-4 text-sm font-sans focus:outline-none transition-colors focus:border-amber-500 bg-transparent text-white"
            />
            <button type="submit" className="px-8 py-4 font-bold uppercase tracking-widest text-[11px] transition-colors bg-amber-500 text-black hover:bg-amber-600 sm:w-auto w-full">
              Subscribe
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
