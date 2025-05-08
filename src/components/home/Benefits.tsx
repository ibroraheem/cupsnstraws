import React from 'react';
import { Droplet, Heart, LeafyGreen, Truck } from 'lucide-react';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <Droplet className="h-12 w-12 text-primary-600" />,
      title: '100% Natural',
      description: 'All our drinks are made with natural ingredients, free from artificial additives and preservatives.'
    },
    {
      icon: <Heart className="h-12 w-12 text-primary-600" />,
      title: 'Health Benefits',
      description: 'Our drinks are not just delicious but packed with nutrients and health-boosting properties.'
    },
    {
      icon: <LeafyGreen className="h-12 w-12 text-primary-600" />,
      title: 'Freshly Made',
      description: 'We make our drinks fresh daily to ensure you get the best taste and nutritional value.'
    },
    {
      icon: <Truck className="h-12 w-12 text-primary-600" />,
      title: 'Home Delivery',
      description: 'Enjoy the convenience of our drinks delivered right to your doorstep in Abuja and Ilorin.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-600 mb-4">
            Why Choose Our Drinks?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to bringing you the best natural beverages with maximum health benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary-600 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;