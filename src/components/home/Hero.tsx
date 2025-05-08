import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/1616484/pexels-photo-1616484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          backgroundPosition: "center 30%"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/70"></div>
      </div>

      <div className="container mx-auto px-4 z-10 pt-24">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6 animate-fade-in">
            If Nature Didn't Make It, <span className="text-yellow-500">Don't Take It</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-slide-up">
            Experience the pure taste of nature with our handcrafted drinks. Made fresh daily with zero preservatives and delivered to your doorstep in Abuja.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="bg-yellow-500 hover:bg-yellow-400 text-primary-600 font-bold py-3 px-6 rounded-full inline-flex items-center transition-colors animate-slide-up"
            >
              Explore Our Drinks
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#featured"
              className="bg-transparent border-2 border-white hover:border-yellow-500 text-white hover:text-yellow-500 font-bold py-3 px-6 rounded-full transition-colors animate-slide-up"
            >
              Featured Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;