import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Instagram, ShoppingBag, Sparkles, Award, Users } from 'lucide-react';
import CartDrawer from "@/components/CartDrawer";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F0EB] via-white to-[#E8F6F3]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F5C6D1]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#2B2B2B]">Nilu' Crochet</h1>
                <p className="text-xs text-gray-600">Handmade with Love</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-[#2B2B2B] hover:text-[#F5C6D1] transition-colors">Home</Link>
              <Link to="/shop" className="text-[#2B2B2B] hover:text-[#F5C6D1] transition-colors">Shop</Link>
              <Link to="/about" className="text-[#F5C6D1] font-medium">About</Link>
              <Link to="/contact" className="text-[#2B2B2B] hover:text-[#F5C6D1] transition-colors">Contact</Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              <CartDrawer>
                <Button variant="ghost" size="sm">
                  <ShoppingBag className="w-5 h-5" />
                </Button>
              </CartDrawer>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://instagram.com/bloom_with_nilu" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="w-6 h-6 text-[#F5C6D1]" />
            <Badge className="bg-[#F5C6D1]/20 text-[#2B2B2B] border-[#F5C6D1]">
              Our Story
            </Badge>
            <Sparkles className="w-6 h-6 text-[#F5C6D1]" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-6">
            About
            <span className="block text-transparent bg-gradient-to-r from-[#F5C6D1] to-[#C7D8C7] bg-clip-text">
              Nilu' Crochet
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to Nilu' Crochet, where every stitch tells a story of passion, creativity, and love. 
            We create beautiful handmade crochet pieces that bring joy and warmth to your life.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#2B2B2B]">Our Journey</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Nilu' Crochet began as a passionate hobby that blossomed into a heartfelt business. 
                What started with simple patterns and basic stitches has evolved into intricate designs 
                that capture the essence of handmade artistry.
              </p>
              <p>
                Each piece in our collection is carefully crafted with premium yarns and attention to detail. 
                We believe that handmade items carry a special energy - the love and care of the maker's hands, 
                creating something truly unique for every customer.
              </p>
              <p>
                From delicate flower brooches to cozy accessories, every creation reflects our commitment 
                to quality, creativity, and the timeless art of crochet.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-[#F5C6D1]/30 to-[#C7D8C7]/30 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="w-16 h-16 text-[#F5C6D1] mx-auto mb-4" />
                    <p className="text-[#2B2B2B] font-medium">Founder Photo</p>
                    <p className="text-sm text-gray-600">Coming Soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#2B2B2B] mb-12">What Makes Us Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">Handmade with Love</h3>
                <p className="text-gray-600">
                  Every piece is carefully crafted by hand, ensuring unique character and personal touch in each creation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">Premium Quality</h3>
                <p className="text-gray-600">
                  We use only the finest yarns and materials to ensure durability and beauty in every product.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">Custom Orders</h3>
                <p className="text-gray-600">
                  We love creating personalized pieces. DM us on Instagram for custom colors, sizes, and designs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#2B2B2B] mb-12">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Design", description: "We sketch and plan each unique pattern" },
              { step: "2", title: "Select", description: "Choose premium yarns and materials" },
              { step: "3", title: "Create", description: "Hand-crochet with love and attention" },
              { step: "4", title: "Deliver", description: "Package carefully and ship to you" }
            ].map((item, index) => (
              <Card key={index} className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-[#F5C6D1] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-[#2B2B2B] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#F5C6D1]/20 to-[#C7D8C7]/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">Ready to Explore Our Collection?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our handcrafted crochet pieces and find the perfect addition to your collection. 
            Each item is made with love and attention to detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]">
              <Link to="/shop">Shop Collection</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-[#F5C6D1] text-[#2B2B2B] hover:bg-[#F5C6D1]/10">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2B2B2B] text-white py-12 px-4 mt-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">Nilu' Crochet</span>
              </div>
              <p className="text-gray-400 text-sm">
                Handmade crochet products crafted with love and care. Each piece is unique and made to order.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <Link to="/shop" className="block text-gray-400 hover:text-white transition-colors">Shop</Link>
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
                <Link to="/policies" className="block text-gray-400 hover:text-white transition-colors">Policies</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="space-y-2 text-sm">
                <a href="https://instagram.com/bloom_with_nilu" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
                <p className="text-gray-400">DM for custom orders</p>
                <p className="text-gray-400">India-wide delivery</p>
                <p className="text-gray-400">Cash on Delivery available</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Nilu' Crochet. All rights reserved. Made with ❤️ in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}