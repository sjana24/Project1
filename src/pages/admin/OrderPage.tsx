"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, EyeOff, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// --- Types ---
interface ProductItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

interface ProductOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  status: string;
  orderDate: string;
  items: ProductItem[];
  visible: boolean;
}

interface ProjectOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  projectTitle: string;
  budget: number;
  status: string;
  paymentStatus: string;
  providerName: string;
  startDate: string;
  dueDate: string;
  visible: boolean;
}

const OrderPage = () => {
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [projectOrders, setProjectOrders] = useState<ProjectOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<ProductOrder | ProjectOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost/Git/Project1/Backend/getAllAdminOrders.php", { withCredentials: true });
      if (res.data) {
        setProductOrders(res.data.productOrders || []);
        setProjectOrders(res.data.projectOrders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrderVisibility = (orderId: number, type: "product" | "project") => {
    if (type === "product") {
      setProductOrders(prev => prev.map(o => o.id === orderId ? { ...o, visible: !o.visible } : o));
    } else {
      setProjectOrders(prev => prev.map(o => o.id === orderId ? { ...o, visible: !o.visible } : o));
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed": return "default";
      case "processing":
      case "in-progress": return "secondary";
      case "pending": return "destructive";
      case "cancelled": return "outline";
      default: return "outline";
    }
  };

  const openModal = (order: ProductOrder | ProjectOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Filtered orders
  const filteredProductOrders = productOrders.filter(order =>
    (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (statusFilter === "all" || order.status === statusFilter)
  );

  const filteredProjectOrders = projectOrders.filter(order =>
    (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "all" || order.status === statusFilter)
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders Management</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="products">Product Orders ({filteredProductOrders.length})</TabsTrigger>
          <TabsTrigger value="projects">Project Orders ({filteredProjectOrders.length})</TabsTrigger>
        </TabsList>

        {/* Product Orders */}
        <TabsContent value="products" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProductOrders.map(order => (
            <Card key={order.id} className={`hover:shadow-lg transition-shadow ${!order.visible ? "opacity-50" : ""}`}>
              <CardHeader className="flex justify-between items-start">
                <CardTitle>{order.items[0]?.productName}</CardTitle>
                <Button size="sm" variant="outline" onClick={() => toggleOrderVisibility(order.id, "product")}>
                  {order.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><span className="text-muted-foreground">Order #:</span> {order.orderNumber}</p>
                <p><span className="text-muted-foreground">Customer:</span> {order.customerName}</p>
                <p><span className="text-muted-foreground">Total:</span> Rs {order.items.reduce((sum, i) => sum + i.total, 0)}</p>
                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                <Button variant="outline" size="sm" onClick={() => openModal(order)} className="mt-2">
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Project Orders */}
        <TabsContent value="projects" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjectOrders.map(order => (
            <Card key={order.id} className={`hover:shadow-lg transition-shadow ${!order.visible ? "opacity-50" : ""}`}>
              <CardHeader className="flex justify-between items-start">
                <CardTitle>{order.projectTitle}</CardTitle>
                <Button size="sm" variant="outline" onClick={() => toggleOrderVisibility(order.id, "project")}>
                  {order.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><span className="text-muted-foreground">Order #:</span> {order.orderNumber}</p>
                <p><span className="text-muted-foreground">Customer:</span> {order.customerName}</p>
                <p><span className="text-muted-foreground">Budget:</span> Rs {order.budget}</p>
                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                <Button variant="outline" size="sm" onClick={() => openModal(order)} className="mt-2">
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-2">
              {"items" in selectedOrder ? (
                // Product Order Details
                <>
                  <p><span className="text-muted-foreground">Order #:</span> {selectedOrder.orderNumber}</p>
                  <p><span className="text-muted-foreground">Customer:</span> {selectedOrder.customerName}</p>
                  <p><span className="text-muted-foreground">Status:</span> {selectedOrder.status}</p>
                  <p><span className="text-muted-foreground">Order Date:</span> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                  <p className="font-medium">Items:</p>
                  <ul className="list-disc pl-5">
                    {selectedOrder.items.map(item => (
                      <li key={item.productId}>{item.productName} - {item.quantity} x Rs {item.price} = Rs {item.total}</li>
                    ))}
                  </ul>
                </>
              ) : (
                // Project Order Details
                <>
                  <p><span className="text-muted-foreground">Order #:</span> {selectedOrder.orderNumber}</p>
                  <p><span className="text-muted-foreground">Customer:</span> {selectedOrder.customerName}</p>
                  <p><span className="text-muted-foreground">Project Title:</span> {selectedOrder.projectTitle}</p>
                  <p><span className="text-muted-foreground">Budget:</span> Rs {selectedOrder.budget}</p>
                  <p><span className="text-muted-foreground">Status:</span> {selectedOrder.status}</p>
                  <p><span className="text-muted-foreground">Payment:</span> {selectedOrder.paymentStatus}</p>
                  <p><span className="text-muted-foreground">Provider:</span> {selectedOrder.providerName}</p>
                  <p><span className="text-muted-foreground">Start Date:</span> {new Date(selectedOrder.startDate).toLocaleDateString()}</p>
                  <p><span className="text-muted-foreground">Due Date:</span> {new Date(selectedOrder.dueDate).toLocaleDateString()}</p>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderPage;
