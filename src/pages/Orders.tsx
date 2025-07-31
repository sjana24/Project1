import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, DollarSign, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';


const mockOrders: orderItem[] = [
  {
    order_id: 101,
    order_type: 'product',
    order_date: '2024-07-20',
    status: 'delivered',
    payment_status: 'Paid',
    total_amount: 2999.99,
    delivery_charge: 150,
    shipping_address: '123 Main Street, City',
    image: 'https://via.placeholder.com/100',
    product_name: 'Solar Panel 400W',
    quantity: 2,
    price: 599.99,
  },
  {
    order_id: 102,
    order_type: 'project',
    order_date: '2024-07-21',
    status: 'processing',
    payment_status: 'Paid',
    total_amount: 12000,
    delivery_charge: 0,
    shipping_address: '',
    project_title: 'Solar Power Installation - School',
    project_description: '5kW system for local school with battery backup.',
  }
];


export interface orderItem {
  order_id: number;
  customer_id?: number; // optional if not always available
  order_type: 'product' | 'project';
  order_date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  delivery_charge: number;
  shipping_address: string;

  // Product-only fields
  image?: string;
  product_name?: string;
  quantity?: number;
  price?: number;

  // Project-only fields
  project_title?: string;
  project_description?: string;
}

const Orders = () => {
  const { user } = useAuth();
  const [productOrders, setProductOrders] = useState([]);
  const [projectOrders, setProjectOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const products = mockOrders.filter(order => order.order_type === 'product');
    const projects = mockOrders.filter(order => order.order_type === 'project');
    setProductOrders(products);
    setProjectOrders(projects);
  }, []);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const filteredProductOrders = productOrders.filter(order => {
    const matchesSearch =
      order.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_id.toString().includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredProjectOrders = projectOrders.filter(order => {
    const matchesSearch =
      order.project_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_id.toString().includes(searchTerm); 1

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Package className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-8">
              You need to be logged in to view your orders.
            </p>
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-md shadow-sm">
              <TabsTrigger
                value="products"
                className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-black font-medium px-4 py-2 rounded-md transition"
              >
                Product Orders ({filteredProductOrders.length})
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-black font-medium px-4 py-2 rounded-md transition"
              >
                Project Orders ({filteredProjectOrders.length})
              </TabsTrigger>
            </TabsList>

            {/* --- Product Orders Tab --- */}
            <TabsContent value="products" className="space-y-4">
              {filteredProductOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No product orders found</p>
                  </CardContent>
                </Card>
              ) : (

                <div className="space-y-4">
                  {productOrders.map((order) => (
                    <Card key={order.order_id}>
                      <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Order #{order.order_id}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </CardHeader>
                      <CardContent className="flex gap-4">
                        <img src={order.image} alt={order.product_name} className="w-24 h-24 rounded object-cover" />
                        <div className="text-sm space-y-1">
                          <p><strong>{order.product_name}</strong></p>
                          <p>Quantity: {order.quantity}</p>
                          <p>Price: ${order.price}</p>
                          <p>Total: ${order.total_amount}</p>
                          <p>Payment: {order.payment_status}</p>
                          <p>Delivery: ${order.delivery_charge}</p>
                          <p>Address: {order.shipping_address}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}


            </TabsContent>

            {/* --- Project Orders Tab --- */}
            <TabsContent value="projects" className="space-y-4">
              {filteredProductOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No projcct orders found</p>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  {/* <h2 className="text-2xl font-semibold mb-4">Project Orders</h2> */}
                  {projectOrders.length === 0 ? (
                    <p className="text-muted-foreground mb-8">No project orders yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {projectOrders.map((order) => (
                        <Card key={order.order_id}>
                          <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>{order.project_title}</CardTitle>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </CardHeader>
                          <CardContent className="text-sm space-y-1">
                            <p><strong>Order ID:</strong> {order.order_id}</p>
                            <p><strong>Description:</strong> {order.project_description}</p>
                            <p><strong>Total:</strong> ${order.total_amount}</p>
                            <p><strong>Payment:</strong> {order.payment_status}</p>
                            <p><strong>Ordered On:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Orders;