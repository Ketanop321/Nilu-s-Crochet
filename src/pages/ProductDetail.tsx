import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Heart, Instagram, Package, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from '@/types/cart';
import { productsAPI } from '@/lib/api';
import { Product } from '@/types/product';
import { transformProduct } from '@/lib/transformProduct';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setProduct(null);
        setIsLoading(false);
        return;
      }
      try {
        setError(null);
        setIsLoading(true);
        const response = await productsAPI.getById(id);
        setProduct(transformProduct(response.data.data));
      } catch (err: any) {
        console.error('Error fetching product:', err);
        const message = err?.message || 'Failed to load product details';
        setError(message);
        toast.error(message);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
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
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Made to Order':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Limited Edition':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F6F0EB] via-white to-[#E8F6F3] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#F5C6D1] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-[#2B2B2B]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F6F0EB] via-white to-[#E8F6F3] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2B2B2B] mb-4">Product not found</h1>
          {error && <p className="text-sm text-gray-600 max-w-sm mx-auto">{error}</p>}
          <Button asChild className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]">
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F0EB] via-white to-[#E8F6F3]">
      <Header currentPage="shop" />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-[#F5C6D1]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#F5C6D1]">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#F5C6D1]">{product.category}</Link>
          <span>/</span>
          <span className="text-[#2B2B2B]">{product.title}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg">
              <img
                src={product.images?.[0]?.url || product.imageUrl || ''}
                alt={product.images?.[0]?.alt || product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, index) => (
                  <div key={`${img.url}-${index}`} className="aspect-square rounded-lg overflow-hidden bg-white/60 border-2 border-transparent hover:border-[#F5C6D1] cursor-pointer transition-colors">
                    <img
                      src={img.url}
                      alt={img.alt || `${product.title} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className={`mb-3 ${getAvailabilityColor(product.availability)}`}>
                {product.availability}
              </Badge>
              <Badge variant="outline" className="ml-2 text-[#2B2B2B] border-[#F5C6D1]">
                {product.category}
              </Badge>
              
              <h1 className="text-3xl font-bold text-[#2B2B2B] mb-4">{product.title}</h1>
              
              <div className="flex items-baseline space-x-2 mb-4">
                <span className="text-3xl font-bold text-[#2B2B2B]">
                  ₹{(product.price.sale && product.price.sale < product.price.regular ? product.price.sale : product.price.regular)}
                </span>
                <span className="text-sm text-gray-500">INR</span>
              </div>
              
              <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
            </div>

            {/* Product Details */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#F5C6D1]" />
                  <div>
                    <p className="font-medium text-[#2B2B2B]">Lead Time</p>
                    <p className="text-sm text-gray-600">{product.leadTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-[#F5C6D1]" />
                  <div>
                    <p className="font-medium text-[#2B2B2B]">SKU</p>
                    <p className="text-sm text-gray-600">{product.sku}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                onClick={addToCart}
                size="lg"
                className="w-full bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B] text-lg py-6"
                disabled={isAddedToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </Button>
              
              <Button variant="outline" size="lg" className="w-full border-[#F5C6D1] text-[#2B2B2B] hover:bg-[#F5C6D1]/10">
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Custom Order Note */}
            <Card className="border-0 bg-gradient-to-r from-[#F5C6D1]/20 to-[#C7D8C7]/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Instagram className="w-6 h-6 text-[#F5C6D1] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#2B2B2B] mb-2">Want Customization?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      DM us on Instagram for custom colors, sizes, or personalized designs.
                    </p>
                    <Button size="sm" asChild className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]">
                      <a href="https://instagram.com/bloom_with_nilu" target="_blank" rel="noopener noreferrer">
                        Message Us
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>🚚 Free shipping across India</p>
              <p>💰 Cash on Delivery available</p>
              <p>📦 Carefully packaged with love</p>
              <p>🔄 No returns or exchanges (handmade items)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}