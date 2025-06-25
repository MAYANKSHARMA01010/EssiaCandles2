import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ProductCard } from '../components/product-card';
import { Skeleton } from '../components/ui/skeleton';

// Define the Product type or import it from your models/types
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
  featured?: boolean;
  scent?: string;
  // Add other fields as needed
};

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products?featured=true'],
  });

  const testimonials = [
    {
      name: "Sarah M.",
      comment: "The Lavender Dreams candle has completely transformed my evening routine. The scent is divine and lasts for hours!",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64"
    },
    {
      name: "Michael R.",
      comment: "Beautiful candles with amazing quality. The packaging was so elegant, perfect for gifting. Will definitely order again!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64"
    },
    {
      name: "Emma K.",
      comment: "I love the eco-friendly approach and the candles burn evenly for hours. The Rose Bergamot is my absolute favorite!",
      avatar: "https://pixabay.com/get/g78fa9d2eab2b3c3c083369f92dc92ca3415042b9c1396feb0fe32e0a61e72e4d5a5cac8f9bf8302e6417a76bf345eb5f75d3a259afc008c4a22d2680117b70e9_1280.jpg"
    }
  ];

  const categories = [
    {
      name: "Scented Candles",
      description: "Aromatherapy & Ambiance",
      image: "https://pixabay.com/get/ga5964b10247ead1e00aff4707b7c4e04e2f169257a34eb4d99ddffcfb685fc7bbc944fd9ad00e498583a98170b315b6a5de959d6b80bb19b797593955baff743_1280.jpg",
      category: "scented"
    },
    {
      name: "Unscented Candles",
      description: "Pure Light & Warmth",
      image: "https://pixabay.com/get/g2d1015e580405db50f1b77c1ac1438a4c134d077bcab1aeb8eefbba3fc1f724d01ced9da299bea9a11d951e287b64b865fbb44dc0484a9f9a9b83e33cc90c1a2_1280.jpg",
      category: "unscented"
    },
    {
      name: "Seasonal Collection",
      description: "Holiday & Special Occasions",
      image: "https://pixabay.com/get/g1e1de51a70a42d9426dd8c1bfbd691475135844edadd701beaa19318fc6ea648dd3950faa264a9079d1193a0fdf844c23746ad392b8db0a5a270a0397483273d_1280.jpg",
      category: "seasonal"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-light to-purple-accent py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl lg:text-6xl font-serif font-bold text-purple-dark mb-6">
                Illuminate Your Space with <span className="text-purple-primary">Essia</span>
              </h2>
              <p className="text-xl text-purple-dark/80 mb-8 leading-relaxed">
                Discover our collection of premium handcrafted candles, carefully made with 
                natural ingredients to create the perfect ambiance for your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products">
                  <Button className="bg-purple-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-primary/90 transition-all duration-200 transform hover:scale-105">
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    variant="outline" 
                    className="border-2 border-purple-primary text-purple-primary px-8 py-4 rounded-lg font-semibold hover:bg-purple-primary hover:text-white transition-all duration-200"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://pixabay.com/get/g6aa323937f00762e6880deb53f0fe7e69f4662a0ee06fe9af3c79f5a304ae90cda687adad3212ad7a0ef2eec55a63e1b77148cacef0d7985a66f834ec91cb5da_1280.jpg"
                alt="Beautiful arrangement of lavender scented candles creating warm ambiance"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
              Featured Collection
            </h3>
            <p className="text-lg text-purple-dark/70 max-w-2xl mx-auto">
              Each candle is thoughtfully crafted with natural wax and carefully selected 
              fragrances to transform your space into a sanctuary.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="bg-purple-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-primary/90 transition-all duration-200 transform hover:scale-105">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-purple-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
              Shop by Category
            </h3>
            <p className="text-lg text-purple-dark/70">
              Find the perfect candle for every mood and occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.category} href={`/products?category=${category.category}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="text-2xl font-serif font-bold mb-2">{category.name}</h4>
                      <p className="text-white/90">{category.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-6">
                The Art of Candle Making
              </h3>
              <p className="text-lg text-purple-dark/80 mb-6 leading-relaxed">
                At Essia, we believe in the transformative power of handcrafted candles. 
                Each candle is carefully made using premium natural wax, cotton wicks, and 
                thoughtfully selected fragrances that create moments of tranquility in your daily life.
              </p>
              <p className="text-lg text-purple-dark/80 mb-8 leading-relaxed">
                Our commitment to sustainability means we use eco-friendly materials and 
                recyclable packaging, ensuring that your relaxation doesn't come at the cost of our planet.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-primary mb-2">500+</div>
                  <div className="text-purple-dark/70">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-primary mb-2">50+</div>
                  <div className="text-purple-dark/70">Unique Scents</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://pixabay.com/get/g59ad65ce27ad1e939857c426498b65f99605cdf3b3d34af0e57fe73e91676aaedf3721dbb6e4ad7205382eef00e527cb590bbb1bb003373405abcb838e559307_1280.jpg"
                alt="Artisan hands carefully crafting premium candles in a workshop setting"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-purple-light/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
              What Our Customers Say
            </h3>
            <p className="text-lg text-purple-dark/70">
              Real experiences from real people who love Essia candles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-purple-dark/80 mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-purple-dark">{testimonial.name}</div>
                      <div className="text-purple-dark/60 text-sm">Verified Customer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-purple-primary to-purple-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-white shadow-2xl">
            <CardContent className="p-12">
              <h3 className="text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
                Stay in the Loop
              </h3>
              <p className="text-lg text-purple-dark/70 mb-8">
                Be the first to know about new arrivals, exclusive offers, and candle care tips. 
                Join our community of candle lovers!
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 border-purple-secondary focus:ring-purple-primary focus:border-purple-primary"
                />
                <Button
                  type="submit"
                  className="bg-purple-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-primary/90 transition-all duration-200 transform hover:scale-105"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-sm text-purple-dark/50 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
