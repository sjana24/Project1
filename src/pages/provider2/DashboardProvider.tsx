import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Wrench, ShoppingCart, Star, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  // --- Mock Data ---
  const products = [
    { id: 1, name: 'Solar Panel A', status: 'Active' },
    { id: 2, name: 'Solar Panel B', status: 'Active' },
    { id: 3, name: 'Battery Storage', status: 'Inactive' },
  ];

  const services = [
    { id: 1, name: 'Installation', status: 'Active' },
    { id: 2, name: 'Maintenance', status: 'Active' },
    { id: 3, name: 'Consultation', status: 'Inactive' },
  ];

  const orders = [
    { id: 1, customerName: 'John Doe', total: 120000, status: 'Completed', orderDate: '2025-09-01', expectedDelivery: '2025-09-05' },
    { id: 2, customerName: 'Jane Smith', total: 85000, status: 'Pending', orderDate: '2025-09-02', expectedDelivery: '2025-09-07' },
    { id: 3, customerName: 'Michael Lee', total: 56000, status: 'Completed', orderDate: '2025-09-03', expectedDelivery: '2025-09-08' },
    { id: 4, customerName: 'Alice Brown', total: 102000, status: 'In Progress', orderDate: '2025-09-04', expectedDelivery: '2025-09-10' },
    { id: 5, customerName: 'Bob Johnson', total: 78000, status: 'Pending', orderDate: '2025-09-05', expectedDelivery: '2025-09-12' },
  ];

  const recentProjects = [
    { id: 1, projectName: 'Residential Solar Installation', status: 'Pending', customerName: 'Alice Brown', startDate: '2025-09-01', dueDate: '2025-09-10' },
    { id: 2, projectName: 'Commercial Solar Maintenance', status: 'In Progress', customerName: 'Bob Johnson', startDate: '2025-09-03', dueDate: '2025-09-15' },
    { id: 3, projectName: 'Solar Battery Upgrade', status: 'Completed', customerName: 'Charlie Davis', startDate: '2025-08-25', dueDate: '2025-09-05' },
    { id: 4, projectName: 'Solar Panel Replacement', status: 'Pending', customerName: 'Diana Green', startDate: '2025-09-05', dueDate: '2025-09-12' },
    { id: 5, projectName: 'Commercial Roof Installation', status: 'In Progress', customerName: 'Edward King', startDate: '2025-09-06', dueDate: '2025-09-20' },
    { id: 6, projectName: 'Solar Inverter Upgrade', status: 'Completed', customerName: 'Fiona White', startDate: '2025-08-28', dueDate: '2025-09-08' },
  ];

  const completedOrders = orders.filter(order => order.status === 'Completed').length;

  const stats = [
    {
      title: 'Total Products',
      value: 10,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Services',
      value: services.filter(s => s.status === 'Active').length,
      icon: Wrench,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Average Rating',
      value: '4.5', // mock value
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
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
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">{order.customerName}</p>
                      <Badge variant={order.status === 'Completed' ? 'default' : order.status === 'Pending' ? 'secondary' : 'destructive'}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Order Date: {order.orderDate}</p>
                    <p className="text-sm text-gray-500">Expected Delivery: {order.expectedDelivery}</p>
                    <p className="text-sm text-gray-500 font-semibold">Total: Rs. {order.total.toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Project Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recent Project Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">{project.projectName}</p>
                      <Badge variant={
                        project.status === 'Completed'
                          ? 'default'
                          : project.status === 'Pending'
                          ? 'secondary'
                          : 'destructive'
                      }>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Customer: {project.customerName}</p>
                    <p className="text-sm text-gray-500">Start: {project.startDate} | Due: {project.dueDate}</p>
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
