import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{product.title}</CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{product.category}</span>
          <span className="font-bold">
            ₹{typeof product.price === 'object' ? (product.price.regular || product.price.sale) : product.price}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.shortDescription}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-xs text-muted-foreground">
          {product.availability}
        </span>
        <Button 
          size="sm" 
          className="gap-2"
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
