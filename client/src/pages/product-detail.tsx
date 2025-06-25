import { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';
import { useCart } from '../context/cart-context';
import { formatPrice } from '../lib/utils';
import { ArrowLeft, Clock, Package, Leaf } from 'lucide-react';
import { Link } from 'wouter';

// Define the Product type according to your product object structure
type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  scent?: string;
  size?: string;
  burnTime?: number;
  ingredients?: string;
};

export default function ProductDetail() {
  const [, params] = useRoute('/products/:id');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
    enabled: !!params?.id,
  });

  const handleAddToCart = async () => {
    if (!product || !product.inStock) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(Number(product.id), quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="h-[600px] rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-12 w-32" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🕯️</div>
            <h1 className="text-3xl font-serif font-bold text-purple-dark mb-4">
              Product Not Found
            </h1>
            <p className="text-purple-dark/70 mb-8">
              The candle you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button className="bg-purple-primary text-white hover:bg-purple-primary/90">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/products">
          <Button variant="ghost" className="mb-8 text-purple-dark hover:text-purple-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
            />
            {product.featured && (
              <Badge className="absolute top-6 right-6 bg-purple-primary hover:bg-purple-primary text-white">
                Best Seller
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                <Badge variant="secondary" className="text-white bg-gray-800 text-lg px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-purple-dark mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-purple-primary mb-4">
                {formatPrice(product.price)}
              </p>
              <p className="text-lg text-purple-dark/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.scent && (
              <div>
                <h3 className="font-semibold text-purple-dark mb-2">Scent Profile</h3>
                <Badge variant="outline" className="text-purple-primary border-purple-primary">
                  {product.scent}
                </Badge>
              </div>
            )}

            {/* Product Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-purple-dark mb-4">Product Details</h3>
                
                {product.size && (
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-purple-primary" />
                    <span className="text-purple-dark/80">Size: {product.size}</span>
                  </div>
                )}
                
                {product.burnTime && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-purple-primary" />
                    <span className="text-purple-dark/80">Burn Time: {product.burnTime} hours</span>
                  </div>
                )}
                
                {product.ingredients && (
                  <div className="flex items-start space-x-3">
                    <Leaf className="h-5 w-5 text-purple-primary mt-0.5" />
                    <div>
                      <p className="text-purple-dark/80 font-medium mb-1">Ingredients:</p>
                      <p className="text-purple-dark/70 text-sm">{product.ingredients}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Separator />

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-purple-dark font-medium">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-purple-dark focus:ring-purple-primary focus:border-purple-primary"
                  disabled={!product.inStock}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className="w-full bg-purple-primary text-white hover:bg-purple-primary/90 py-3 text-lg font-semibold"
                size="lg"
              >
                {isAddingToCart
                  ? 'Adding to Cart...'
                  : !product.inStock
                  ? 'Out of Stock'
                  : `Add to Cart - ${formatPrice(parseFloat(product.price) * quantity)}`
                }
              </Button>

              {product.inStock && (
                <p className="text-sm text-purple-dark/60 text-center">
                  Free shipping on orders over $50
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <h3 className="text-2xl font-serif font-bold text-purple-dark mb-6">
              Candle Care Instructions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-purple-dark mb-2">First Burn</h4>
                <p className="text-purple-dark/70 text-sm">
                  Allow the candle to burn until the wax melts evenly across the entire surface 
                  to prevent tunneling.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-dark mb-2">Wick Trimming</h4>
                <p className="text-purple-dark/70 text-sm">
                  Trim the wick to 1/4 inch before each use to ensure a clean, 
                  even burn and prevent smoking.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-dark mb-2">Safety</h4>
                <p className="text-purple-dark/70 text-sm">
                  Never leave a burning candle unattended and keep away from 
                  drafts, pets, and children.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
