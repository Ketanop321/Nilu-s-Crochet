import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Instagram, ShoppingBag, Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
// import { CartDrawer } from '@/components/CartDrawer';
import CartDrawer from "@/components/CartDrawer";


export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

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
              <Link to="/about" className="text-[#2B2B2B] hover:text-[#F5C6D1] transition-colors">About</Link>
              <Link to="/contact" className="text-[#F5C6D1] font-medium">Contact</Link>
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
        <div className="text-center mb-12">
          <Badge className="bg-[#F5C6D1]/20 text-[#2B2B2B] border-[#F5C6D1] mb-6">
            Get in Touch
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-6">
            Contact
            <span className="block text-transparent bg-gradient-to-r from-[#F5C6D1] to-[#C7D8C7] bg-clip-text">
              Nilu' Crochet
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have questions about our products, 
            want to place a custom order, or just want to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-[#2B2B2B]">
                <Mail className="w-5 h-5 mr-2 text-[#F5C6D1]" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                    rows={5}
                    placeholder="Tell us about your inquiry, custom order requirements, or any questions you have..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Instagram Contact */}
            <Card className="border-0 bg-gradient-to-r from-[#F5C6D1]/20 to-[#C7D8C7]/20 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">Instagram DMs</h3>
                    <p className="text-gray-600 mb-4">
                      For custom orders and quick questions, DM us on Instagram. We're most active there!
                    </p>
                    <Button asChild className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]">
                      <a href="https://instagram.com/bloom_with_nilu" target="_blank" rel="noopener noreferrer">
                        @bloom_with_nilu
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Orders */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">Custom Orders</h3>
                    <p className="text-gray-600 mb-4">
                      Want something special? We love creating personalized pieces! Tell us about:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      <li>• Custom colors and patterns</li>
                      <li>• Specific sizes or dimensions</li>
                      <li>• Special occasions or themes</li>
                      <li>• Bulk orders for events</li>
                    </ul>
                    <p className="text-sm text-[#F5C6D1] font-medium">
                      Custom orders typically take 10-14 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">Response Time</h3>
                    <p className="text-gray-600 mb-4">
                      We typically respond to messages within 24 hours. For urgent inquiries, 
                      Instagram DMs are your best bet!
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📧 Email: 24-48 hours</p>
                      <p>📱 Instagram: 2-6 hours</p>
                      <p>🎨 Custom quotes: 1-2 business days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">Shipping</h3>
                    <p className="text-gray-600 mb-4">
                      We ship across India with free delivery and Cash on Delivery option available.
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>🚚 Free shipping nationwide</p>
                      <p>💰 Cash on Delivery available</p>
                      <p>📦 Delivery: 7-10 business days</p>
                      <p>🎁 Carefully packaged with love</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-[#2B2B2B] mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "How long do custom orders take?",
                a: "Custom orders typically take 10-14 business days, depending on complexity. We'll give you an estimated timeline when you place your order."
              },
              {
                q: "Do you ship outside India?",
                a: "Currently, we only ship within India. We're working on international shipping options for the future!"
              },
              {
                q: "Can I return or exchange items?",
                a: "Due to the handmade nature of our products, we don't accept returns or exchanges. However, if there's a quality issue, please contact us immediately."
              },
              {
                q: "What payment methods do you accept?",
                a: "We currently accept Cash on Delivery (COD) for all orders within India. Online payment options are coming soon!"
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[#2B2B2B] mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
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