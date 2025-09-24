import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Wrench, ShoppingCart, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { IOngoingProject, IOrder, IOrderItem, IProduct, IService } from '@/store/providerCommonInterfaces';



export default function Dashboard() {
  const [dataRaw, setDataRaw] = useState<any>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [projects, setProjects] = useState<IOngoingProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get("http://localhost/Git/Project1/Backend/ProviderDashBoard.php", { withCredentials: true });
      if (res.data && res.data.success) {
        const payload = res.data.data ?? res.data;
        setDataRaw(payload);

        const parsedProducts = (payload.products || []).map((p: any): IProduct => ({
          product_id: Number(p.product_id),
          provider_id: Number(p.provider_id),
          name: p.name ?? '',
          description: p.description ?? '',
          price: Number(p.price ?? 0),
          category: p.category ?? '',
          images: p.images ?? '',
          specifications: p.specifications ?? null,
          is_approved: Number(p.is_approved ?? 0),
          is_delete: Number(p.is_delete ?? 0),
          created_at: p.created_at ?? '',
          updated_at: p.updated_at ?? '',
          status: (Number(p.is_approved ?? 0) === 1)
            ? 'approved'
            : (Number(p.is_delete ?? 0) === 1 ? 'rejected' : 'pending'),
        }));

        const parsedServices = (payload.services || []).map((s: any): IService => ({
          service_id: Number(s.service_id),
          provider_id: Number(s.provider_id),
          name: s.name ?? '',
          description: s.description ?? '',
          price: Number(s.price ?? 0),
          category: s.category ?? '',
          is_approved: Number(s.is_approved ?? 0),
          is_active: Number(s.is_active ?? 0),
          is_delete: Number(s.is_delete ?? 0),
          created_at: s.created_at ?? '',
          updated_at: s.updated_at ?? '',
          status: Number(s.is_active ?? 0) === 1
            ? 'active'
            : (Number(s.is_approved ?? 0) === 1 ? 'approved' : 'inactive'),
        }));

        const parsedOrders = (payload.orders || []).map((o: any): IOrder => ({
          order_id: Number(o.order_id),
          customer_id: Number(o.customer_id),
          order_date: o.order_date ?? '',
          total_amount: Number(o.total_amount ?? 0),
          delivery_charge: Number(o.delivery_charge ?? 0),
          status: (o.status ?? '').toString(),
          shipping_address: o.shipping_address ?? '',
          payment_status: o.payment_status ?? '',
          created_at: o.created_at ?? '',
          updated_at: o.updated_at ?? '',
          provider_total_amount: Number(o.provider_total_amount ?? 0),
          provider_total_items: Number(o.provider_total_items ?? 0),
          items: (o.items || []).map((it: any): IOrderItem => ({
            item_id: Number(it.item_id),
            order_id: Number(it.order_id),
            product_id: Number(it.product_id),
            quantity: Number(it.quantity),
            unit_price: Number(it.unit_price ?? 0),
            subtotal: Number(it.subtotal ?? 0),
            product_name: it.product_name ?? '',
            product_images: it.product_images ?? '',
            product_category: it.product_category ?? '',
          })),
        }));

        const parsedProjects = (payload.ongoing_projects || payload.projects || []).map((p: any): IOngoingProject => ({
          project_id: Number(p.project_id),
          request_id: Number(p.request_id),
          project_name: p.project_name ?? '',
          status: p.status ?? '',
          start_date: p.start_date ?? '',
          due_date: p.due_date ?? '',
          completed_date: p.completed_date ?? null,
          payment_id: p.payment_id !== undefined ? (p.payment_id === null ? null : Number(p.payment_id)) : null,
          created_at: p.created_at ?? '',
          updated_at: p.updated_at ?? '',
        }));

        setProducts(parsedProducts);
        setServices(parsedServices);
        setOrders(parsedOrders);
        setProjects(parsedProjects);
      } else {
        setError(res.data?.message ?? 'Failed to fetch dashboard data');
      }
    } catch (e: any) {
      console.error('Fetch Provider Dashboard error', e);
      setError(e?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Derived values
  const completedOrdersCount = orders.filter(o => (o.status ?? '').toLowerCase() === 'delivered').length;
  const newOrdersCount = orders.filter(o => ['new', 'pending'].includes((o.status ?? '').toLowerCase())).length;
  const ongoingOrdersCount = orders.filter(o => {
    const s = (o.status ?? '').toLowerCase();
    return s && !['delivered', 'cancelled', 'new'].includes(s);
  }).length;

  const completedProjectsCount = projects.filter(p => (p.status ?? '').toLowerCase() === 'completed').length;
  const pendingProjectsCount = projects.filter(p => (p.status ?? '').toLowerCase() === 'pending').length;
  const ongoingProjectsCount = projects.filter(p => (p.status ?? '').toLowerCase() === 'ongoing').length;

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      details: [
        { label: "Approved", value: products.filter(p => p.status === "approved").length },
        { label: "Rejected", value: products.filter(p => p.status === "rejected").length },
        { label: "Pending", value: products.filter(p => p.status === "pending").length },
      ],
    },
    {
      title: "Services",
      value: services.length,
      icon: Wrench,
      color: "text-green-600",
      bgColor: "bg-green-100",
      details: [
        { label: "Active", value: services.filter(s => s.status === "active").length },
        { label: "Approved", value: services.filter(s => s.is_approved === 1).length },
        { label: "Inactive", value: services.filter(s => s.status === "inactive").length },
      ],
    },
    {
      title: "Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      details: [
        { label: "New / Pending", value: newOrdersCount },
        { label: "Ongoing", value: ongoingOrdersCount },
        { label: "Delivered", value: completedOrdersCount },
        { label: "Cancelled", value: orders.filter(o => (o.status ?? '').toLowerCase() === 'cancelled').length },
      ],
    },
    {
      title: "Projects",
      value: projects.length,
      icon: TrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      details: [
        { label: "Ongoing", value: ongoingProjectsCount },
        { label: "Completed", value: completedProjectsCount },
        { label: "Pending", value: pendingProjectsCount },
      ],
    },
  ];
    // ✅ Sort orders (latest first by order_date)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
    // .slice(0, 5);

  // ✅ Sort projects (latest first by updated_at)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    // .slice(0, 5);



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening with your business.</p>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Loading dashboard...</p>
          </CardContent>
        </Card>
      )}

      {/* {error && (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )} */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>

              {stat.details && (
                <div className="space-y-1">
                  {stat.details.map((detail: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>{detail.label}</span>
                      <span className="font-medium">{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Recent Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.order_id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">Order #{order.order_id}</p>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {order.status || "unknown"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Order Date: {order.order_date}</p>
                    <p className="text-sm text-gray-500">Shipping: {order.shipping_address}</p>
                    <p className="text-sm text-gray-500 font-semibold">
                      Total: Rs. {Number(order.total_amount).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recent Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.project_id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">{project.project_name}</p>
                      <Badge
                        variant={
                          project.status?.toLowerCase() === "completed"
                            ? "default"
                            : project.status?.toLowerCase() === "pending"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.status || "unknown"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Start: {project.start_date || "—"} | Due: {project.due_date || "—"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No project requests yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
