import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

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
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider uppercase">Real Estate Insights</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Expert tips, market analysis, and guides to help you make informed investment decisions in Dubai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article key={article.id} className="bg-black border border-white/10 rounded-lg overflow-hidden hover:border-amber-500/50 transition-colors duration-300 group">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-amber-500 text-black px-3 py-1 text-xs font-bold uppercase rounded">
                {article.category}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center text-xs text-gray-500 mb-4 gap-4">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 hover:text-amber-500 transition-colors cursor-pointer">
                {article.title}
              </h3>
              
              <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                {article.excerpt}
              </p>
              
              <button className="flex items-center text-amber-500 text-sm font-semibold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                Read More <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mt-20 bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-xl p-10 text-center">
        <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Get the latest Dubai real estate insights, investment tips, and market updates delivered to your inbox.
        </p>
        <form className="max-w-md mx-auto flex gap-4" onSubmit={e => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button type="submit" className="bg-amber-500 text-black px-6 py-3 rounded font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}