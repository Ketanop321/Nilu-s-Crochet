import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingBag, CreditCard, Truck, CheckCircle, Heart, Instagram } from 'lucide-react';
import { CartItem } from '@/types/cart';
import CartDrawer from "@/components/CartDrawer";
// import { CartDrawer } from '@/components/CartDrawer';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    orderNote: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order processing
    setTimeout(() => {
      // Clear cart
      localStorage.removeItem('cart');
      setCartItems([]);
      
      // Redirect to success page or show success message
      alert('Order placed successfully! You will receive a confirmation email shortly.');
      navigate('/');
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F6F0EB] via-white to-[#E8F6F3] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-[#F5C6D1] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#2B2B2B] mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some beautiful crochet items to your cart first.</p>
          <Button asChild className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

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
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-500">Cart</span>
              <span className="text-gray-400">→</span>
              <span className="text-[#F5C6D1] font-medium">Checkout</span>
            </div>

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
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-[#2B2B2B]">
                  <Truck className="w-5 h-5 mr-2 text-[#F5C6D1]" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="orderNote">Order Note (Optional)</Label>
                    <Textarea
                      id="orderNote"
                      name="orderNote"
                      value={formData.orderNote}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for your order..."
                      className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                      rows={3}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-[#2B2B2B]">
                  <CreditCard className="w-5 h-5 mr-2 text-[#F5C6D1]" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 p-4 border border-[#F5C6D1] rounded-lg bg-[#F5C6D1]/10">
                  <input type="radio" checked readOnly className="text-[#F5C6D1]" />
                  <div>
                    <p className="font-medium text-[#2B2B2B]">Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  💡 Only available for orders within India. No online payment required.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-[#2B2B2B]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-[#2B2B2B] text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.category}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-medium text-[#2B2B2B]">₹{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-[#2B2B2B]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-[#2B2B2B]">Total</span>
                    <span className="text-[#2B2B2B]">₹{total}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B] text-lg py-6"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Place Order (COD)
                    </>
                  )}
                </Button>

                {/* Order Info */}
                <div className="text-xs text-gray-600 space-y-1">
                  <p>✅ Free shipping across India</p>
                  <p>📦 Delivery in 7-10 business days</p>
                  <p>💰 Pay cash when you receive</p>
                  <p>📧 Order confirmation via email</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}