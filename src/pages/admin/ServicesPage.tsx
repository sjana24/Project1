
import { useState, useEffect } from 'react';
// import { getData, setData, Service } from '../../utils/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import axios from 'axios';
import { Search, ShoppingCart, Check, X, Clock } from 'lucide-react';
export interface Service {
  // id: string;
  name: string;
  provider: string;
  category: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  dateAdded: string;

   service_id: number;
  provider_id: number;
  // name: string;
  description: string;
  // price: number;
  // category: string;
  // specifications: string;
  /// rating add pannale
  images: string; // this is a JSON string (array in string)
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
    // const serviceData = getData<Service>('services');
    // const serviceData = [];
    // setServices(serviceData);
    // setFilteredServices(serviceData);
  }, []);
  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllServiceAdmin.php")
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setServices(data.services);
          setFilteredServices(data.services);
        }
        else {
          // setError('Failed to load products.');
          console.log(response.data);
          console.log(" sorry we cant get ur products");
        }
        setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        setLoading(false);
      });

  }, []);

  useEffect(() => {
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  // const updateServiceStatus = (serviceId: number, is_approved:boolean) => {
  //   const updatedServices = services.map(service => {
  //     if (service.service_id === serviceId) {
  //       toast({
  //         title: "Service Updated",
  //         description: `Service ${service.name} has been ${status}`,
  //       });
  //       return { ...service, status };
  //     }
  //     return service;
  //   });

  //   // setServices(updatedServices);
  //   // setData('services', updatedServices);
  // };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <Check className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };
    const updateServiceStatus = ( is_approved: Service['is_approved'],serviceGet:Service) => {
      const updatedServices = services.map(service => {
        if (service.service_id=== serviceGet.service_id) {
         
          return { ...service, is_approved };
        }
        return service;
      });
  
      setServices(updatedServices);
      setFilteredServices(updatedServices);
       toast({
            title: "Service Status Updated",
            description: `${serviceGet.name} has been ${(is_approved)  ? "visible" : "hidden "}`,
            variant:(!(is_approved)? 'destructive':"default"),
          });
      // navigate(0);
      // setData('products', updatedProducts);
    };
    const updateServiceVisibility = (checked: boolean,service:Service) => {
      updateServiceStatus( checked ? true : false,service);
    };

  const hiddenServices = services.filter(s => s.is_approved == false).length;
  const visibleServices = services.filter(s => s.is_approved == true).length;

  return (
    <div className="space-y-6">
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
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hidden Services</p>
                <p className="text-2xl font-bold text-red-600">{hiddenServices}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Visible Services</p>
                <p className="text-2xl font-bold text-green-600">{visibleServices}</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
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

      {/* Services List */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>All Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <div key={service.service_id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20 hover:bg-white/70 transition-colors">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">by {service.provider_id}</p>
                      <p className="text-xs text-gray-500">Category: {service.category}</p>
                      <p className="text-xs text-gray-500">Added: {new Date(service.created_at).toLocaleDateString()}</p>
                       <p className="text-xs text-gray-500">Last Updated: {new Date(service.updated_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">${service.price}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 ml-4">
                  {/* {getStatusBadge(service.status)} */}
                   <div className="flex items-center space-x-2">
                   
                    <Switch
                      checked={service.is_approved} // assuming product has an `is_visible` boolean field
                      onCheckedChange={(checked) => updateServiceVisibility( checked,service)}
                    />
                    <span className="text-sm text-gray-700">
                      {service.is_approved ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  {/* {service.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateServiceStatus(service.id, 'approved')}
                        className="hover:bg-green-50 hover:text-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateServiceStatus(service.id, 'rejected')}
                        className="hover:bg-red-50 hover:text-red-700"
                      >
                        Reject
                      </Button>
                    </div>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesPage;
