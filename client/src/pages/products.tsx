import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import type { Product } from '@shared/schema';

export default function Products() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }, [location]);

  const buildApiUrl = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    
    const queryString = params.toString();
    return `/api/products${queryString ? `?${queryString}` : ''}`;
  };

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: [buildApiUrl()],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL to reflect search
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (category !== 'all') params.append('category', category);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'scented', label: 'Scented Candles' },
    { value: 'unscented', label: 'Unscented Candles' },
    { value: 'seasonal', label: 'Seasonal Collection' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-purple-dark mb-4">
            Our Collection
          </h1>
          <p className="text-lg text-purple-dark/70 max-w-2xl mx-auto">
            Discover our complete range of premium handcrafted candles, 
            each designed to create the perfect atmosphere for your space.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search candles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        {!isLoading && (
          <div className="mb-8">
            <p className="text-purple-dark/70">
              Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-80 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🕯️</div>
            <h3 className="text-2xl font-serif font-bold text-purple-dark mb-2">
              No Products Found
            </h3>
            <p className="text-purple-dark/70 mb-6">
              We couldn't find any products matching your criteria. 
              Try adjusting your search or filters.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                window.history.pushState({}, '', '/products');
              }}
              className="bg-purple-primary text-white hover:bg-purple-primary/90"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
