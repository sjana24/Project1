
import { useEffect, useState } from 'react';
// import { getData, User, Provider, Product, Order } from '../../utils/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Package, ShoppingCart, TrendingUp, Clock } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProviders: number;
  pendingProviders: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
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
export interface Order {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProviders: 0,
    pendingProviders: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentProviders, setRecentProviders] = useState<Provider[]>([]);

  useEffect(() => {
    // Fetch and calculate stats
    // const users = getData<User>('users');
    // const providers = getData<Provider>('providers');
    // const products = getData<Product>('products');
    // const orders = getData<Order>('orders');

     const users =[];
    const providers = [];
    const products = [];
    const orders = [];

    const calculatedStats: DashboardStats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      totalProviders: providers.length,
      pendingProviders: providers.filter(p => p.status === 'pending').length,
      totalProducts: products.length,
      pendingProducts: products.filter(p => p.status === 'pending').length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
    };

    setStats(calculatedStats);

    // Get recent data
    const sortedOrders = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentOrders(sortedOrders.slice(0, 5));

    const sortedProviders = providers.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
    setRecentProviders(sortedProviders.slice(0, 5));
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subtitle: `${stats.activeUsers} active`,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Providers',
      value: stats.totalProviders,
      subtitle: `${stats.pendingProviders} pending`,
      icon: Building2,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      subtitle: `${stats.pendingProducts} pending`,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      subtitle: `$${stats.totalRevenue.toFixed(2)} revenue`,
      icon: ShoppingCart,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
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

        {/* Recent Provider Registrations */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recent Provider Registrations
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
};

export default DashboardPage;
