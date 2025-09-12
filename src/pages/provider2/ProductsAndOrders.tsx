import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Package, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export interface Review {
  review_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  images: string; // stored path from backend
  category: string;
  specifications: string;
  is_approved: boolean;
  created_at: string;
  reviews?: Review[];
}

export default function Products() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    specifications: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllProductProvider.php", { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setProducts(res.data.products);
        }
      })
      .catch(() => console.log("Failed to fetch products"));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete
  const handleDelete = async (id: number) => {
    const res = await axios.post("http://localhost/Git/Project1/Backend/deleteProviderProduct.php", { product_id: id }, { withCredentials: true });
    if (res.data.success) {
      toast({ title: "Deleted", description: "Product deleted successfully", variant: "destructive" });
      setProducts(products.filter(p => p.product_id !== id));
    }
  };

  // Add or Update Product
  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value.toString());
        }
      });
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      let res;
      if (formData.product_id) {
        formDataToSend.append("product_id", String(formData.product_id));
        res = await axios.post("http://localhost/Git/Project1/Backend/editProductProvider.php", formDataToSend, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data.success) {
          toast({ title: "Updated", description: "Product updated successfully" });
        }
      } else {
        res = await axios.post("http://localhost/Git/Project1/Backend/editProductProvider.php", formDataToSend, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data.success) {
          toast({ title: "Added", description: "Product added successfully" });
        }
      }
      fetchProducts();
      setIsDialogOpen(false);
      setFormData({ name: '', description: '', price: 0, category: '', specifications: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  // Edit
  const handleEdit = (product: Product) => {
    setFormData(product);
    setImageFile(null);
    setImagePreview(`http://localhost/Git/Project1/Backend/${product.images}`); // existing image
    setIsDialogOpen(true);
  };

  // Handle file change + preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your products and inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600" onClick={() => {
              setFormData({ name: '', description: '', price: 0, category: '', specifications: '' });
              setImageFile(null);
              setImagePreview(null);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{formData.product_id ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div>
                <Label>Price</Label>
                <Input type="number" value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              </div>
              <div>
                <Label>Specifications</Label>
                <Textarea value={formData.specifications || ''} onChange={(e) => setFormData({ ...formData, specifications: e.target.value })} />
              </div>
              <div>
                <Label>Upload Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-3 rounded-lg shadow-md max-h-40 object-cover" />
                )}
              </div>
              <Button className="w-full mt-3" onClick={handleSave}>
                {formData.product_id ? "Update" : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.product_id} className="hover:shadow-xl transition rounded-2xl overflow-hidden">
            {/* Image */}
            <div className="h-48 w-full bg-gray-100 flex justify-center items-center">
              <img
                src={`http://localhost/Git/Project1/Backend/${product.images}`}
                alt={product.name}
                className="h-full w-auto object-cover"
              />
            </div>

            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge variant={product.is_approved ? "default" : "destructive"}>
                    {product.is_approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(product.product_id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-2xl font-bold text-green-600">Rs. {product.price.toLocaleString()}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                      <Eye className="w-4 h-4" /> View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{product.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Image */}
                      <div className="w-full flex justify-center">
                        <img
                          src={`http://localhost/Git/Project1/Backend/${product.images}`}
                          alt={product.name}
                          className="rounded-xl shadow-md max-h-80"
                        />
                      </div>

                      {/* Right Details */}
                      <div className="space-y-3">
                        <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                        <p><strong>Specifications:</strong> {product.specifications}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Status:</strong> {product.is_approved ? "Approved" : "Pending"}</p>
                        <p className="text-2xl font-bold text-green-600">Rs. {product.price}</p>

                        {/* Reviews */}
                        <div>
                          <h3 className="text-lg font-semibold mt-4">Reviews</h3>
                          <div className="max-h-32 overflow-y-auto space-y-2 mt-2">
                            {product.reviews && product.reviews.length > 0 ? (
                              product.reviews.map((r) => (
                                <div key={r.review_id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-yellow-400" : "text-gray-400"}`} />
                                    ))}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-400">No reviews yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
        </div>
      )}
    </div>
  );
}
