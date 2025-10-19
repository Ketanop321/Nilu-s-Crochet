import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Instagram, ShoppingBag, LogIn } from 'lucide-react';
import CartDrawer from '@/components/CartDrawer';
import ProfileDropdown from '@/components/ProfileDropdown';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  currentPage?: 'home' | 'shop' | 'about' | 'contact' | 'admin';
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F5C6D1]/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2B2B2B]">Nilu' Crochet</h1>
              <p className="text-xs text-gray-600">Handmade with Love</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors ${
                currentPage === 'home' ? 'text-[#F5C6D1] font-medium' : 'text-[#2B2B2B] hover:text-[#F5C6D1]'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`transition-colors ${
                currentPage === 'shop' ? 'text-[#F5C6D1] font-medium' : 'text-[#2B2B2B] hover:text-[#F5C6D1]'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors ${
                currentPage === 'about' ? 'text-[#F5C6D1] font-medium' : 'text-[#2B2B2B] hover:text-[#F5C6D1]'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors ${
                currentPage === 'contact' ? 'text-[#F5C6D1] font-medium' : 'text-[#2B2B2B] hover:text-[#F5C6D1]'
              }`}
            >
              Contact
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`transition-colors ${
                  currentPage === 'admin' ? 'text-[#F5C6D1] font-medium' : 'text-[#2B2B2B] hover:text-[#F5C6D1]'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <CartDrawer>
              <Button variant="ghost" size="sm">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </CartDrawer>
            
            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Welcome, {user.profile?.full_name || user.full_name || user.username}
                </span>
                {user.role === 'admin' && (
                  <Badge className="bg-[#F5C6D1] text-[#2B2B2B]">Admin</Badge>
                )}
                <ProfileDropdown />
              </div>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="w-5 h-5 mr-1" />
                  Login
                </Link>
              </Button>
            )}
            
            {/* Instagram */}
            <Button variant="ghost" size="sm" asChild>
              <a href="https://instagram.com/bloom_with_nilu" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
