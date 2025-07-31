import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock, DollarSign, Eye, MessageSquare, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

// Mock data for provider project orders
const mockProjectOrders = [
  {
    id: '1',
    orderNumber: 'PRJ-2024-001',
    projectTitle: 'Residential Solar Installation',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    budget: 15000,
    status: 'new',
    priority: 'high',
    startDate: '2024-02-01',
    estimatedCompletion: '2024-02-15',
    paymentStatus: 'paid',
    description: 'Complete solar panel installation for 3-bedroom house including inverter and battery storage'
  },
  {
    id: '2',
    orderNumber: 'PRJ-2024-002',
    projectTitle: 'Commercial Solar Setup',
    customerName: 'ABC Corporation',
    customerEmail: 'contact@abc-corp.com',
    budget: 75000,
    status: 'in-progress',
    priority: 'medium',
    startDate: '2024-01-15',
    estimatedCompletion: '2024-03-30',
    paymentStatus: 'paid',
    description: 'Large-scale solar installation for office building with 50kW capacity'
  },
  {
    id: '3',
    orderNumber: 'PRJ-2024-003',
    projectTitle: 'Home Energy Storage',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    budget: 8500,
    status: 'completed',
    priority: 'low',
    startDate: '2024-01-05',
    estimatedCompletion: '2024-01-20',
    paymentStatus: 'paid',
    description: 'Battery storage system installation with existing solar panels'
  },
  {
    id: '4',
    orderNumber: 'PRJ-2024-004',
    projectTitle: 'Solar Panel Maintenance',
    customerName: 'Mike Davis',
    customerEmail: 'mike.davis@email.com',
    budget: 1200,
    status: 'new',
    priority: 'high',
    startDate: '2024-02-10',
    estimatedCompletion: '2024-02-12',
    paymentStatus: 'paid',
    description: 'Annual maintenance and cleaning of existing solar panel system'
  }
];

const ProjectOrder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'new':
        return 'destructive';
      case 'in-progress':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // In real app, this would make an API call
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const filteredOrders = mockProjectOrders.filter(order => {
    const matchesSearch =
      order.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalOrders = mockProjectOrders.length;
  const newOrders = mockProjectOrders.filter(order => order.status === 'new').length;
  const inProgressOrders = mockProjectOrders.filter(order => order.status === 'in-progress').length;
  const completedOrders = mockProjectOrders.filter(order => order.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Orders</h1>
        <p className="text-muted-foreground">Manage your customer project orders and timelines</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Orders</p>
                <p className="text-2xl font-bold text-red-600">{newOrders}</p>
              </div>
              <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressOrders}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No project orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{order.projectTitle}</CardTitle>
                      <Badge className={`px-2 py-1 text-xs border ${getPriorityColor(order.priority)}`}>
                        {order.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                    <p className="text-sm font-medium">Customer: {order.customerName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusIcon(order.status)}
                      {order.status.replace('-', ' ').charAt(0).toUpperCase() + order.status.replace('-', ' ').slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{order.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-muted-foreground text-sm">Budget:</span>
                      <p className="font-semibold text-lg">${order.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Start Date:</span>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Est. Completion:</span>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.estimatedCompletion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {!['completed', 'cancelled'].includes(order.status) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                      >
                        Cancel Order
                      </Button>
                    )}

                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Customer
                    </Button>
                    {order.status === 'new' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'in-progress')}
                      >
                        Start Project
                      </Button>
                    )}
                    {order.status === 'in-progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectOrder;