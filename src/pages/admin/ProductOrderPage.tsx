import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, EyeOff, Package, DollarSign, Calendar, Download } from 'lucide-react';

// Mock data for admin view
const mockProductOrders = [
    {
        id: '1',
        orderNumber: 'ORD-2024-001',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        productName: 'Solar Panel 400W',
        productImage: '/placeholder.svg',
        price: 599.99,
        quantity: 2,
        total: 1199.98,
        status: 'delivered',
        orderDate: '2024-01-15',
        visible: true
    },
    {
        id: '2',
        orderNumber: 'ORD-2024-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        productName: 'Solar Inverter 3kW',
        productImage: '/placeholder.svg',
        price: 799.99,
        quantity: 1,
        total: 799.99,
        status: 'processing',
        orderDate: '2024-01-20',
        visible: true
    },
    {
        id: '3',
        orderNumber: 'ORD-2024-003',
        customerName: 'Mike Davis',
        customerEmail: 'mike.davis@email.com',
        productName: 'Battery Storage 10kWh',
        productImage: '/placeholder.svg',
        price: 1499.99,
        quantity: 1,
        total: 1499.99,
        status: 'shipped',
        orderDate: '2024-01-18',
        visible: false
    }
];

const mockProjectOrders = [
    {
        id: '1',
        orderNumber: 'PRJ-2024-001',
        customerName: 'ABC Corporation',
        customerEmail: 'contact@abc-corp.com',
        projectTitle: 'Commercial Solar Setup',
        description: 'Large-scale solar installation for office building',
        budget: 75000,
        status: 'in-progress',
        paymentStatus: 'paid',
        providerName: 'SolarTech Solutions',
        startDate: '2024-02-01',
        estimatedCompletion: '2024-03-30',
        visible: true
    },
    {
        id: '2',
        orderNumber: 'PRJ-2024-002',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        projectTitle: 'Residential Solar Installation',
        description: 'Complete solar panel installation for 3-bedroom house',
        budget: 15000,
        status: 'completed',
        paymentStatus: 'paid',
        providerName: 'Green Energy Pro',
        startDate: '2024-01-15',
        estimatedCompletion: '2024-02-15',
        visible: true
    },
    {
        id: '3',
        orderNumber: 'PRJ-2024-003',
        customerName: 'Emma Wilson',
        customerEmail: 'emma.w@email.com',
        projectTitle: 'Solar Panel Maintenance',
        description: 'Annual maintenance and cleaning service',
        budget: 1200,
        status: 'pending',
        paymentStatus: 'pending',
        providerName: 'Solar Maintenance Co',
        startDate: '2024-02-10',
        estimatedCompletion: '2024-02-12',
        visible: false
    }
];

