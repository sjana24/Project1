import React, { useEffect, useState } from 'react';
import {
  Search,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OrderDetailsModal from '@/components/uiProvider/orderDetailsModel';
import { useDashboardStore } from '@/store/orderProviderState';

// Single order item
export interface OrderItem {
  item_id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_category: string;
  product_images: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

// Full order
export interface Order {
  order_id: number;
  customer_id: number;
  customerName?: string;
  order_date: string;
  total_amount: string;
  delivery_charge: string;
  status: "new" | "pending" | "on_process" | "packed" | "on_transit" | "delivered" | "cancelled" | string;
  shipping_address: string;
  payment_status: "pending" | "paid" | "failed" | string;
  created_at: string;
  updated_at: string;
  provider_total_amount: number;
  provider_total_items: number;
  items: OrderItem[];
}

export default function ProductOrdernew() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<"date" | "price-low" | "price-high">("date");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { fetchCounts } = useDashboardStore.getState();


  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetAllOrderProvider.php", { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
        else{
          toast({ title: "Fetch data", description: "Fetching data fail", variant: "destructive" });
        }
      })
      .catch(() => console.log("Failed to fetch orders"));
  };

  // Filtering + sorting helper
  function filterAndSortOrders(
    orders: Order[],
    searchTerm: string,
    sortBy: "date" | "price-low" | "price-high" = "date"
  ): Order[] {
    const lowerSearch = searchTerm.toLowerCase();

    return orders
      .filter(order => {
        const matchesStatus = order.status?.toLowerCase().includes(lowerSearch);
        const matchesAddress = order.shipping_address.toLowerCase().includes(lowerSearch);
        const matchesItem = order.items.some(item =>
          item.product_name.toLowerCase().includes(lowerSearch) ||
          item.product_category.toLowerCase().includes(lowerSearch)
        );

        return matchesStatus || matchesAddress || matchesItem;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.provider_total_amount - b.provider_total_amount;
          case "price-high":
            return b.provider_total_amount - a.provider_total_amount;
          default: // newest first
            return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
        }
      });
  }

  const filteredOrders = filterAndSortOrders(orders, searchTerm, sortBy);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    try {
      const res = await axios.post(
        "http://localhost/Git/Project1/Backend/updateOrderStatusProvider.php",
        { order_id: orderId, new_status: newStatus },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/form-data" },
        }
      );
      if (res.data.success) {
        toast({ title: "Updated", description: "Order status updated successfully" });
        await fetchCounts();
        fetchOrders(); // refresh
         
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update status" });
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  return (
    <div className="space-y-6">
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
              <p className="text-sm text-muted-foreground">Ongoing</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredOrders.filter(
                  (o) => o.status !== "delivered" && o.status !== "new" && o.status !== "cancelled"
                ).length}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No product orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.order_id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="border-b pb-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order #{order.order_id}</p>
                    <p className="font-medium">Customer: {order.customerName || "Jack Antony"}</p>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* The Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        open={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      />
    </div>
  );
}
