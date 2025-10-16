declare global {
  interface Window {
    WidgetCheckout: {
      new (config: {
        publicKey: string;
        currency: string;
        amountInCents: number;
        reference: string;
        redirectUrl: string;
        customerData?: {
          name: string;
          email: string;
          phoneNumber: string;
          phoneNumberPrefix: string;
        };
        shippingAddress?: {
          addressLine1: string;
          city: string;
          region: string;
          country: string;
          postalCode: string;
        };
        onSuccess?: (result: any) => void;
        onError?: (error: any) => void;
        onExit?: () => void;
      }): {
        open: (callback?: (result: any) => void) => void;
        close: () => void;
      };
    };
  }
}

export {};
