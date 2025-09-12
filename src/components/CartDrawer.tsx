import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartItem } from '@/types/cart';

interface CartDrawerProps {
  children: React.ReactNode;
}

export default function CartDrawer({ children }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }
    const newCart = [...cartItems];
    newCart[index].quantity = newQuantity;
    updateCart(newCart);
  };

  const removeItem = (index: number) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-[#F5C6D1] text-[#2B2B2B] text-xs">
              {itemCount}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg bg-white">
        <SheetHeader>
          <SheetTitle className="flex items-center text-[#2B2B2B]">
            <ShoppingBag className="w-5 h-5 mr-2 text-[#F5C6D1]" />
            Shopping Cart ({itemCount} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingBag className="w-16 h-16 text-[#F5C6D1] mb-4" />
              <h3 className="text-lg font-semibold text-[#2B2B2B] mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some beautiful crochet items to get started</p>
              <Button 
                asChild 
                className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]"
                onClick={() => setIsOpen(false)}
              >
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#2B2B2B] text-sm truncate">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.category}</p>
                      <p className="text-sm font-semibold text-[#2B2B2B]">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Cart Summary */}
              <div className="py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-[#2B2B2B]">Total: ₹{subtotal}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700"
                  >
                    Clear Cart
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button 
                    asChild 
                    className="w-full bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/checkout">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Checkout (COD)
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    asChild 
                    className="w-full border-[#F5C6D1] text-[#2B2B2B] hover:bg-[#F5C6D1]/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <p>🚚 Free shipping across India</p>
                  <p>💰 Cash on Delivery available</p>
                  <p>📦 Delivery in 7-10 business days</p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}