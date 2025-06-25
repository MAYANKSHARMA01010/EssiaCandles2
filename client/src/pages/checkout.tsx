import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { useCart } from '../context/cart-context';
import { useToast } from '../hooks/use-toast';
import { formatPrice } from '../lib/utils';
import { apiRequest } from '../lib/queryClient';
import { Lock, CreditCard } from 'lucide-react';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(10, 'Please enter a complete address'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CheckoutFormData) => {
      const shippingCost = cartTotal >= 50 ? 0 : 5.99;
      const totalAmount = cartTotal + shippingCost;

      const order = {
        ...orderData,
        totalAmount: totalAmount.toFixed(2),
        status: 'pending',
      };

      const items = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      return apiRequest('POST', '/api/orders', { order, items });
    },
    onSuccess: async (response) => {
      const order = await response.json();
      await clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id} has been confirmed. You'll receive an email confirmation shortly.`,
      });
      setLocation('/');
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await createOrderMutation.mutateAsync(data);
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingCost = cartTotal >= 50 ? 0 : 5.99;
  const totalAmount = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-purple-dark mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-purple-dark/70 mb-8">
              Please add items to your cart before proceeding to checkout.
            </p>
            <Button 
              onClick={() => setLocation('/products')}
              className="bg-purple-primary text-white hover:bg-purple-primary/90"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-purple-dark mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-dark">
                  <Lock className="h-5 w-5 mr-2" />
                  Secure Checkout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-dark">
                        Contact Information
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email address" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="Enter your phone number" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-dark">
                        Shipping Address
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="shippingAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complete Address</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter your complete shipping address including street, city, state, and ZIP code"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center text-blue-800">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span className="font-medium">Demo Checkout</span>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">
                        This is a demo store. No payment will be processed, but your order 
                        details will be saved for demonstration purposes.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-purple-primary text-white hover:bg-purple-primary/90 py-3 text-lg font-semibold"
                    >
                      {isProcessing ? 'Processing Order...' : `Place Order - ${formatPrice(totalAmount)}`}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-purple-dark">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3 flex-1">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-purple-dark text-sm truncate">
                            {item.product.name}
                          </p>
                          <p className="text-purple-dark/60 text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-purple-dark">
                        {formatPrice(parseFloat(item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-purple-dark/80">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-purple-dark/80">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                      {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-purple-dark">
                    <span>Total</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {cartTotal < 50 && (
                  <p className="text-sm text-purple-dark/60 text-center bg-purple-light p-3 rounded-lg">
                    Add {formatPrice(50 - cartTotal)} more for free shipping!
                  </p>
                )}

                <div className="text-xs text-purple-dark/60 space-y-1">
                  <p>• Free shipping on orders over $50</p>
                  <p>• Secure SSL encrypted checkout</p>
                  <p>• 30-day return policy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
