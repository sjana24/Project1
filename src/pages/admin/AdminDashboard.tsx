import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Package, ShoppingCart, TrendingUp, Clock } from 'lucide-react';

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

export interface Provider {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'pending' | 'approved' | 'rejected' | 'disabled';
  joinDate: string;
  productsCount: number;
  servicesCount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  joinDate: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'inactive';
}

export interface Service {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'inactive';
}

export interface Order {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
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

  useEffect(() => {
    // --- Mock Data ---
    const users: Customer[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', joinDate: '2025-09-01' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', joinDate: '2025-09-02' },
      { id: '3', name: 'Alice Brown', email: 'alice@example.com', joinDate: '2025-09-03' },
      { id: '4', name: 'Michael Lee', email: 'michael@example.com', joinDate: '2025-09-04' },
      { id: '5', name: 'Bob Johnson', email: 'bob@example.com', joinDate: '2025-09-05' },
    ];

    const providers: Provider[] = [
      { id: '1', name: 'SolarX Solutions', email: 'contact@solarx.com', company: 'SolarX', status: 'approved', joinDate: '2025-09-01', productsCount: 3, servicesCount: 2 },
      { id: '2', name: 'Green Energy Inc', email: 'info@greenenergy.com', company: 'Green Energy', status: 'pending', joinDate: '2025-09-03', productsCount: 5, servicesCount: 3 },
      { id: '3', name: 'Sun Power', email: 'support@sunpower.com', company: 'Sun Power', status: 'approved', joinDate: '2025-09-04', productsCount: 2, servicesCount: 4 },
      { id: '4', name: 'Eco Energy', email: 'hello@ecoenergy.com', company: 'Eco Energy', status: 'approved', joinDate: '2025-09-05', productsCount: 4, servicesCount: 3 },
      { id: '5', name: 'PhotonTech', email: 'contact@photontech.com', company: 'PhotonTech', status: 'pending', joinDate: '2025-09-06', productsCount: 2, servicesCount: 2 },
    ];

    const products: Product[] = [
      { id: '1', name: 'Solar Panel A', price: 1200, status: 'active' },
      { id: '2', name: 'Solar Panel B', price: 1000, status: 'active' },
      { id: '3', name: 'Battery Storage', price: 800, status: 'inactive' },
      { id: '4', name: 'Inverter X', price: 600, status: 'active' },
    ];

    const services: Service[] = [
      { id: '1', name: 'Installation', price: 500, status: 'active' },
      { id: '2', name: 'Maintenance', price: 300, status: 'active' },
      { id: '3', name: 'Consultation', price: 200, status: 'inactive' },
    ];

    const orders: Order[] = [
      { id: '1', customer: 'John Doe', items: ['Solar Panel A'], total: 1200, status: 'delivered', date: '2025-09-01' },
      { id: '2', customer: 'Jane Smith', items: ['Solar Panel B', 'Inverter X'], total: 1600, status: 'processing', date: '2025-09-02' },
      { id: '3', customer: 'Alice Brown', items: ['Battery Storage'], total: 800, status: 'shipped', date: '2025-09-03' },
      { id: '4', customer: 'Michael Lee', items: ['Installation'], total: 500, status: 'pending', date: '2025-09-04' },
      { id: '5', customer: 'Bob Johnson', items: ['Maintenance'], total: 300, status: 'delivered', date: '2025-09-05' },
    ];

    const totalRevenue = products.reduce((sum, p) => sum + p.price, 0) + services.reduce((sum, s) => sum + s.price, 0);

    setStats({
      totalUsers: users.length,
      activeUsers: users.length,
      totalProviders: providers.length,
      pendingProviders: providers.filter(p => p.status === 'pending').length,
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length,
      totalServices: services.length,
      activeServices: services.filter(s => s.status === 'active').length,
      totalRevenue,
    });

    setRecentOrders(orders.slice(0, 5));
    setRecentCustomers(users.slice(0, 5));
    setRecentProviders(providers.slice(0, 5));
  }, []);

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalUsers,
      subtitle: `${stats.activeUsers} active`,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Providers',
      value: stats.totalProviders,
      subtitle: `${stats.pendingProviders} pending`,
      icon: Building2,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Products & Services',
      value: stats.activeProducts + stats.activeServices,
      subtitle: `${stats.totalProducts + stats.totalServices} total`,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      subtitle: 'From products & services',
      icon: ShoppingCart,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to SolarX Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass border-white/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
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
                <div key={order.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">Rs{order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
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
                <div key={customer.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <p className="text-xs text-gray-500">{new Date(customer.joinDate).toLocaleDateString()}</p>
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
                <div key={provider.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-600">{provider.company}</p>
                    <p className="text-xs text-gray-500">{new Date(provider.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      provider.status === 'approved' ? 'bg-green-100 text-green-800' :
                      provider.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      provider.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
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
