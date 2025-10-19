import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package, ShoppingBag, Users, TrendingUp, Loader2 } from 'lucide-react';
import { categories } from '@/data/products';
import { Product } from '@/types/product';
import ImageUpload from '@/components/ImageUpload';
import { productsAPI, getErrorMessage } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { transformProducts } from '@/lib/transformProduct';

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
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
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadProducts();
  }, [user, navigate]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getAll();
      const productsData = transformProducts(response.data.data || []);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('category', formData.category || '');
      fd.append('price', formData.price);
      fd.append('availability', formData.availability || '');
      fd.append('shortDescription', formData.shortDescription || '');
      fd.append('leadTime', formData.leadTime || '');
      fd.append('sku', formData.sku || '');
      if (formData.imageUrl) fd.append('imageUrl', formData.imageUrl);

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, fd);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(fd);
        toast.success('Product added successfully');
      }

      await loadProducts();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error('Save product error:', err);
      toast.error(getErrorMessage(err));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category || 'Custom',
      price: (product.price?.regular ?? 0).toString(),
      availability: product.availability || 'Made to Order',
      shortDescription: product.shortDescription || '',
      leadTime: product.leadTime || '7-10 days',
      sku: product.sku || '',
      imageUrl: product.imageUrl || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(productId);
      await loadProducts();
      toast.success('Product deleted successfully');
    } catch (err: any) {
      console.error('Delete product error:', err);
      toast.error(getErrorMessage(err));
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
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2B2B2B] mb-2">Product Management</h1>
          <p className="text-gray-600">Manage your crochet product catalog</p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#F5C6D1]" />
            <span className="ml-3 text-lg">Loading products...</span>
          </div>
        ) : (
          <>
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

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Product Image</Label>
                    <div className="mt-1">
                      <ImageUpload
                        onUploadSuccess={(imageUrl) => {
                          setFormData(prev => ({
                            ...prev,
                            imageUrl: imageUrl
                          }));
                        }}
                        onUploadError={(error) => {
                          console.error('Upload failed:', error);
                          toast.error(`Upload failed: ${error}`);
                        }}
                        buttonText={formData.imageUrl ? 'Change Image' : 'Upload Image'}
                        className="mt-1"
                      />
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="h-32 w-32 object-cover rounded-md border border-gray-200"
                        />
                      </div>
                    )}
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
                      loading="lazy"
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
                        <span className="font-semibold text-[#2B2B2B]">₹{product.price?.regular ?? 0}</span>
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
          </>
        )}
      </div>
    </div>
  );
}