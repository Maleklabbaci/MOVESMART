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
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 pb-20 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
            Real Estate Insights
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            Expert tips, market analysis, and guides to help you make informed investment decisions in Dubai.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {article.title}
                </h3>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 flex-grow">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-xs md:text-sm text-gray-500">{article.author}</span>
                  </div>
                  <button className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-2">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-3xl p-8 md:p-12 text-center border border-amber-200">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Get the latest Dubai real estate insights, investment tips, and market updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-6 py-3 rounded-full focus:ring-2 focus:ring-amber-600 outline-none bg-white"
            />
            <button className="bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
