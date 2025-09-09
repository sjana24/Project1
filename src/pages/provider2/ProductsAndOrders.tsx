import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Trash2, Edit, Plus, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, DollarSign, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  images: string;
  category: string;
  specification: string;
  is_approved: boolean;
  createdAt: string;
}

export interface ProductOrder {
  order_id: number;
  order_number: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  total_price: number;
  order_date: string;
  status: string;
  image?: string;
  price?: number;
  deliveryEstimate?: string;
  paymentStatus?: string;
  description?: string;
}

const mockProductOrders = [
  {
    order_id: 1,
    order_number: 'ORD-2024-001',
    productName: 'Solar Panel Kit - 3kW',
    image: '/images/solar-kit.jpg',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    price: 4800,
    status: 'new',
    quantity: 2,
    total_price: 9600,
    order_date: '2024-07-01',
    deliveryEstimate: '2024-07-05',
    paymentStatus: 'paid',
    description: 'Complete off-grid solar panel kit with inverter and mounting structure'
  },
  {
    order_id: 2,
    order_number: 'ORD-2024-002',
    productName: 'Battery Storage 5kWh',
    image: '/images/battery.jpg',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    price: 2500,
    status: 'pending',
    quantity: 2,
    total_price: 5000,
    order_date: '2024-07-02',
    deliveryEstimate: '2024-07-07',
    paymentStatus: 'paid',
    description: 'Lithium-ion home energy storage battery with wall mount'
  }
  // Add more orders as needed
];

const ProductsAndOrders = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  // const [searchOrder, setSearchOrder] = useState("");
  // const [statusFilter, setStatusFilter] = useState("all");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    product_id: 0,
    name: '',
    description: '',
    price: 0,
    category: '',
    specification: '',
    images: [] as File[],
  });

  // Fetch products
  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllProductProvider.php", { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          console.log("Failed to get products");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const [searchOrder, setSearchOrder] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'new': return 'destructive';
      case 'pending': return 'secondary';
      case 'delivered': return 'default';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const filteredOrders = mockProductOrders.filter(order => {
    const matchesSearch =
      order.productName.toLowerCase().includes(searchOrder.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchOrder.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchOrder.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = mockProductOrders.length;
  const newOrders = mockProductOrders.filter(order => order.status === 'new').length;
  const pendingOrders = mockProductOrders.filter(order => order.status === 'pending').length;
  const deliveredOrders = mockProductOrders.filter(order => order.status === 'delivered').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      await axios.post("http://localhost/Git/Project1/Backend/UpdateProductProvider.php", formData, { withCredentials: true });
      toast({ title: 'Product Updated', description: 'Product has been updated successfully.' });
    } else {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('specifications', formData.specification);
      selectedImages.forEach(file => formDataToSend.append('images[]', file));
      await axios.post("http://localhost/Git/Project1/Backend/AddProductProvider.php", formDataToSend, { withCredentials: true });
      toast({ title: 'Product Added', description: 'New product has been added successfully.' });
    }

    setFormData({ product_id: 0, name: '', description: '', price: 0, category: '', specification: '', images: [] });
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
      images: [],
    });
    setIsModalOpen(true);
  };

const handleDelete = async (product_id: number) => {
  const formData = new FormData();
  formData.append("product_id", product_id.toString());

  const response = await axios.post(
    "http://localhost/Git/Project1/Backend/deleteProviderProduct.php",
    formData,
    { withCredentials: true }
  );

  if (response.data.success) {
    toast({ title: 'Product Deleted', description: 'Product has been deleted successfully.', variant: 'destructive' });
    setProducts(products.filter(p => p.product_id !== product_id)); // remove from state
  } else {
    toast({ title: 'Product Deletion Failed', description: 'Failed to delete product.', variant: 'destructive' });
  }
};


  // Duplicate filteredOrders declaration removed to fix redeclaration error.

  // Filter products based on searchProduct
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    product.category.toLowerCase().includes(searchProduct.toLowerCase()) ||
    product.description.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Products & Orders</h1>

      <Tabs defaultValue="products">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* ---------------- Products Tab ---------------- */}
        <TabsContent value="products">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input placeholder="Search products..." value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} className="pl-10" />
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="specification">Specifications</Label>
                    <Textarea id="specification" value={formData.specification} onChange={(e) => setFormData({ ...formData, specification: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (Rs.)</Label>
                    <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required />
                  </div>
                  <div>
                    <Label htmlFor="images">Product Images</Label>
                    <Input id="images" type="file" multiple onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const fileArray = Array.from(files);
                        setFormData({ ...formData, images: fileArray });
                        setSelectedImages(fileArray);
                      }
                    }} />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-green-500 hover:bg-green-600">{editingProduct ? 'Update' : 'Add'} Product</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {filteredProducts.length === 0 ? (
            <Card><CardContent className="p-6">No products found</CardContent></Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map(product => (
                <Card key={product.product_id}>
                  <CardHeader className="flex justify-between items-start">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                      <Badge variant={product.is_approved ? "default" : "destructive"} className="mt-1">
                        {product.is_approved ? "Enable" : "Disable"}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(product.product_id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {product.images ? (
                      <div className="w-full h-48 flex justify-center items-center bg-white shadow-md rounded-lg">
                        <img src={`http://localhost/Git/Project1/Backend/${product.images.split(',')[0]}`} alt={product.name} className="w-auto h-48 object-cover rounded-md" />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">No Image</div>
                    )}
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">Rs. {product.price.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ---------------- Orders Tab ---------------- */}
        <TabsContent value="orders">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Orders</p>
                    <p className="text-2xl font-bold text-red-600">{newOrders}</p>
                  </div>
                  <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-blue-600">{pendingOrders}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No product orders found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredOrders.map((order) => (
                <Card key={order.order_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Order #{order.order_number}</p>
                        <p className="text-sm font-medium">Customer: {order.customerName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getStatusVariant(order.status)}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <p className="font-medium">Rs.{order.price}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <p className="font-medium">{order.quantity}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <p className="font-medium">Rs.{order.total_price}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="font-medium">{new Date(order.order_date).toLocaleDateString()}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        {!['delivered', 'cancelled'].includes(order.status) && (
                          <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate(order.order_id.toString(), 'cancelled')}>
                            Cancel Order
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Customer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsAndOrders;
