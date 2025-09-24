import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProviders: number;
  pendingProviders: number;
  totalProducts: number;
  activeProducts: number;
  totalServices: number;
  activeServices: number;
  totalRevenue: number;
}

interface Order {
  order_id: number;
  customer: string;
  total_amount: string;
  status: string;
  order_date: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  joinDate: string;
}

interface Provider {
  id: number;
  name: string;
  email: string;
  company: string;
  status: "pending" | "approved" | "rejected" | "disabled";
  joinDate: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProviders: 0,
    pendingProviders: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalServices: 0,
    activeServices: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [recentProviders, setRecentProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost/Git/Project1/Backend/AdminDashboard.php",
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders);
        setRecentCustomers(res.data.recentCustomers);
        setRecentProviders(res.data.recentProviders);
      } else {
        setError(res.data.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalUsers,
      subtitle: `${stats.activeUsers} active`,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Providers",
      value: stats.totalProviders,
      subtitle: `${stats.pendingProviders} pending`,
      icon: Building2,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Products & Services",
      value: stats.activeProducts + stats.activeServices,
      subtitle: `${stats.totalProducts + stats.totalServices} total`,
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      subtitle: "From products & services",
      icon: ShoppingCart,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (loading) {
    return <p className="text-center text-gray-600">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-medium">
        Error: {error}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="glass border-white/20 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}
                  >
                    <Icon
                      className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Clock className="w-5 h-5 mr-2" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Order #{order.order_id}
                    </p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.order_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      Rs{parseFloat(order.total_amount).toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "processing" ||
                            order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "on_transit"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Users className="w-5 h-5 mr-2" />
              Recent Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Providers */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recent Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {provider.name}
                    </p>
                    <p className="text-sm text-gray-600">{provider.company}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(provider.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        provider.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : provider.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : provider.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {provider.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
