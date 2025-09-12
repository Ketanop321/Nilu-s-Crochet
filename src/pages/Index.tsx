import { useState, useEffect } from 'react';
import { products, categories } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ShoppingBag, Instagram, Heart, Sparkles, LogIn, User } from 'lucide-react';
import { CartItem } from '@/types/cart';
import CartDrawer from '@/components/CartDrawer';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  const addToCart = (product: CartItem) => {
    const newCart = [...cartItems, { ...product, quantity: 1 }];
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const featuredProducts = products.slice(0, 6);

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
              <Link to="/" className="text-[#F5C6D1] font-medium">Home</Link>
              <Link to="/shop" className="text-[#2B2B2B] hover:text-[#F5C6D1] transition-colors">Shop</Link>
              <Link to="/about" className="text-[#2B2B2B] hover:text-[#F5C6D1] transition-colors">About</Link>
              <Link to="/contact" className="text-[#2B2B2B] hover:text-[#F5C6D1] transition-colors">Contact</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-[#F5C6D1] hover:text-[#F5C6D1]/80 transition-colors font-medium">Admin</Link>
              )}
            </nav>
            
            <div className="flex items-center space-x-3">
              <CartDrawer>
                <Button variant="ghost" size="sm">
                  <ShoppingBag className="w-5 h-5" />
                </Button>
              </CartDrawer>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    Welcome, {user.full_name || user.username}
                  </span>
                  {user.role === 'admin' && (
                    <Badge className="bg-[#F5C6D1] text-[#2B2B2B]">Admin</Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <User className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="w-5 h-5 mr-1" />
                    Login
                  </Link>
                </Button>
              )}
              
              <Button variant="ghost" size="sm" asChild>
                <a href="https://instagram.com/bloom_with_nilu" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-[#F5C6D1]" />
              <Badge className="bg-[#F5C6D1]/20 text-[#2B2B2B] border-[#F5C6D1]">
                Handmade with Love
              </Badge>
              <Sparkles className="w-6 h-6 text-[#F5C6D1]" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-[#2B2B2B] leading-tight">
              Beautiful
              <span className="block text-transparent bg-gradient-to-r from-[#F5C6D1] to-[#C7D8C7] bg-clip-text">
                Crochet Creations
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover unique, handcrafted crochet pieces made with love. From delicate flowers to charming keychains, each piece tells a story of creativity and care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button size="lg" asChild className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B] px-8">
                <Link to="/shop">Shop Collection</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-[#F5C6D1] text-[#2B2B2B] hover:bg-[#F5C6D1]/10">
                <a href="https://instagram.com/bloom_with_nilu" target="_blank" rel="noopener noreferrer">
                  Follow on Instagram
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#2B2B2B] mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category} to={`/shop?category=${category}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-medium text-[#2B2B2B] group-hover:text-[#F5C6D1] transition-colors">
                      {category}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked favorites from our collection. Each piece is lovingly crafted with attention to detail and quality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" asChild className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#F5C6D1]/20 to-[#C7D8C7]/20">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <Instagram className="w-12 h-12 text-[#F5C6D1] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">Follow Our Journey</h2>
            <p className="text-gray-600 mb-8">
              Get behind-the-scenes looks at our crafting process, new product previews, and custom order inspiration on Instagram.
            </p>
            <Button size="lg" asChild className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]">
              <a href="https://instagram.com/bloom_with_nilu" target="_blank" rel="noopener noreferrer">
                @bloom_with_nilu
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B2B2B] text-white py-12 px-4">
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
                {!user && (
                  <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">Login</Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block text-gray-400 hover:text-white transition-colors">Admin</Link>
                )}
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