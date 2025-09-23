import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, Calendar, DollarSign, Eye, Search, Filter, Truck, 
  Clock, CheckCircle, XCircle, X, MapPin, CreditCard 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
export interface OngoingProject {
  // Ongoing Project table
  project_id: number;
  project_name: string;
  project_status: string; // status from ongoing_project
  start_date: string;     // ISO string
  due_date: string;       // ISO string
  completed_date?: string | null;
  payment_id?: number | null;

  // Service Request table
  request_id: number;
  request_date: string;   // ISO string
  payment_status: string;

  // Service table
  service_id: number;
  service_name: string;
  service_description: string;
  price: number;
  service_category: string;

  // Service Provider table
  provider_id: number;
  provider_name: string;  // company_name
  verification_status: string;
}

import axios from 'axios';

// const mockOrders = [
//   {
//     order_id: 101,
//     order_type: 'product',
//     order_date: '2024-07-20',
//     status: 'delivered',
//     payment_status: 'Paid',
//     total_amount: 2999.99,
//     delivery_charge: 150,
//     shipping_address: '123 Main Street, Colombo',
//     image: 'https://images.unsplash.com/photo-1625758473106-391bfec90871?w=400&h=300&fit=crop',
//     product_name: 'Solar Panel 400W Premium',
//     quantity: 2,
//     price: 599.99,
//   },
//   {
//     order_id: 102,
//     order_type: 'project',
//     order_date: '2024-07-21',
//     status: 'processing',
//     payment_status: 'Paid',
//     total_amount: 12000,
//     delivery_charge: 0,
//     shipping_address: '',
//     project_title: 'Solar Power Installation - School Project',
//     project_description: '5kW system for local school with battery backup and monitoring system.',
//   }
// ];

type PaymentStatus = "paid" | "unpaid" | "pending";
type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled" | "";

// interface Order {
//   order_id: number;
//   customer_id: number;
//   order_date: string;
//   created_at: string;
//   updated_at: string;
//   total_amount: number;
//   delivery_charge: number;
//   payment_status: PaymentStatus;
//   shipping_address: string;
//   status: OrderStatus;
//   items: any[];
// }
export interface Order {
  order_id: number;
  customer_id?: number;
  order_type: 'product' | 'project';
  order_date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  delivery_charge: number;
  shipping_address: string;
  image?: string;
  product_name?: string;
  quantity?: number;
  price?: number;
  project_title?: string;
  project_description?: string;
  items?: any[];
}

export interface OrderItem {
  order_id: number;
  customer_id?: number;
  order_type: 'product' | 'project';
  order_date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  delivery_charge: number;
  shipping_address: string;
  image?: string;
  product_name?: string;
  quantity?: number;
  price?: number;
  project_title?: string;
  project_description?: string;
  items?: any[];
}

const Orders = () => {
  const { user } = useAuth();
  const [productOrders, setProductOrders] = useState<Order[]>([]);
  const [projectOrders, setProjectOrders] = useState<OngoingProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | Order | null>(null);
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);

  // useEffect(() => {
  //   const projects = mockOrders.filter(order => order.order_type === 'project');
  //   // setProjectOrders(projects);
  // }, []);

const fetchCustomerOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost/Git/Project1/Backend/GetOrdersCustomer.php",
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log("Data received successfully");
        setProductOrders(response.data.orders);
      } else {
        console.log("Failed to get orders:", response.data);
        setError("Failed to fetch orders");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const fetchCustomerProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost/Git/Project1/Backend/GetProjectsCustomer.php",
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log("Data received successfully");
        setProjectOrders(response.data.projects);
      } else {
        console.log("Failed to get orders:", response.data);
        setError("Failed to fetch orders");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Call the function inside useEffect
  useEffect(() => {
    fetchCustomerOrders();
    fetchCustomerProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleCancelOrder = (order: OngoingProject | Order) => {
    // setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const confirmCancelOrder = () => {
    if (selectedOrder) {
      // Update the order status to cancelled
      if ('order_type' in selectedOrder && selectedOrder.order_type === 'product') {
        const updatedOrders = productOrders.map(order =>
          order.order_id === selectedOrder.order_id
            ? { ...order, status: 'cancelled' }
            : order
        );
        setProductOrders(updatedOrders);
      } else {
        const updatedOrders = projectOrders.map(order =>
          order.project_id === selectedOrder.order_id
            ? { ...order, status: 'cancelled' }
            : order
        );
        setProjectOrders(updatedOrders);
      }

      setCancelDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleViewDetails = (order: OngoingProject | Order) => {
    // setSelectedOrder(order);
    setViewDetailsDialogOpen(true);
  };

  const canCancelOrder = (order: OngoingProject | Order) => {
    return ['pending', 'shipped'].includes(order.payment_status);
  };

  const filteredProductOrders = productOrders.filter(order => {
    const matchesSearch =
      order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProjectOrders = projectOrders.filter(order => {
    const matchesSearch =
      order.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.project_id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <Package className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-8">
              You need to be logged in to view your orders.
            </p>
            <Button asChild className="bg-[#26B170] hover:bg-[#1f8d5a]">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48 md:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-8">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-[#26B170] data-[state=active]:text-white font-medium px-6 py-4 rounded-lg transition-all duration-200"
              >
                <Package className="w-5 h-5 mr-2" />
                Product Orders ({filteredProductOrders.length})
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-[#26B170] data-[state=active]:text-white font-medium px-6 py-4 rounded-lg transition-all duration-200"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Project Orders ({filteredProjectOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              {filteredProductOrders.length === 0 ? (
                <Card className="text-center py-16 border-dashed border-2 rounded-xl">
                  <CardContent>
                    <Package className="mx-auto h-20 w-20 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-3">No product orders found</h3>
                    <p className="text-gray-500 mb-6">Your product orders will appear here</p>
                    <Button asChild className="mt-4 bg-[#26B170] hover:bg-[#1f8d5a] px-6 py-3 rounded-lg">
                      <Link to="/products">Browse Products</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredProductOrders.map((order) => (
                    <Card key={order.order_id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4 border-b">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <CardTitle className="text-2xl font-bold text-gray-800">Order #{order.order_id}</CardTitle>
                            <CardDescription className="flex items-center mt-2 text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(order.order_date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </CardDescription>
                          </div>
                          <Badge className={`mt-2 sm:mt-0 border ${getStatusColor(order.status)} px-3 py-1 rounded-full`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                          <div className="flex flex-wrap gap-4 lg:w-2/5">
                            {order.items && order.items.map((item, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={`http://localhost/Git/Project1/Backend/${item.product_images?.split(',')[0]}`}
                                  alt={item.product_name}
                                  className="w-20 h-20 rounded-lg object-cover border shadow-sm group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                  {item.quantity}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                  Shipping Address
                                </h4>
                                <p className="text-gray-600">{order.shipping_address}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                  <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                                  Payment Status
                                </h4>
                                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="capitalize">
                                  {order.payment_status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Items Total:</span>
                                <span className="font-medium">Rs {order.items?.reduce((sum, item) => sum + parseFloat(item.subtotal), 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Charge:</span>
                                <span className="font-medium">Rs {order.delivery_charge}</span>
                              </div>
                              <div className="flex justify-between text-base font-semibold border-t pt-2">
                                <span>Total Amount:</span>
                                <span className="text-[#26B170]">Rs {order.total_amount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6 space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                            className="flex items-center gap-2 rounded-lg border-gray-300"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                          {canCancelOrder(order) && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelOrder(order)}
                              className="flex items-center gap-2 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                              Cancel Order
                            </Button>
                          )}
                          {/* <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelOrder(order)}
                              className="flex items-center gap-2 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                              Cancel Order
                            </Button> */}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              {filteredProjectOrders.length === 0 ? (
                <Card className="text-center py-16 border-dashed border-2 rounded-xl">
                  <CardContent>
                    <Calendar className="mx-auto h-20 w-20 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-3">No project orders found</h3>
                    <p className="text-gray-500 mb-6">Your project orders will appear here</p>
                    <Button asChild className="mt-4 bg-[#26B170] hover:bg-[#1f8d5a] px-6 py-3 rounded-lg">
                      <Link to="/services">Browse Services</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredProjectOrders.map((order) => (
                    <Card key={order.project_id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4 border-b">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <CardTitle className="text-2xl font-bold text-gray-800">{order.project_name}</CardTitle>
                            <CardDescription className="flex items-center mt-2 text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              Order #{order.project_id} • {new Date(order.start_date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                              })}
                            </CardDescription>
                          </div>
                          <Badge className={`mt-2 sm:mt-0 border ${getStatusColor(order.payment_status)} px-3 py-1 rounded-full`}>
                            {getStatusIcon(order.payment_status)}
                            <span className="ml-1">{order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3 text-lg">Project Description</h4>
                            <p className="text-gray-600 leading-relaxed">{order.service_description}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-medium">#{order.project_id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Order Date:</span>
                                <span className="font-medium">{new Date(order.start_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Payment Status:</span>
                                <Badge variant={order.payment_status === 'Paid' ? 'default' : 'secondary'}>
                                  {order.payment_status}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-base font-semibold">
                                <span>Total Amount:</span>
                                <span className="text-[#26B170]">Rs {order.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6 space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                            className="flex items-center gap-2 rounded-lg border-gray-300"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                          {canCancelOrder(order) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelOrder(order)}
                              className="flex items-center gap-2 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Cancel Order Confirmation Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will cancel your order #{selectedOrder?.order_id}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Order</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmCancelOrder}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Cancel Order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* View Details Dialog */}
        <Dialog open={viewDetailsDialogOpen} onOpenChange={setViewDetailsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Order Details #{selectedOrder?.order_id}
              </DialogTitle>
              <DialogDescription>
                {selectedOrder && new Date(
                  'order_date' in selectedOrder ? selectedOrder.order_date : ''
                ).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6 py-4">
                {'items' in selectedOrder ? (
                  // Product order details
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Order Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">Order Date:</span> {new Date(selectedOrder.order_date).toLocaleString()}</p>
                          <p><span className="text-gray-500">Status:</span> 
                            <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                              {selectedOrder.status}
                            </Badge>
                          </p>
                          <p><span className="text-gray-500">Payment Status:</span> 
                            <Badge variant={selectedOrder.payment_status === 'paid' ? 'default' : 'secondary'} className="ml-2 capitalize">
                              {selectedOrder.payment_status}
                            </Badge>
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Shipping Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">Address:</span> {selectedOrder.shipping_address}</p>
                          <p><span className="text-gray-500">Delivery Charge:</span> Rs {selectedOrder.delivery_charge}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex items-center border rounded-lg p-3">
                            <img
                              src={`http://localhost/Git/Project1/Backend/${item.product_images?.split(',')[0]}`}
                              alt={item.product_name}
                              className="w-16 h-16 rounded-md object-cover mr-4"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium">{item.product_name}</h5>
                              <div className="flex justify-between text-sm text-gray-500 mt-1">
                                <span>Quantity: {item.quantity}</span>
                                <span>Rs {item.unit_price} each</span>
                              </div>
                            </div>
                            <div className="font-semibold">Rs {item.subtotal}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-[#26B170]">Rs {selectedOrder.total_amount}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  // Project order details
                  <>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{selectedOrder.project_title}</h4>
                      <p className="text-gray-600">{selectedOrder.project_description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">#{selectedOrder.order_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-medium">{new Date(selectedOrder.order_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={getStatusColor(selectedOrder.status)}>
                            {selectedOrder.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <Badge variant={selectedOrder.payment_status === 'Paid' ? 'default' : 'secondary'}>
                            {selectedOrder.payment_status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-base font-semibold border-t pt-2">
                          <span>Total Amount:</span>
                          <span className="text-[#26B170]">Rs {selectedOrder.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={() => setViewDetailsDialogOpen(false)}
                className="bg-[#26B170] hover:bg-[#1f8d5a]"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;