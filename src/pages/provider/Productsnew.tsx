import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package, Eye, Star, CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IProduct } from '@/store/providerCommonInterfaces';



export default function Productsnew() {
  const { toast } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    specifications: '',
    images: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  

    const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Git/Project1/Backend/GetAllProductsProvider.php",{withCredentials:true}
      );
      const data = response.data;

      if (data.success) {
        setProducts(data.products);
      } else {
        toast({
          title: "Fetch Data",
          description: "Fetching products failed.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      // setError("Something went wrong.");
    } finally {
      // setLoading(false);
    }
  };

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name) {
      errors.name = "Product name is required.";
    }
    if (!formData.description) {
      errors.description = "Product description is required.";
    }
    // Validate that the price is a positive number
    if (formData.price === null || formData.price <= 0) {
      errors.price = "Price must be a positive number.";
    }
    if (!formData.category) {
      errors.category = "Category is required.";
    }
    // Add a validation rule for specifications
    if (!formData.specifications) {
      errors.specifications = "Specifications are required.";
    }
    // Add a validation rule for the image file
    // if (!imageFile || !formData.product_id ) {
    //   errors.imageFile = "An image is required.";
    // }
    return errors;
  };


  // Add sortBy state for product sorting
  const [sortBy, setSortBy] = useState<string>('name');

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          // If average_rating is not present, fallback to 0
          return (b as any).average_rating - (a as any).average_rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Delete
  const handleDelete = async (id: number) => {
    const res = await axios.post("http://localhost/Git/Project1/Backend/deleteProviderProduct.php", { product_id: id }, { withCredentials: true });
    if (res.data.success) {
      toast({ title: "Deleted", description: "Product deleted successfully", variant: "destructive" });
      setProducts(products.filter(p => p.product_id !== id));
      fetchProducts();
    }
    else {
      toast({ title: "Failed", description: "Product deleted failed", variant: "destructive" });
    }
  };

  // Add or Update Product
  const handleSave = async () => {
    // Step 1: Validate the form data
    const errors = validateForm();

    // Step 2: Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      // If errors exist, update the error state and stop
      setFormErrors(errors);
      return;
    }
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
      console.log("Form Data:", formDataToSend);
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
  const handleEdit = (product: IProduct) => {
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
      <>
        <div >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
              <p className="text-gray-500 dark:text-gray-400">Manage your products and inventory</p>
            </div>


            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600" onClick={() => {
                  setSelectedProduct(null);
                  setFormData({ name: '', description: '', price: 0, category: '', specifications: '' });
                  setImageFile(null);
                  setImagePreview(null);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg ">
                <DialogHeader>
                  <DialogTitle>{formData.product_id ? "Edit Product" : "Add Product"}</DialogTitle>
                </DialogHeader>
                
                <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
  {/* Name */}
  <div>
    <Label htmlFor="name">Name</Label>
    <Input
      id="name"
      value={formData.name || ''}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    />
    {formErrors.name && (
      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
    )}
  </div>

  {/* Description */}
  <div>
    <Label htmlFor="description">Description</Label>
    <Textarea
      id="description"
      value={formData.description || ''}
      onChange={(e) =>
        setFormData({ ...formData, description: e.target.value })
      }
    />
    {formErrors.description && (
      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
    )}
  </div>

  {/* Price */}
  <div>
    <Label htmlFor="price">Price</Label>
    <Input
      id="price"
      type="number"
      min={0}
      step={0.01}
      value={formData.price || ''}
      onChange={(e) => {
        const val = e.target.value;
        if (!isNaN(Number(val))) {
          setFormData({ ...formData, price: Number(val) });
        }
      }}
    />
    {formErrors.price && (
      <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
    )}
  </div>

  {/* Category Dropdown */}
  <div>
    <Label htmlFor="category">Category</Label>
    <select
      id="category"
      value={formData.category || ''}
      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      className="w-full border rounded px-2 py-1"
    >
      <option value="">Select Category</option>
      <option value="solar">Solar</option>
      <option value="electric">Electric</option>
      <option value="normal">Normal</option>
    </select>
    {formErrors.category && (
      <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
    )}
  </div>

  {/* Specifications */}
  <div>
    <Label>Specifications</Label>
    <Textarea
      value={formData.specifications || ''}
      onChange={(e) =>
        setFormData({ ...formData, specifications: e.target.value })
      }
    />
    {formErrors.specifications && (
      <p className="text-red-500 text-sm mt-1">{formErrors.specifications}</p>
    )}
  </div>

  {/* Image Upload */}
  <div>
    <Label>Upload Image</Label>
    <Input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
    />
    {formErrors.imageFile && (
      <p className="text-red-500 text-sm mt-1">{formErrors.imageFile}</p>
    )}
    {imagePreview && (
      <img
        src={imagePreview}
        alt="Preview"
        className="mt-3 rounded-lg shadow-md max-h-40 object-cover"
      />
    )}
  </div>

  {/* Save/Update Button */}
  <Button className="w-full mt-3" onClick={handleSave}>
    {formData.product_id ? "Update" : "Save"}
  </Button>
</div>

              </DialogContent>
            </Dialog>
          </div>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <DollarSign className="h-6 w-6 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-red-600">
                    {products.filter((o) => o.is_approved === 1).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">In active</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {products.filter((o) => o.is_approved === 0).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">

              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <Badge variant="secondary">{product.category ? product.category : "#No tag"}</Badge>
                      <Badge variant={product.is_approved ? "default" : "destructive"} >
                        {product.is_approved ? "Approved by admin" : "Pending"}
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
      </>



    </div>
  );
}
