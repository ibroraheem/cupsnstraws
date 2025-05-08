import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../shared/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-600 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Logo className="mb-4" />
            <p className="mb-4 opacity-80">
              If nature didn't make it, don't take it. Our drinks are made with the freshest ingredients 
              for your health and enjoyment, with zero preservatives.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/cups_n_straws"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-500 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com/cupsnstraws"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-500 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/cupsnstraws"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-500 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="opacity-80 hover:opacity-100 hover:text-yellow-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="opacity-80 hover:opacity-100 hover:text-yellow-500 transition-colors"
                >
                  Our Drinks
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="opacity-80 hover:opacity-100 hover:text-yellow-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="opacity-80 hover:opacity-100 hover:text-yellow-500 transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 mt-1" />
                <span>+234 912 467 4867</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0 mt-1" />
                <span>hello@cupsnstraws.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-1" />
                <span>
                  Efab Global Estate Inner Northern, Abuja
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center opacity-70">
          <p>&copy; {new Date().getFullYear()} Cups N Straws. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;