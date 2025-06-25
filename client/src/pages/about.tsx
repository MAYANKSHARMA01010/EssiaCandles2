import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'wouter';
import { Leaf, Heart, Award, Truck } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Leaf className="h-8 w-8 text-purple-primary" />,
      title: "Eco-Friendly",
      description: "We use only natural, sustainable materials and eco-friendly packaging to minimize our environmental impact."
    },
    {
      icon: <Heart className="h-8 w-8 text-purple-primary" />,
      title: "Handcrafted with Love",
      description: "Each candle is carefully hand-poured by our skilled artisans, ensuring the highest quality and attention to detail."
    },
    {
      icon: <Award className="h-8 w-8 text-purple-primary" />,
      title: "Premium Quality",
      description: "We source the finest natural wax and fragrances to create candles that burn cleanly and evenly for hours."
    },
    {
      icon: <Truck className="h-8 w-8 text-purple-primary" />,
      title: "Fast Shipping",
      description: "We carefully package and ship your order quickly, with free shipping on orders over $50."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & Master Candle Maker",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      bio: "Sarah founded Essia with a passion for creating beautiful, sustainable candles that bring joy and tranquility to every home."
    },
    {
      name: "Michael Chen",
      role: "Scent Designer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      bio: "With over 10 years of experience in fragrance design, Michael creates our unique scent blends that capture the essence of nature."
    },
    {
      name: "Emma Rodriguez",
      role: "Quality Assurance Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      bio: "Emma ensures every candle meets our high standards for quality, safety, and performance before it reaches your home."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-light to-purple-accent py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-purple-dark mb-6">
            Our Story
          </h1>
          <p className="text-xl text-purple-dark/80 leading-relaxed">
            Born from a love of natural beauty and sustainable living, Essia creates 
            premium handcrafted candles that transform any space into a sanctuary of peace and tranquility.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-purple-dark/80 mb-6 leading-relaxed">
                At Essia, we believe that the simple act of lighting a candle can transform 
                your entire day. Our mission is to create premium, eco-friendly candles that 
                not only fill your space with beautiful fragrances but also contribute to 
                moments of mindfulness and self-care in your daily life.
              </p>
              <p className="text-lg text-purple-dark/80 mb-8 leading-relaxed">
                Every candle we create is a testament to our commitment to quality, sustainability, 
                and the belief that everyone deserves a little luxury in their everyday routine.
              </p>
              <Link href="/products">
                <Button className="bg-purple-primary text-white hover:bg-purple-primary/90 px-8 py-3">
                  Explore Our Collection
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://pixabay.com/get/g59ad65ce27ad1e939857c426498b65f99605cdf3b3d34af0e57fe73e91676aaedf3721dbb6e4ad7205382eef00e527cb590bbb1bb003373405abcb838e559307_1280.jpg"
                alt="Artisan crafting candles with care and precision"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-purple-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
              Our Values
            </h2>
            <p className="text-lg text-purple-dark/70 max-w-2xl mx-auto">
              These core principles guide everything we do, from sourcing materials 
              to crafting each candle with care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-purple-dark mb-4">
                    {value.title}
                  </h3>
                  <p className="text-purple-dark/70 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-purple-dark/70 max-w-2xl mx-auto">
              The passionate individuals behind every Essia candle, dedicated to 
              bringing you the finest handcrafted products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-8">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-6 shadow-lg"
                  />
                  <h3 className="text-xl font-semibold text-purple-dark mb-2">
                    {member.name}
                  </h3>
                  <p className="text-purple-primary font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-purple-dark/70 leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-purple-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-purple-dark mb-4">
              Our Crafting Process
            </h2>
            <p className="text-lg text-purple-dark/70 max-w-2xl mx-auto">
              From selecting premium materials to the final quality check, 
              every step is carefully executed to ensure perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Source Materials",
                description: "We carefully select the finest natural soy wax, cotton wicks, and premium fragrance oils."
              },
              {
                step: "02",
                title: "Blend Fragrances",
                description: "Our scent designer creates unique fragrance profiles that capture the essence of nature."
              },
              {
                step: "03",
                title: "Hand Pour",
                description: "Each candle is carefully hand-poured by our skilled artisans with attention to every detail."
              },
              {
                step: "04",
                title: "Quality Check",
                description: "Every candle undergoes rigorous quality testing before it's packaged and shipped to you."
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="bg-purple-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-purple-dark mb-4">
                  {process.title}
                </h3>
                <p className="text-purple-dark/70 leading-relaxed">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-primary to-purple-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Discover the perfect candle for your home and experience the 
            difference that premium, handcrafted quality makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-white text-purple-primary hover:bg-gray-100 px-8 py-3 font-semibold">
                Shop Collection
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-primary px-8 py-3 font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