const ProductOrderPage = () => {
    const [productOrders, setProductOrders] = useState(mockProductOrders);
    const [projectOrders, setProjectOrders] = useState(mockProjectOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const toggleOrderVisibility = (orderId: string, type: 'product' | 'project') => {
        if (type === 'product') {
            setProductOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, visible: !order.visible } : order
                )
            );
        } else {
            setProjectOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, visible: !order.visible } : order
                )
            );
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered':
            case 'completed':
            case 'cancelled':
                return <Package className="h-4 w-4" />;
            case 'processing':
            case 'in-progress':
                return <Package className="h-4 w-4" />;
            case 'shipped':
                return <Package className="h-4 w-4" />;
            case 'pending':
                return <Package className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'delivered':
            case 'completed':
                return 'default';
            case 'processing':
            case 'in-progress':
                return 'secondary';
            case 'shipped':
                return 'outline';
            case 'pending':
                return 'destructive';
            case 'cancelled':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const exportOrders = () => {
        // In real app, this would generate and download a CSV/Excel file
        console.log('Exporting orders...');
    };
    const cancelOrder = (orderId: string, type: 'product' | 'project') => {
        if (type === 'product') {
            setProductOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: 'cancelled' } : order
                )
            );
        } else {
            setProjectOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: 'cancelled' } : order
                )
            );
        }
    };

    const filteredProductOrders = productOrders.filter(order => {
        const matchesSearch =
            order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const filteredProjectOrders = projectOrders.filter(order => {
        const matchesSearch =
            order.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalOrders = productOrders.length + projectOrders.length;
    const totalRevenue = [...productOrders, ...projectOrders].reduce((sum, order) =>
        sum + ('total' in order ? order.total : order.budget), 0
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Orders Management</h1>
                    <p className="text-muted-foreground">Monitor and manage all customer orders</p>
                </div>
                <Button onClick={exportOrders} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Orders
                </Button>
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
                                <Package className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Product Orders</p>
                                <p className="text-2xl font-bold">{productOrders.length}</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Project Orders</p>
                                <p className="text-2xl font-bold">{projectOrders.length}</p>
                            </div>
                            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-yellow-600" />
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="products" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="products">Product Orders ({filteredProductOrders.length})</TabsTrigger>
                    <TabsTrigger value="projects">Project Orders ({filteredProjectOrders.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-4">
                    {filteredProductOrders.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No product orders found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredProductOrders.map((order) => (
                                <Card key={order.id} className={`hover:shadow-lg transition-shadow ${!order.visible ? 'opacity-50' : ''}`}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <img
                                                src={order.productImage}
                                                alt={order.productName}
                                                className="w-full md:w-24 h-24 object-cover rounded-lg"
                                            />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                    <h3 className="font-semibold text-lg">{order.productName}</h3>
                                                    <div className="flex items-center gap-2">
                                                        {!['delivered', 'completed', 'cancelled'].includes(order.status) && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => cancelOrder(order.id, 'product')}
                                                            >
                                                                Cancel Order
                                                            </Button>
                                                        )}

                                                        <Badge variant={getStatusVariant(order.status)}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </Badge>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => toggleOrderVisibility(order.id, 'product')}
                                                        >
                                                            {order.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            {order.visible ? 'Hide' : 'Show'}
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Customer:</span>
                                                        <p className="font-medium">{order.customerName}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Price:</span>
                                                        <p className="font-medium">${order.price}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Quantity:</span>
                                                        <p className="font-medium">{order.quantity}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Total:</span>
                                                        <p className="font-medium">${order.total}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Date:</span>
                                                        <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" className="w-fit">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                    {filteredProjectOrders.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No project orders found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredProjectOrders.map((order) => (
                                <Card key={order.id} className={`hover:shadow-lg transition-shadow ${!order.visible ? 'opacity-50' : ''}`}>
                                    <CardHeader>
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                            <div>
                                                <CardTitle className="text-xl">{order.projectTitle}</CardTitle>
                                                <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                                                <p className="text-sm font-medium">Customer: {order.customerName}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {!['delivered', 'completed', 'cancelled'].includes(order.status) && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => cancelOrder(order.id, 'project')}
                                                    >
                                                        Cancel Order
                                                    </Button>
                                                )}

                                                <Badge variant={getStatusVariant(order.status)}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status.replace('-', ' ').charAt(0).toUpperCase() + order.status.replace('-', ' ').slice(1)}
                                                </Badge>
                                                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}>
                                                    <DollarSign className="h-4 w-4 mr-1" />
                                                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleOrderVisibility(order.id, 'project')}
                                                >
                                                    {order.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    {order.visible ? 'Hide' : 'Show'}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <p className="text-muted-foreground">{order.description}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <span className="text-muted-foreground text-sm">Budget:</span>
                                                    <p className="font-semibold text-lg">${order.budget.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground text-sm">Provider:</span>
                                                    <p className="font-medium">{order.providerName}</p>
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
                                            <Button variant="outline" size="sm" className="w-fit">
                                                <Eye className="h-4 w-4 mr-2" />
                                                Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};
export default ProductOrderPage;