import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import { useDashboardStore, Product } from '@/store/dashboardStore';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  images: string;
  category: string;
  specification: string;
  is_approved:boolean;
  createdAt: string;
}
// export interface formData{
//    product_id:number;
//     name: string;
//     description: string;
//     price: number;
//     category: '',
//     specification: '',
//     images: ,
// }

export default function Products() {
  // const { products, addProduct, updateProduct, deleteProduct } = useDashboardStore();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // const products=[];
  const [formData, setFormData] = useState({
    product_id: 0,
    name: '',
    description: '',
    price: 0,
    category: '',
    specification: '',
    images: [] as File[],
  });
  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllProductProvider.php",
      {
        withCredentials: true
      })
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setProducts(data.products);
        }
        else {
          // setError('Failed to load products.');
          // console.log(response.data);
          console.log(" sorry we cant get ur products");
        }
        setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        setLoading(false);
      });


  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (editingProduct) {
      console.log(formData);
      // updateProduct(editingProduct.product_id, formData);
      const responce = await axios.post("http://localhost/Git/Project1/Backend/UpdateProductProvider.php", formData, { withCredentials: true });

      toast({
        title: 'Product Updated',
        description: 'Product has been updated successfully.',
      });
    } else {
      const formDataToSend = new FormData();

      // Append regular text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('specifications', formData.specification);

      // Append selected images (assume you have setSelectedImages from input)
      selectedImages.forEach((file, index) => {
        formDataToSend.append('images[]', file); // 'images[]' is important for multiple files
      });

      const responce = await axios.post("http://localhost/Git/Project1/Backend/AddProductProvider.php", formDataToSend, { withCredentials: true });
      console.log(formData);
      // addProduct(formData);
      toast({
        title: 'Product Added',
        description: 'New product has been added successfully.',
      });
    }

    setFormData({
      product_id: 0,
      name: '',
      description: '',
      price: 0,
      category: '',
      specification: '',
      images: [],
    });
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      specification: product.specification,
      images: Array.isArray(product.images)
    ? product.images
    : typeof product.images === 'string'
      ? JSON.parse(product.images || '[]') // or .split(',') if it's comma-separated
      : [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    // deleteProduct(id);
    toast({
      title: 'Product Deleted',
      description: 'Product has been deleted successfully.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your solar products and inventory</p>
        </div>

        {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="specification">Specifications</Label>
                <Textarea
                  id="specification"
                  value={formData.specification}
                  onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price (Rs.)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  {editingProduct ? 'Update' : 'Add'} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog> */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4" encType='multipart/form-data'>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="specification">Specifications</Label>
                <Textarea
                  id="specification"
                  value={formData.specification}
                  onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price (Rs.)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
              </div>

              {/* ✅ Image Upload */}
              <div>
                <Label htmlFor="images">Product Images</Label>
                <Input
                  id="images"
                  type="file"
                  name='images'
                  multiple
                  // accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                        const fileArray = Array.from(files);
                      // const imageArray = Array.from(files).map((file) => URL.createObjectURL(file));
                      setFormData({ ...formData, images:fileArray});
                      setSelectedImages(fileArray);
                    }
                  }}

                // onChange={(e) => {
                //   const files = e.target.files;
                //   if (files) {
                //     const imageArray = Array.from(files).map((file) => URL.createObjectURL(file));
                //     // setFormData({ ...formData, images:e.target.value});
                //      setSelectedImages(Array.from(files));
                //   }
                // }}
                />
                {/* ✅ Show Preview */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {/* {formData.images.map((imgSrc, index) => ( */}
                  <img
                    // key={index}
                    // src={"../../one.jpeg"}
                    // src={}
                    // alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  {/* ))} */}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600"
                // onClick={()=>inputData}
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </Button>
              </div>
            </form>
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

      {/* Products Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {product.category}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(product)}
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
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  Rs. {product.price.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.product_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {product.category}
                  </Badge>
                  {/* <span className='' */}
                   <Badge variant={(product.is_approved)?"default":"destructive"} className="mt-1">
                    {((product.is_approved)?"Enable":"Disable")}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(product.product_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* ✅ Product Image */}
              {product.images && product.images.length > 0 ? (
                // <img
                //   src={`http://localhost/Git/Project1/Backend/${product.images.split(',')[0]}`}
                //   alt={product.name}
                //   // className="w-auto h-48 object-cover rounded-lg"
                //   className="flex justify-center items-center w-48"
                // />
                <div className="w-full h-48 flex justify-center items-center bg-white shadow-md rounded-lg">
                  <img
                    src={`http://localhost/Git/Project1/Backend/${product.images.split(',')[0]}`}
                    alt={product.name}
                    className="w-auto h-48 object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
                  No Image
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {product.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  Rs. {product.price.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first product to get started'}
          </p>
        </div>
      )}
    </div>
  );
}
