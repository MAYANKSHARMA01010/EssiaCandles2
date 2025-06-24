import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/utils';

// Define the Product type if not already imported
interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  inStock: boolean;
  featured?: boolean;
  scent?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) return;
    
    setIsLoading(true);
    try {
      await addToCart(Number(product.id));
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-xl mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <Badge className="absolute top-4 right-4 bg-purple-primary hover:bg-purple-primary text-white">
              Best Seller
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-white bg-gray-800">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        
        <h4 className="font-semibold text-lg text-purple-dark mb-2 group-hover:text-purple-primary transition-colors">
          {product.name}
        </h4>
        
        <p className="text-purple-dark/60 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {product.scent && (
          <p className="text-sm text-purple-primary mb-2 font-medium">
            {product.scent}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-purple-primary">
            {formatPrice(product.price)}
          </span>
          
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isLoading}
            className="bg-purple-accent text-purple-dark hover:bg-purple-secondary transition-colors duration-200"
            size="sm"
          >
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Link>
  );
}
