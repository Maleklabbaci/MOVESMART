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
    <div className="max-w-6xl mx-auto px-6 py-20" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider uppercase">
          Real Estate Insights
        </h1>
        <p className="max-w-2xl mx-auto" style={{ color: 'var(--text3)' }}>
          Expert tips, market analysis, and guides to help you make informed investment decisions in Dubai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article key={article.id} className="border rounded-lg overflow-hidden transition-colors duration-300 group hover:border-amber-500/50" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
            <div className="relative h-64 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase rounded" style={{ backgroundColor: 'var(--accent)', color: '#000000' }}>
                {article.category}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center text-xs mb-4 gap-4" style={{ color: 'var(--text3)' }}>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 transition-colors cursor-pointer" style={{ color: 'var(--text)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
                {article.title}
              </h3>
              
              <p className="text-sm mb-6 line-clamp-3" style={{ color: 'var(--text3)' }}>
                {article.excerpt}
              </p>
              
              <button className="flex items-center text-sm font-semibold uppercase tracking-wider transition-transform group-hover:translate-x-2" style={{ color: 'var(--accent)' }}>
                Read More <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mt-20 border rounded-xl p-10 text-center" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', filter: 'brightness(0.97)' }}>
        <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>Subscribe to Our Newsletter</h3>
        <p className="mb-8 max-w-xl mx-auto" style={{ color: 'var(--text3)' }}>
          Get the latest Dubai real estate insights, investment tips, and market updates delivered to your inbox.
        </p>
        <form className="max-w-md mx-auto flex gap-4" onSubmit={e => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 border rounded px-4 py-3 focus:outline-none transition-colors"
            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
          <button type="submit" className="px-6 py-3 rounded font-bold uppercase tracking-wider transition-colors hover:opacity-90" style={{ backgroundColor: 'var(--accent)', color: '#000000' }}>
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}