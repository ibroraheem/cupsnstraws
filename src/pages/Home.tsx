import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';
import {
  SparklesIcon,
  TruckIcon,
  UsersIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductSize {
  id: string;
  size: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  sizes: ProductSize[];
  featured?: boolean;
}

const naturalTexts = [
  'Purely Natural, Purely Delicious!',
  'No Preservatives, No Worries.',
  'Nature in Every Sip.',
  'Fresh, Healthy, Yours.',
  'If nature didn\'t make it, don\'t take it.',
];

const placeholderImg = '/images/cupsnstrawslogo.jpg';

const Home: React.FC = () => {
  const [sliderProducts, setSliderProducts] = useState<Product[]>([]);
  const [featuredSectionProducts, setFeaturedSectionProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data: productsData, error } = await supabase
        .from('products')
        .select('id, name, description, image, featured, product_sizes(id, size, price)');
      if (!error && productsData) {
        const formatted = productsData.map((p: { id: string; name: string; description: string; image: string | null; featured?: boolean; product_sizes: ProductSize[] }) => ({
          ...p,
          sizes: p.product_sizes,
        }));
        
        const featuredForSlider = formatted.filter(p => p.featured).slice(0, 3);
        setSliderProducts(featuredForSlider);

        const allFeatured = formatted.filter(p => p.featured);
        setFeaturedSectionProducts(allFeatured);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Hero slider auto-advance
  useEffect(() => {
    if (sliderProducts.length === 0) return;
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % sliderProducts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [sliderProducts]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Slider */}
      <section
        className="relative text-white text-center overflow-hidden py-16 md:py-24"
        style={{
          background: 'linear-gradient(135deg, #8DC63F 0%, #FFB300 60%, #E53935 100%)',
        }}
      >
        {/* Slider */}
        <div className="relative max-w-xl mx-auto rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {sliderProducts.length > 0 && (
            <div className="relative h-64 md:h-80">
              <img
                src={sliderProducts[slide].image || placeholderImg}
                alt={sliderProducts[slide].name}
                className="w-full h-full object-cover object-center"
                style={{ filter: 'brightness(0.7) saturate(1.2)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-primary/60 to-transparent flex flex-col justify-end p-8">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-lg">
                  {sliderProducts[slide].name}
                </h2>
                <p className="text-lg md:text-xl font-semibold text-yellow drop-shadow">
                  {naturalTexts[slide % naturalTexts.length]}
                </p>
              </div>
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {sliderProducts.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-200 ${
                      idx === slide ? 'bg-yellow scale-125' : 'bg-white/40'
                    }`}
                    onClick={() => setSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
          {sliderProducts.length === 0 && loading && (
            <div className="h-64 md:h-80 flex flex-col items-center justify-center bg-primary/30">
               <p className="text-xl font-bold text-white">Loading Slides...</p>
            </div>
          )}
          {sliderProducts.length === 0 && !loading && (
            <div className="h-64 md:h-80 flex flex-col items-center justify-center bg-primary/30">
              <img src={placeholderImg} alt="Cups n Straws Logo" className="h-24 w-24 mb-4 rounded-full border-4 border-white shadow-xl" />
              <p className="text-xl font-bold text-white">No featured drinks for slider yet.</p>
            </div>
          )}
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-extrabold mt-8 mb-3 animate-fade-in drop-shadow-lg">
          Cups <span className="text-yellow">n</span> <span className="text-accent">Straws</span>
        </h1>
        <p className="text-2xl md:text-3xl italic mb-8 animate-fade-in drop-shadow">
          <span className="bg-white/20 px-3 py-1 rounded text-yellow font-semibold">If nature didn't make it, don't take it.</span>
        </p>
        <a
          href="#featured"
          className="inline-block bg-accent hover:bg-yellow text-white font-bold py-4 px-10 rounded-full shadow-xl text-lg transition-colors duration-200 animate-fade-in border-4 border-white hover:border-yellow"
        >
          See Our Drinks
        </a>
        {/* Decorative Blobs */}
        <div className="absolute left-0 top-0 w-48 h-48 bg-primary rounded-full opacity-30 -z-10 animate-fade-in" style={{ filter: 'blur(40px)', top: '-3rem', left: '-3rem' }} />
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-accent rounded-full opacity-30 -z-10 animate-fade-in" style={{ filter: 'blur(40px)', bottom: '-3rem', right: '-3rem' }} />
        <div className="absolute left-1/2 top-0 w-32 h-32 bg-yellow rounded-full opacity-20 -z-10 animate-fade-in" style={{ filter: 'blur(32px)', left: '60%', top: '-2rem' }} />
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-primary mb-8 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-primary/10 rounded-lg p-6 flex flex-col items-center shadow animate-fade-in">
            <SparklesIcon className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-bold text-primary mb-1">100% Natural</h3>
            <p className="text-gray-700 text-center">No preservatives, no additives. Just pure, natural ingredients.</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-6 flex flex-col items-center shadow animate-fade-in">
            <TruckIcon className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-bold text-primary mb-1">Delivery & Pickup</h3>
            <p className="text-gray-700 text-center">Order for delivery or pick up at your convenience in Abuja and Ilorin.</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-6 flex flex-col items-center shadow animate-fade-in">
            <UsersIcon className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-bold text-primary mb-1">For All Ages</h3>
            <p className="text-gray-700 text-center">Healthy and delicious drinks for infants, kids, adults, and the aged.</p>
          </div>
        </div>
      </section>

      {/* Featured Drinks Section - Using Swiper Slider */}
      <section id="featured" className="py-12 bg-yellow/10 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-accent mb-8 text-center">Featured Drinks</h2>
        {loading ? (
          <div className="text-center text-accent">Loading...</div>
        ) : featuredSectionProducts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No featured products available right now.</div>
        ) : (
          <>
            <Swiper
              modules={[Navigation, Pagination]} // Enable Navigation and Pagination
              spaceBetween={30}
              slidesPerView={1} // Default for mobile
              navigation // Add navigation arrows
              pagination={{ clickable: true }} // Add clickable pagination dots
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
              className="pb-10" // Add padding-bottom for pagination dots if they overlap
            >
              {featuredSectionProducts.map((product) => {
                const minPrice = product.sizes.length > 0 
                  ? Math.min(...product.sizes.map(s => s.price)) 
                  : 0;
                return (
                  <SwiperSlide key={product.id}>
                    <Link 
                      to={`/product/${product.id}`}
                      className="block w-full h-full bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-between text-center hover:shadow-xl transition-shadow duration-200"
                      style={{ minHeight: '380px' }}
                    >
                      <div> {/* Inner container for top content */}
                        {product.image && (
                          <img src={product.image} alt={product.name} className="h-32 w-32 object-cover rounded-full mb-4 border-4 border-primary mx-auto" />
                        )}
                        <h3 className="text-xl font-bold text-primary mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-3 text-sm line-clamp-3 h-16">{product.description}</p>
                      </div>
                      <div> {/* Inner container for bottom content (price) */}
                        {product.sizes.length > 0 ? (
                          <p className="text-primary font-semibold text-lg mt-auto">
                            From ₦{minPrice}
                          </p>
                        ) : (
                          <p className="text-gray-500 mt-auto">Price not available</p>
                        )}
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            
            {/* "View All Our Drinks" button remains */}
            <div className="text-center mt-16"> 
              <Link
                to="/products"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg transition-colors duration-200"
              >
                View All Our Drinks
              </Link>
            </div>
          </>
        )}
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-white max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-primary mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center animate-fade-in">
            <ShoppingCartIcon className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-bold text-primary mb-1">1. Choose Your Drink</h3>
            <p className="text-gray-700 text-center">Browse our menu and pick your favorite natural drink.</p>
          </div>
          <div className="flex flex-col items-center animate-fade-in">
            <ArchiveBoxIcon className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-bold text-primary mb-1">2. Place Your Order</h3>
            <p className="text-gray-700 text-center">Order online for delivery or pickup at your convenience.</p>
          </div>
          <div className="flex flex-col items-center animate-fade-in">
            <FaceSmileIcon className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-bold text-primary mb-1">3. Enjoy!</h3>
            <p className="text-gray-700 text-center">Sit back, relax, and enjoy your fresh, healthy drink.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-primary/10 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-primary mb-8 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
            <p className="text-gray-700 italic mb-2">“Absolutely delicious and so healthy! My kids love the tigernut juice.”</p>
            <div className="flex items-center">
              <span className="inline-block h-8 w-8 rounded-full bg-primary mr-2"></span>
              <span className="font-bold text-primary">Aisha, Abuja</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
            <p className="text-gray-700 italic mb-2">“Fast delivery and the drinks taste so fresh. Highly recommend!”</p>
            <div className="flex items-center">
              <span className="inline-block h-8 w-8 rounded-full bg-accent mr-2"></span>
              <span className="font-bold text-accent">Chinedu, Gwarinpa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social & Contact Section */}
      <section className="py-12 bg-white max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Stay Connected</h2>
        <p className="text-gray-700 mb-4">Follow us on social media or reach out on WhatsApp for orders and inquiries.</p>
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://facebook.com/cupsnstraws" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent text-2xl"> <FaFacebookF /> </a>
          <a href="https://twitter.com/cupsnstraws" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent text-2xl"> <FaTwitter /> </a>
          <a href="https://instagram.com/cups_n_straws" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent text-2xl"> <FaInstagram /> </a>
          <a href="https://wa.me/2349124674867" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent text-2xl"> <FaWhatsapp /> </a>
        </div>
        <div className="text-gray-700">Efab Global Estate Inner Northern, Abuja | WhatsApp: 09124674867</div>
      </section>
    </div>
  );
};

export default Home;