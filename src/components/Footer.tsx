import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cups n Straws</h3>
            <p className="text-gray-300 italic mb-2">
              "If nature didn't make it, don't take it"
            </p>
            <p className="text-gray-300">
              Natural drinks for everyone, from infants to the aged.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Drinks</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Tigernut Juice</li>
              <li className="text-gray-300">Ginger Juice</li>
              <li className="text-gray-300">Beet Juice</li>
              <li className="text-gray-300">Tamarind Juice</li>
              <li className="text-gray-300">Pineapple Juice</li>
              <li className="text-gray-300">Zobo Juice</li>
              <li className="text-gray-300">Cups n Straws Signature</li>
              <li className="text-gray-300">Date Syrup</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Location: Efab Global Estate Inner Northern, Abuja</li>
              <li>WhatsApp: 09124674867</li>
              <li>Delivery: Pickup or Delivery Available</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex flex-col space-y-2">
              <a
                href="https://facebook.com/cupsnstraws"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook: cupsnstraws
              </a>
              <a
                href="https://twitter.com/cupsnstraws"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter: cupsnstraws
              </a>
              <a
                href="https://instagram.com/cups_n_straws"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram: cups_n_straws
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Cups n Straws. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 