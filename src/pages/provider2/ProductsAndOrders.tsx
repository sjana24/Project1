import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Package, Eye, Star, DollarSign, AlertCircle, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OrderDetailsModal from '@/components/uiProvider/orderDetailsModel';

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

// Single order item
export interface OrderItem {
  item_id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_category: string;
  product_images: string; // URL or path
  quantity: number;
  unit_price: string; // could also be number if backend sends as number
  subtotal: string;   // same as above
}

// Full order
export interface Order {
  order_id: number;
  customer_id: number;
  customerName?: string; // optional if you join user table
  order_date: string; // ISO string from backend
  total_amount: string;
  delivery_charge: string;
  status: "new" | "pending" | "on_process" | "packed" | "on_transit" | "delivered" | "cancelled";
  shipping_address: string;
  payment_status: "pending" | "paid" | "failed" | string;
  created_at: string;
  updated_at: string;

  // Provider-specific calculated fields
  provider_total_amount: number;
  provider_total_items: number;

  // Nested items
  items: OrderItem[];
}

export default function Products() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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

  // Fetch products
  useEffect(() => {
    fetchProducts();
    fetchOrders();
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


  const fetchOrders = () => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllOrderProvider.php", { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      })
      .catch(() => console.log("Failed to fetch orders"));
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
    else {
      toast({ title: "Failed", description: "Product deleted failed", variant: "destructive" });
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



  const [searchOrder, setSearchOrder] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.status.toLowerCase().includes(searchOrder.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchOrder.toLowerCase());
    // order.order_number.toLowerCase().includes(searchOrder.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // ======================
  // Order Actions
  // ======================

  // 🔹 Cancel an order
  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      // Example: call your API here
      console.log(`Cancelling order: ${orderId}`);

      // TODO: replace with API call
      // await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });

      // Update UI immediately (optional)
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id.toString() === orderId ? { ...o, status: "cancelled" } : o
        )
      );
    }
  };

  // 🔹 Update status (dropdown)
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);

    const res = await axios.post("http://localhost/Git/Project1/Backend/updateOrderStatusProvider.php", { order_id: orderId, new_status: newStatus }, {
      withCredentials: true,
      headers: { "Content-Type": "application/form-data" }
    });
    if (res.data.success) {
      toast({ title: "Updated", description: "Product Status updated successfully" });
    }

    // TODO: replace with API call
    // await fetch(`/api/orders/${orderId}/status`, {
    //   method: "POST",
    //   body: JSON.stringify({ status: newStatus }),
    // });

    // setOrders((prev) =>
    //   prev.map((o) =>
    //     o.order_id.toString() === orderId ? { ...o, status: newStatus } : o
    //   )
    // );
  };
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // 🔹 View details (opens modal or console for now)
  const handleViewOrder = (order: any) => {
    console.log("Viewing order:", order);

    // If you want a modal, set state here:
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // 🔹 Contact customer
  const handleContactCustomer = (order: any) => {
    console.log("Contacting customer:", order.customerName);

    // Example: open email client or chat
    if (order.customerEmail) {
      window.location.href = `mailto:${order.customerEmail}?subject=Order #${order.order_id}`;
    } else {
      alert("No customer email available.");
    }
  };


  return (

    <div className="space-y-6">
      <Tabs defaultValue="products">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value='products'>
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
        </TabsContent>



        <TabsContent value="orders">
          <div>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{filteredOrders.length}</p>
                  </div>
                  <DollarSign className="h-6 w-6 text-primary" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">New Orders</p>
                    <p className="text-2xl font-bold text-red-600">
                      {filteredOrders.filter((o) => o.status === "new").length}
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
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {filteredOrders.filter((o) => o.status === "pending").length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="text-2xl font-bold text-green-600">
                      {filteredOrders.filter((o) => o.status === "delivered").length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                <SelectTrigger className="w-full md:w-52">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="on_process">On Process</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                  <SelectItem value="on_transit">On Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {/* <p>xvxczxc</p> */}
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No product orders found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.order_id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b pb-4">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Order #{order.order_id}
                          </p>
                          <p className="font-medium">Customer: {order.customerName || "N/A"}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.order_date).toLocaleString()}
                          </p>
                          <p>{order.shipping_address}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select
                            defaultValue={order.status}
                            onValueChange={(value) =>
                              handleStatusUpdate(order.order_id.toString(), value)
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent defaultValue={order.status}>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="on_process">On Process</SelectItem>
                              <SelectItem value="packed">Packed</SelectItem>
                              <SelectItem value="on_transit">On Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>

                          <div >

                          </div>
                          <Badge variant="outline">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Items List */}
                      <div className="grid gap-4">
                        {order.items.map((item) => (
                          <div
                            key={item.item_id}
                            className="flex items-center gap-4 border-b pb-3 last:border-b-0"
                          >
                            <img
                              // src={item.product_images}
                              src={`http://localhost/Git/Project1/Backend/${item.product_images}`}
                              alt={item.product_name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.product_category}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">Qty: {item.quantity}</p>
                              <p className="text-sm">Unit: Rs.{item.unit_price}</p>
                              <p className="font-medium">Rs.{item.subtotal}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>Rs.{order.provider_total_amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery:</span>
                          <span>Rs.{order.delivery_charge}</span>
                        </div>
                        <div className="flex justify-between font-medium text-lg">
                          <span>Total:</span>
                          <span>Rs.{order.total_amount}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        {!["delivered", "cancelled"].includes(order.status) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(order.order_id.toString(), "cancelled")
                            }
                          >
                            Cancel Order
                          </Button>
                        )}
                        <Button variant="outline" size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Customer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          {/* The Modal */}
          <OrderDetailsModal
            order={selectedOrder}
            open={showOrderModal}
            onClose={() => setShowOrderModal(false)}
          />
        </TabsContent>



      </Tabs>


    </div>
  );
}
