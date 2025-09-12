import { useState, useEffect } from 'react';
import { products, categories, Product } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SlidersHorizontal, Heart, Instagram, ShoppingBag } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { CartItem } from '@/types/cart';
import CartDrawer from '@/components/CartDrawer';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('new');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

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
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'new':
      default:
        // Keep original order for new arrivals
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, sortBy]);

  const addToCart = (product: Product) => {
    const newCart = [...cartItems, { ...product, quantity: 1 }];
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
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
              <Link to="/shop" className="text-[#F5C6D1] font-medium">Shop</Link>
              <Link to="/about" className="text-[#2B2B2B] hover:text-[#F5C6D1] transition-colors">About</Link>
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2B2B2B] mb-2">Shop Collection</h1>
          <p className="text-gray-600">Discover our handcrafted crochet creations</p>
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
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
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
            <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}