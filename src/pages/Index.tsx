import { useState, useEffect } from 'react';
import { categories } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Instagram, Heart, Sparkles } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { productsAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { transformProducts } from '@/lib/transformProduct';

export default function Index() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getAll();
      const productsData = transformProducts(response.data.data || []);
      if (!productsData.length) {
        toast.info('No products found. Add products from the admin dashboard.');
      }
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addToCart = (product: Product) => {
    const unitPrice = product.price.sale && product.price.sale < product.price.regular
      ? product.price.sale
      : product.price.regular;
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      imageUrl: product.images?.[0]?.url || product.imageUrl || '',
      category: product.category,
      price: unitPrice,
      quantity: 1,
    };
    const newCart = [...cartItems, cartItem];
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success('Added to cart');
  };

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F0EB] via-white to-[#E8F6F3]">
      <Header currentPage="home" />

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
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
          
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