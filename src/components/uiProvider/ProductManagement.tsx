
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';


interface Product {
  product_id: number;
  provider_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  specifications: string;
  /// rating add pannale
  images: string; // this is a JSON string (array in string)
  is_approved: number;
  created_at: string;
  updated_at: string;
  success?: boolean;
}



const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

  const currentProvider = JSON.parse(localStorage.getItem('currentProvider') || '[]');
  

useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllProductProvider.php",currentProvider)
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setProducts(data.products);
        }
        else {
          // setError('Failed to load products.');
          console.log(response.data);
          console.log(" sorry we cant get ur products");
        }
        setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        setLoading(false);
      });

  }, []);








  // const products=[
  //   {
  //     id: '1',
  //     title: 'Premium Solar Panel Kit',
  //     description: 'High-efficiency 400W solar panels with 25-year warranty',
  //     price: '45000',
  //     category: 'Solar Panels',
  //     district: 'Colombo',
  //     image: '../one.jpeg',
  //     status: 'active'
  //   },
  //   {
  //     id: '2',
  //     title: 'Smart Solar Inverter',
  //     description: 'Advanced MPPT technology with WiFi monitoring',
  //     price: '85000',
  //     category: 'Inverters',
  //     district: 'Colombo',
  //     image: '../one.jpeg',
  //     status: 'active'
  //   },
  //    {
  //     id: '1',
  //     title: 'Premium Solar Panel Kit',
  //     description: 'High-efficiency 400W solar panels with 25-year warranty',
  //     price: '45000',
  //     category: 'Solar Panels',
  //     district: 'Colombo',
  //     image: '../one.jpeg',
  //     status: 'active'
  //   },
  //   {
  //     id: '2',
  //     title: 'Smart Solar Inverter',
  //     description: 'Advanced MPPT technology with WiFi monitoring',
  //     price: '85000',
  //     category: 'Inverters',
  //     district: 'Colombo',
  //     image: '../one.jpeg',
  //     status: 'active'
  //   },
  //    {
  //     id: '1',
  //     title: 'Premium Solar Panel Kit',
  //     description: 'High-efficiency 400W solar panels with 25-year warranty',
  //     price: '45000',
  //     category: 'Solar Panels',
  //     district: 'Colombo',
  //     image: '../one.jpeg',
  //     status: 'active'
  //   },
  //   {
  //     id: '2',
  //     title: 'Smart Solar Inverter',
  //     description: 'Advanced MPPT technology with WiFi monitoring',
  //     price: '85000',
  //     category: 'Inverters',
  //     district: 'Colombo',
  //     image: '../one.jpeg',
  //     status: 'active'
  //   },
  //    {
  //     id: '1',
  //     title: 'Premium Solar Panel Kit',
  //     description: 'High-efficiency 400W solar panels with 25-year warranty',
  //     price: '45000',
  //     category: 'Solar Panels',
  //     district: 'Colombo',
  //     image: '../one.jpeg',
  //     status: 'active'
  //   },
  //   {
  //     id: '2',
  //     title: 'Smart Solar Inverter',
  //     description: 'Advanced MPPT technology with WiFi monitoring',
  //     price: '85000',
  //     category: 'Inverters',
  //     district: 'Colombo',
  //     image: '../one.jpeg',
  //     status: 'active'
  //   }
  // ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
 

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    district: '',
    image: ''
  });

  const { toast } = useToast();

  const categories = ['Solar Panels', 'Inverters', 'Batteries', 'Mounting Systems', 'Monitoring Systems'];
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar'
  ];

  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      district: '',
      image: ''
    });
    setEditingProduct(null);
  };

    const handleEdit = (product: Product, productId: number) => {
    setEditingProduct(product);
    
    // const editDeails = {
    //   title: product.title,
    //   description: product.description,
    //   price: product.price,
    //   category: product.category,
    //   district: product.district,
    //   image: product.image
    // };
    // setFormData(editDeails);
    setIsDialogOpen(true);
  };
   const handleDelete = (productId: number  ) => {
    
   
    console.log("this is deleted")
    toast({
      title: "Product Deleted",
      description: "The product has been removed from your listings.",
      variant: "destructive",
    });
  };
  const toggleStatus = (productId: number) => {
    toast({
      title: "Status Updated",
      description: "Product status has been changed.",
    });
  };



  

 

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600">
            Manage your solar product listings
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="solar-button-primary" onClick={resetForm}>
              ➕ Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update your product details' : 'Add a new solar product to your listings'}
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Premium Solar Panel Kit"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product features and benefits..."
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (LKR) *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="45000"
                    // required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, category: value })} value={formData.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>District *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, district: value })} value={formData.district}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="file"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="solar-button-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (

          <Card key={product.product_id} className="solar-card-hover">
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img
                // src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
                src={product.images}
                alt={product.images}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-blod">{product.name}</CardTitle>
                {/* <span className={`px-2 py-1 text-xs rounded-full ${product.is_approved === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                  {product.status}
                </span> */}
              </div>
              <CardDescription className="text-sm">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-solar-green">
                    LKR {(product.price).toLocaleString()}
                  </span>
                  <span className="text-sm bg-solar-yellow/20 text-solar-green px-2 py-1 rounded">
                    {product.provider_id}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Category: {product.category}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product, product.product_id)}
                    className="flex-1"
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                   onClick={() => toggleStatus(product.product_id)} 
                    className="flex-1"
                  >
                    {/* {product.status === 'active' ? '⏸️ Pause' : '▶️ Activate'} */}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.product_id)}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card className="p-12 text-center">
          <CardContent>
            <p className="text-gray-500 mb-4">No products listed yet</p>
            <Button className="solar-button-primary" onClick={() => setIsDialogOpen(true)}>
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManagement;
