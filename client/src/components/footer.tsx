import { Link } from 'wouter';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { FaPinterest } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-purple-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h4 className="text-2xl font-serif font-bold mb-4">Essia</h4>
            <p className="text-white/80 mb-6 max-w-md">
              Creating moments of tranquility through premium handcrafted candles. 
              Made with love, care, and the finest natural ingredients.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <FaPinterest className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <span className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer">
                    Products
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer">
                    Contact
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="font-semibold mb-4">Customer Service</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  Care Instructions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  Wholesale
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2024 Essia. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
