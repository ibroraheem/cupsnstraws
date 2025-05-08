import React from 'react';
import { Instagram } from 'lucide-react';

const InstagramFeed: React.FC = () => {
  // Mock Instagram images
  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/1406506/pexels-photo-1406506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      caption: 'Start your day with our refreshing Zobo'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/2103949/pexels-photo-2103949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      caption: 'Freshly prepared Tigernut drink ready for delivery'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      caption: 'Our Ginger Drink - perfect for boosting immunity'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/1028637/pexels-photo-1028637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      caption: 'Fresh pineapples for our Pineapple Juice'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-600 mb-4">
            Follow Us on Instagram
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community @cups_n_straws for daily drink inspiration and behind-the-scenes glimpses.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramPosts.map(post => (
            <a
              key={post.id}
              href="https://instagram.com/cups_n_straws"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden rounded-lg"
            >
              <img 
                src={post.image} 
                alt={post.caption} 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary-600/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white text-center p-4">
                  <Instagram className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{post.caption}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://instagram.com/cups_n_straws"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 hover:text-primary-500 font-semibold"
          >
            <Instagram className="mr-2 h-5 w-5" />
            @cups_n_straws
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;