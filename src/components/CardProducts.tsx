import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const getAvailabilityColor = (availability: string) => {
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

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-3 left-3">
          <Badge className={`text-xs ${getAvailabilityColor(product.availability || '')}`}>
            {product.availability}
          </Badge>
        </div>
        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs text-[#2B2B2B] border-[#F5C6D1]">
            {product.category}
          </Badge>
          
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-[#2B2B2B] group-hover:text-[#F5C6D1] transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.shortDescription}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-lg font-semibold text-[#2B2B2B]">
                ₹{(product.price.sale && product.price.sale < product.price.regular) ? product.price.sale : product.price.regular}
              </span>
              <p className="text-xs text-gray-500">{product.leadTime}</p>
            </div>
            
            <Button
              size="sm"
              onClick={() => onAddToCart?.(product)}
              className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B] border-0"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}