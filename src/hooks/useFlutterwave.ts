import { useCallback } from 'react';
// Assuming useFlutterwaveSDK is the primary hook from the library
import { useFlutterwave as useFlutterwaveSDK } from 'flutterwave-react-v3';

// Define a more specific type for metadata
// For FlutterwaveResponse, we'll use 'any' for now if the library doesn't export a clear type
type FlutterwaveResponse = any; 

interface PaymentMetadata {
  firstName: string;
  lastName: string;
  phone: string;
  deliveryMethod: 'pickup' | 'delivery';
  address: string; // Address or pickup location
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  // Allow other string-keyed properties if necessary, though being specific is better
  [key: string]: any; 
}

// This is the type for the argument to our custom hook
export interface CustomFlutterwaveConfig {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  metadata: PaymentMetadata;
  onSuccess: (response: FlutterwaveResponse) => void; // Using our defined FlutterwaveResponse
  onCancel: () => void;
}

export const useFlutterwave = (dynamicConfig: CustomFlutterwaveConfig) => {
  // publicKey is read inside the hook, ensuring it's part of the hook's lifecycle
  const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY as string;

  // The config object for the Flutterwave SDK hook
  // This structure should align with what useFlutterwaveSDK expects
  const sdkConfig = {
    public_key: publicKey,
    tx_ref: `cupsnstraws-${Date.now().toString()}`,
    amount: dynamicConfig.amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd", // User should verify these are desired
    customer: {
      email: dynamicConfig.email,
      phone_number: dynamicConfig.phone,
      name: `${dynamicConfig.firstName} ${dynamicConfig.lastName}`,
    },
    meta: dynamicConfig.metadata,
    customizations: {
      title: "Cups & Straws",
      description: "Payment for your order",
      logo: "https://cupsnstraws.com/logo.png", // User should verify this URL
    },
    callback: (response: FlutterwaveResponse) => { // Using our defined FlutterwaveResponse
      console.log('[useFlutterwave.ts] Payment SDK callback received:', response);
      if (response && (response.status === 'successful' || response.status === 'completed')) {
        dynamicConfig.onSuccess(response);
      } else {
        console.warn('[useFlutterwave.ts] Payment SDK callback - status not successful or response undefined:', response);
        dynamicConfig.onCancel();
      }
    },
    onClose: () => {
      console.log('[useFlutterwave.ts] Payment modal closed by user.');
      dynamicConfig.onCancel();
    },
  };

  // This is the function returned by the Flutterwave SDK hook, which triggers the payment modal.
  // It's crucial that sdkConfig is stable or memoized if it's a dependency of useFlutterwaveSDK
  // or the function it returns.
  const handleFlutterwavePayment = useFlutterwaveSDK(sdkConfig);

  const initializePayment = useCallback(() => {
    if (!publicKey) {
      console.error("Flutterwave public key is not defined. Please set VITE_FLUTTERWAVE_PUBLIC_KEY in your environment variables.");
      alert("Payment system is currently unavailable. Missing configuration.");
      return;
    }
    console.log('[useFlutterwave.ts] Attempting to trigger Flutterwave modal.');
    // The function returned by useFlutterwaveSDK is called to initiate the payment.
    // The TS error "Expected 1 arguments, but got 0" suggests handleFlutterwavePayment needs an argument.
    // Let's try passing the sdkConfig to it, as this is a common pattern if the hook itself doesn't fully consume it.
    handleFlutterwavePayment(sdkConfig); 
  }, [
    publicKey, 
    handleFlutterwavePayment,
    sdkConfig // sdkConfig is now an explicit dependency for the call
    // sdkConfig is implicitly a dependency of handleFlutterwavePayment because useFlutterwaveSDK uses it.
    // Adding all individual properties of dynamicConfig to ensure useCallback updates if they change,
    // which in turn would recreate sdkConfig and thus handleFlutterwavePayment.
    // This is a bit verbose but ensures correctness if sdkConfig isn't memoized.
    // A better approach might be to memoize sdkConfig with useMemo.
    // For now, let's list them to be safe, as they are used to build sdkConfig.
    // dynamicConfig.amount, dynamicConfig.email, dynamicConfig.firstName, dynamicConfig.lastName,
    // dynamicConfig.phone, dynamicConfig.metadata, dynamicConfig.onSuccess, dynamicConfig.onCancel
  ]);

  // To make dependencies cleaner for initializePayment, we can memoize sdkConfig
  // However, the primary dependency for initializePayment should be handleFlutterwavePayment and publicKey.
  // The dependencies of useFlutterwaveSDK (which creates handleFlutterwavePayment) are implicitly handled.

  return { initializePayment };
};
