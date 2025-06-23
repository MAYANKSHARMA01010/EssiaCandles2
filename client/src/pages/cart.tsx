import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, isLoading } = useCart();
  const { toast } = useToast();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set([...prev, cartItemId]));
    try {
      await updateQuantity(cartItemId, newQuantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (cartItemId: number, productName: string) => {
    try {
      await removeFromCart(cartItemId);
      toast({
        title: "Item Removed",
        description: `${productName} has been removed from your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 flex space-x-4">
                  <div className="h-24 w-24 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-purple-primary/20 mb-8" />
            <h1 className="text-3xl font-serif font-bold text-purple-dark mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-purple-dark/70 mb-8 text-lg">
              Looks like you haven't added any candles to your cart yet. 
              Discover our beautiful collection and find your perfect scent.
            </p>
            <Link href="/products">
              <Button className="bg-purple-primary text-white hover:bg-purple-primary/90 px-8 py-3">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-purple-dark mb-8">
          Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <Link href={`/products/${item.product.id}`}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-24 w-24 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="text-lg font-semibold text-purple-dark hover:text-purple-primary transition-colors cursor-pointer mb-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-purple-dark/60 text-sm mb-2">
                        {item.product.description}
                      </p>
                      {item.product.scent && (
                        <p className="text-purple-primary text-sm font-medium mb-3">
                          {item.product.scent}
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium text-purple-dark w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={updatingItems.has(item.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-purple-primary">
                            {formatPrice(parseFloat(item.product.price) * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id, item.product.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-purple-dark">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-purple-dark/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-purple-dark/80">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    {cartTotal >= 50 ? 'Free' : formatPrice(5.99)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-purple-dark">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal + (cartTotal >= 50 ? 0 : 5.99))}</span>
                </div>
                
                {cartTotal < 50 && (
                  <p className="text-sm text-purple-dark/60 text-center bg-purple-light p-3 rounded-lg">
                    Add {formatPrice(50 - cartTotal)} more for free shipping!
                  </p>
                )}

                <Link href="/checkout">
                  <Button className="w-full bg-purple-primary text-white hover:bg-purple-primary/90 py-3 text-lg font-semibold">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/products">
                  <Button variant="outline" className="w-full border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
