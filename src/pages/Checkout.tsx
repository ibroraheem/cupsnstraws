import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Check } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useFlutterwave, CustomFlutterwaveConfig } from '../hooks/useFlutterwave'; // Import CustomFlutterwaveConfig
import { formatCurrency } from '../utils/formatCurrency';

interface DeliveryInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  deliveryMethod: 'pickup' | 'delivery';
  pickupLocation: string;
}

interface FormErrors {
  [key: string]: string;
}

const DELIVERY_FEE = {
  Abuja: 1500,
};

const PICKUP_LOCATIONS = {
  Abuja: ['Efab Global Estate'],
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  // const { initializePayment } = useFlutterwave(); // Old hook usage
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'Abuja',
    address: '',
    deliveryMethod: 'delivery',
    pickupLocation: PICKUP_LOCATIONS.Abuja[0],
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // Pre-fill contact information if user is logged in
  useEffect(() => {
    // Example: Check if user is logged in and has saved contact info
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setDeliveryInfo(prev => ({
        ...prev,
        firstName: userData.firstName || prev.firstName,
        lastName: userData.lastName || prev.lastName,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
      }));
    }
  }, []);

  // Configuration for the useFlutterwave hook
  const flutterwavePaymentConfig: CustomFlutterwaveConfig = useMemo(() => ({
    amount: getTotalPrice(), // Or getTotalForPayment() if they can differ
    email: deliveryInfo.email,
    firstName: deliveryInfo.firstName,
    lastName: deliveryInfo.lastName,
    phone: deliveryInfo.phone,
    metadata: {
      firstName: deliveryInfo.firstName,
      lastName: deliveryInfo.lastName,
      phone: deliveryInfo.phone,
      deliveryMethod: deliveryInfo.deliveryMethod,
      address: deliveryInfo.deliveryMethod === 'delivery' ? deliveryInfo.address : deliveryInfo.pickupLocation,
      items: items.map(item => ({
        name: item.product.name,
        size: item.selectedSize.size,
        quantity: item.quantity,
        price: item.selectedSize.price,
      })),
    },
    onSuccess: () => {
      setIsOrderComplete(true);
      clearCart();
      setIsLoading(false); // Ensure loading is stopped on success
    },
    onCancel: () => {
      setIsLoading(false);
      console.log('[Checkout.tsx] Payment cancelled by user or failed.');
    },
  }), [
    getTotalPrice, // Make sure this is stable or correctly memoized if it's a function from a hook
    deliveryInfo, 
    items, 
    clearCart
  ]);

  const { initializePayment } = useFlutterwave(flutterwavePaymentConfig);


  if (items.length === 0 && !isOrderComplete) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === 'city') {
      setDeliveryInfo(prev => ({
        ...prev,
        pickupLocation: PICKUP_LOCATIONS[value as keyof typeof PICKUP_LOCATIONS][0],
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!deliveryInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!deliveryInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!deliveryInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(deliveryInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!deliveryInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (deliveryInfo.deliveryMethod === 'delivery' && !deliveryInfo.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Checkout.tsx] handleSubmit: Fired');
    
    console.log('[Checkout.tsx] handleSubmit: Validating form...');
    if (!validateForm()) {
      console.log('[Checkout.tsx] handleSubmit: Validation failed');
      return;
    }
    console.log('[Checkout.tsx] handleSubmit: Validation successful');
    
    setIsLoading(true);

    try {
      // const amount = getTotalForPayment(); // Amount is now part of flutterwavePaymentConfig
      console.log('[Checkout.tsx] handleSubmit: Calling initializePayment from hook.');
      // initializePayment from the hook is called directly. It doesn't take arguments anymore.
      // It also doesn't need to be awaited as it just triggers the modal.
      initializePayment(); 
      // The try-catch here might not catch errors from the modal itself,
      // those are handled by onCancel or errors within the Flutterwave SDK.
    } catch (error) {
      // This catch is unlikely to be hit for payment process errors,
      // but good for other unexpected errors in this block.
      console.error('Error in handleSubmit before triggering payment:', error);
      setIsLoading(false);
    }
  };

  // getTotalForPayment might still be useful for displaying the amount on the button,
  // but the actual amount for payment is passed via flutterwavePaymentConfig.
  const getTotalForPayment = (): number => {
    return getTotalPrice();
  };

  if (isOrderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-4">Order Completed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We've received your payment and will process your order shortly.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md inline-block transition-colors"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/cart')}
          className="text-primary hover:text-green-600 font-medium flex items-center mb-8"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Cart
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Checkout Form */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-primary mb-6">Checkout</h1>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={deliveryInfo.firstName}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={deliveryInfo.lastName}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={deliveryInfo.email}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={deliveryInfo.phone}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Delivery Options</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="city" className="block text-gray-700 mb-2">
                      City *
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={deliveryInfo.city}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Abuja">Abuja</option>
                      <option value="Ilorin">Ilorin</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="delivery"
                          name="deliveryMethod"
                          value="delivery"
                          checked={deliveryInfo.deliveryMethod === 'delivery'}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <label htmlFor="delivery" className="text-gray-700">
                          Home Delivery
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="pickup"
                          name="deliveryMethod"
                          value="pickup"
                          checked={deliveryInfo.deliveryMethod === 'pickup'}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <label htmlFor="pickup" className="text-gray-700">
                          Pickup (Free)
                        </label>
                      </div>
                    </div>
                    {deliveryInfo.deliveryMethod === 'delivery' && (
                      <p className="text-sm text-yellow-700 mt-3 bg-yellow-50 p-2 rounded-md">
                        Please note: Delivery fee will be paid separately upon delivery and is determined by distance and rider availability.
                      </p>
                    )}
                  </div>
                  
                  {deliveryInfo.deliveryMethod === 'delivery' ? (
                    <div>
                      <label htmlFor="address" className="block text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={deliveryInfo.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                      ></textarea>
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="pickupLocation" className="block text-gray-700 mb-2">
                        Pickup Location *
                      </label>
                      <select
                        id="pickupLocation"
                        name="pickupLocation"
                        value={deliveryInfo.pickupLocation}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {PICKUP_LOCATIONS[deliveryInfo.city as keyof typeof PICKUP_LOCATIONS].map(location => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Payment</h2>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200 flex items-center">
                    <CreditCard className="w-6 h-6 text-primary mr-3" />
                    <span className="text-gray-700">
                      Secure payment powered by Flutterwave
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Processing...' : `Pay ${formatCurrency(getTotalForPayment())}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-28">
              <h2 className="text-xl font-bold text-primary mb-4">Order Summary</h2>
              
              <div className="mb-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover rounded-md mr-3"
                      />
                      <div>
                        <p className="text-gray-700">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {item.selectedSize.size}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(item.selectedSize.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-sm">(To be paid separately, determined by distance & rider)</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold text-primary border-t border-gray-200 pt-3">
                  <span>Total (Online Payment)</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
