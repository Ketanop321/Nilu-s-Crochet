import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Plus, Edit, Trash2, Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { Product, categories } from '@/data/products';

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Flowers' as Product['category'],
    price: '',
    availability: 'In Stock' as Product['availability'],
    shortDescription: '',
    leadTime: '',
    sku: '',
    imageUrl: ''
  });

  useEffect(() => {
    // Load products from localStorage or use default data
    const savedProducts = localStorage.getItem('admin_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Import default products
      import('@/data/products').then(({ products: defaultProducts }) => {
        setProducts(defaultProducts);
        localStorage.setItem('admin_products', JSON.stringify(defaultProducts));
      });
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('admin_products', JSON.stringify(newProducts));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Flowers',
      price: '',
      availability: 'In Stock',
      shortDescription: '',
      leadTime: '',
      sku: '',
      imageUrl: ''
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      id: editingProduct?.id || `P${String(products.length + 1).padStart(3, '0')}`,
      title: formData.title,
      category: formData.category,
      price: parseInt(formData.price),
      availability: formData.availability,
      shortDescription: formData.shortDescription,
      leadTime: formData.leadTime,
      sku: formData.sku,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    };

    if (editingProduct) {
      // Update existing product
      const newProducts = products.map(p => p.id === editingProduct.id ? productData : p);
      saveProducts(newProducts);
    } else {
      // Add new product
      saveProducts([...products, productData]);
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      price: product.price.toString(),
      availability: product.availability,
      shortDescription: product.shortDescription,
      leadTime: product.leadTime,
      sku: product.sku,
      imageUrl: product.imageUrl
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const newProducts = products.filter(p => p.id !== productId);
      saveProducts(newProducts);
    }
  };

  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.availability === 'In Stock').length,
    madeToOrder: products.filter(p => p.availability === 'Made to Order').length,
    limitedEdition: products.filter(p => p.availability === 'Limited Edition').length
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
                <h1 className="text-xl font-bold text-[#2B2B2B]">Nilu' Crochet Admin</h1>
                <p className="text-xs text-gray-600">Product Management</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-[#2B2B2B] hover:text-[#F5C6D1] transition-colors">Home</Link>
              <Link to="/shop" className="text-[#2B2B2B] hover:text-[#F5C6D1] transition-colors">Shop</Link>
              <span className="text-[#F5C6D1] font-medium">Admin</span>
            </nav>
            
            <Button asChild className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]">
              <Link to="/">Back to Site</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2B2B2B] mb-2">Product Management</h1>
          <p className="text-gray-600">Manage your crochet product catalog</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-[#2B2B2B]">{stats.totalProducts}</p>
                </div>
                <Package className="w-8 h-8 text-[#F5C6D1]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Made to Order</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.madeToOrder}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Limited Edition</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.limitedEdition}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger className="border-[#F5C6D1]/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="availability">Availability *</Label>
                    <Select value={formData.availability} onValueChange={(value) => handleSelectChange('availability', value)}>
                      <SelectTrigger className="border-[#F5C6D1]/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Stock">In Stock</SelectItem>
                        <SelectItem value="Made to Order">Made to Order</SelectItem>
                        <SelectItem value="Limited Edition">Limited Edition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    required
                    className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="leadTime">Lead Time *</Label>
                    <Input
                      id="leadTime"
                      name="leadTime"
                      value={formData.leadTime}
                      onChange={handleInputChange}
                      required
                      className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                      placeholder="e.g., 7-10 days, In Stock"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                      placeholder="e.g., NC-FL-001"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="border-[#F5C6D1]/30 focus:border-[#F5C6D1]"
                    placeholder="https://example.com/image.jpg (optional - will use default if empty)"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setIsAddDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#F5C6D1] hover:bg-[#F5C6D1]/80 text-[#2B2B2B]">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#2B2B2B]">Products ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-[#2B2B2B] truncate">{product.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{product.shortDescription}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="font-semibold text-[#2B2B2B]">₹{product.price}</span>
                        <span className="text-gray-500">{product.sku}</span>
                        <Badge 
                          className={`text-xs ${
                            product.availability === 'In Stock' 
                              ? 'bg-green-100 text-green-800' 
                              : product.availability === 'Made to Order'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {product.availability}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="text-[#F5C6D1] hover:text-[#F5C6D1]/80"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}