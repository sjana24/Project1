import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import axios from 'axios';
import { Search, ShoppingCart, Check, X, Clock, Eye, EyeOff, MoreHorizontal } from 'lucide-react';

export interface Service {
  service_id: number;
  provider_id: number;
  name: string;
  provider: string;
  category: string;
  price: number;
  description: string;
  images: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllServiceAdmin.php")
      .then(response => {
        const data = response.data;
        if (data.success && data.services?.length > 0) {
          // Map services and set provider as string
          const mappedServices = data.services.map((s: any) => ({
            ...s,
            provider: `Provider ${s.provider_id}`,
            price: parseFloat(s.price),
          }));
          setServices(mappedServices);
          setFilteredServices(mappedServices);
        } else {
          setServices([]);
          setFilteredServices([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const getStatusBadge = (is_approved: boolean) => {
    if (is_approved) return <Badge className="bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
  };

  const toggleApproval = (service: Service) => {
    const updatedServices = services.map(s => 
      s.service_id === service.service_id ? { ...s, is_approved: !s.is_approved } : s
    );
    setServices(updatedServices);
    setFilteredServices(updatedServices);
    toast({
      title: "Service Status Updated",
      description: `${service.name} is now ${!service.is_approved ? "visible" : "hidden"}`,
      variant: !service.is_approved ? "default" : "destructive"
    });
  };

  const hiddenServices = services.filter(s => !s.is_approved).length;
  const visibleServices = services.filter(s => s.is_approved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600 mt-2">Review and approve services from providers</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-yellow-600">{hiddenServices} Hidden</span> • 
            <span className="font-medium text-green-600 ml-1">{visibleServices} Visible</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-white/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hidden Services</p>
              <p className="text-2xl font-bold text-red-600">{hiddenServices}</p>
            </div>
            <Clock className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visible Services</p>
              <p className="text-2xl font-bold text-green-600">{visibleServices}</p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>Search Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, provider, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <Card key={service.service_id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{service.category}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(service.is_approved)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <span className="text-sm">{service.provider}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-medium">Rs {service.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Date Added</span>
                  <span className="text-sm">{new Date(service.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Visible</span>
                  <div className="flex items-center gap-2">
                    {service.is_approved ? <Eye className="w-4 h-4 text-success" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    <Switch
                      checked={service.is_approved}
                      onCheckedChange={() => toggleApproval(service)}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                  {!service.is_approved && (
                    <Button size="sm" variant="default" className="bg-success hover:bg-success/90 text-success-foreground">
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
