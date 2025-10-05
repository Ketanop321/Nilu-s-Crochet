import { useState, useEffect } from 'react';
import { categories } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { CartItem } from '@/types/cart';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { productsAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { transformProducts } from '@/lib/transformProduct';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('new');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.shortDescription || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => (a.price.regular ?? 0) - (b.price.regular ?? 0));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.price.regular ?? 0) - (a.price.regular ?? 0));
        break;
      case 'new':
      default:
        // Keep original order for new arrivals
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, sortBy, products]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F0EB] via-white to-[#E8F6F3]">
      <Header currentPage="shop" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2B2B2B] mb-2">Shop Collection</h1>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 border-[#F5C6D1]/30">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 border-[#F5C6D1]/30">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="bg-[#F5C6D1]/20 text-[#2B2B2B]">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="bg-[#F5C6D1]/20 text-[#2B2B2B]">
                "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#F5C6D1]/20 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-[#F5C6D1]" />
            </div>
            <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">
              {products.length === 0 ? 'No products available' : 'No products found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0 
                ? 'Check back soon for our amazing crochet collection!' 
                : 'Try adjusting your search or filters'
              }
            </p>
            {products.length > 0 && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}