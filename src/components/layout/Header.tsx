import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import Logo from '../shared/Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="z-10">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-lg font-medium ${
                isScrolled ? 'text-primary-600' : 'text-white'
              } hover:text-primary-500 transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-lg font-medium ${
                isScrolled ? 'text-primary-600' : 'text-white'
              } hover:text-primary-500 transition-colors`}
            >
              Our Drinks
            </Link>
            <Link
              to="/contact"
              className={`text-lg font-medium ${
                isScrolled ? 'text-primary-600' : 'text-white'
              } hover:text-primary-500 transition-colors`}
            >
              Contact
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center text-primary-600 hover:text-primary-500 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-primary-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Navigation Button */}
          <div className="flex items-center md:hidden">
            <Link
              to="/cart"
              className="relative mr-4 flex items-center text-primary-600"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-primary-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-primary-600 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <Link
            to="/"
            className="text-2xl font-bold text-white mb-8 hover:text-yellow-500 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-2xl font-bold text-white mb-8 hover:text-yellow-500 transition-colors"
          >
            Our Drinks
          </Link>
          <Link
            to="/contact"
            className="text-2xl font-bold text-white hover:text-yellow-500 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;