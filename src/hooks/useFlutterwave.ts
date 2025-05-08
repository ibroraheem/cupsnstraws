import { useCallback } from 'react';
import { useFlutterwave as useFlutterwaveSDK } from 'flutterwave-react-v3';

export const useFlutterwave = () => {
  const flutterwave = useFlutterwaveSDK({
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "",
      phone_number: "",
      name: "",
    },
    customizations: {
      title: "Cups & Straws",
      description: "Payment for your order",
      logo: "https://cupsnstraws.com/logo.png",
    },
  });

  const initializePayment = useCallback(async (config: {
    email: string;
    amount: number;
    metadata: any;
    onSuccess: (response: any) => void;
    onCancel: () => void;
  }) => {
    try {
      const response = await flutterwave.initializePayment({
        amount: config.amount,
        customer: {
          email: config.email,
          name: config.metadata.firstName + ' ' + config.metadata.lastName,
          phone_number: config.metadata.phone,
        },
        meta: config.metadata,
        onClose: () => {
          config.onCancel();
        },
        callback: (response) => {
          if (response.status === 'successful') {
            config.onSuccess(response);
          } else {
            config.onCancel();
          }
        },
      });
    } catch (error) {
      console.error('Payment initialization failed:', error);
      throw error;
    }
  }, [flutterwave]);

  return { initializePayment };
}; 