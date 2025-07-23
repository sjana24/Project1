import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, DollarSign, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect,useState } from 'react';
import axios from 'axios';


const mockOrders=[];
// // Mock order data - in real app this would come from API
// const mockOrders = [
//   {
//     id: '1',
//     orderNumber: 'ORD-2024-001',
//     date: '2024-01-15',
//     status: 'delivered',
//     total: 2999.99,
//     items: [
//       { name: 'Solar Panel 400W', quantity: 4, price: 599.99 },
//       { name: 'Solar Inverter 3kW', quantity: 1, price: 799.99 }
//     ]
//   },
//   {
//     id: '2',
//     orderNumber: 'ORD-2024-002',
//     date: '2024-01-20',
//     status: 'processing',
//     total: 1499.99,
//     items: [
//       { name: 'Battery Storage 10kWh', quantity: 1, price: 1499.99 }
//     ]
//   }
// ];
export interface orderItem {
  customer_id: number;
  delivery_charge: number;  
  order_date: string;
  order_id: number;
  payment_status: string;
  shipping_address: string;
  status: string;
  total_amount: number;    
}




const Orders = () => {
  const { user } = useAuth();
  const [orderItems, setOrderItems] = useState<orderItem[]>([]);

  useEffect(() => {
        //   const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "null");
        setOrderItems([]);

        //   if (!currentUser) return; // Safeguard in case there's no user

        axios
            .get("http://localhost/Git/Project1/Backend/GetOrdersCustomer.php", {
                withCredentials: true
            })
            .then((response) => {
                const data = response.data;
                if (data.success) {
                    console.log("Data received:", data);
                    // setOrderItemsCount(data.items);
                    // updateCartCount();
                    setOrderItems(data.orders || []);
                } else {
                    console.log("Failed to load items:", data);
                    setOrderItems([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching cart items:", err);
            });
            
    },[]); 

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            Track and manage your solar energy product orders
          </p>
        </div>

        {Array.isArray(orderItems) && orderItems.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-4">No Orders Yet</h2>
              <p className="text-muted-foreground mb-8">
                You haven't placed any orders yet. Start shopping for solar products!
              </p>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orderItems.map((order) => (
              <Card key={order.order_id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Order {order.order_id}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.order_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${order.total_amount}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="secondary" 
                        className={getStatusColor(order.status)}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/order/${order.order_id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Items Ordered:</h4>
                    {/* {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))} */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;