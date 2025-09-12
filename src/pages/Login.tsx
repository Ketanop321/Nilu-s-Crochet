import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.username, formData.password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F0EB] via-white to-[#E8F6F3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F5C6D1] to-[#C7D8C7] rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2B2B2B]">Nilu' Crochet</h1>
              <p className="text-sm text-gray-600">Handmade with Love</p>
            </div>
          </Link>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-[#2B2B2B]">
              <LogIn className="w-5 h-5 mr-2 text-[#F5C6D1]" />
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                  placeholder="Enter your username or email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#F5C6D1] hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-[#F5C6D1]/10 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                <strong>Demo Admin:</strong> username=admin, password=admin123
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" asChild>
            <Link to="/">
              ← Back to Shop
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}