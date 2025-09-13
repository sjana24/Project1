
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useDashboardStore, Service } from '@/store/dashboardStore';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import axios from 'axios';
export interface Review {
  review_id: number;
  rating: number;
  comment: string;
  created_at: string;
}
export interface Service {
  service_id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  is_active: boolean;
  is_approved:boolean;
  reviews:Review[];
  category: 'installation' | 'maintainace' | 'relocation';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export default function Services() {
  // const { services, addService, updateService, deleteService } = useDashboardStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);

  // const services=[];
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category:'',
    type: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const serviceTypes = [
    'Installation',
    'Maintenance',
    'Repair',
    'Relocation',

  ];
  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllServiceProvider.php",
      {
        withCredentials: true
      })
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setServices(data.services);
        }
        else {
          // setError('Failed to load services.');
          // console.log(response.data);
          console.log(" sorry we cant get ur products");
        }
        setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        setLoading(false);
      });


  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingService) {

      const response = await axios.post("http://localhost/Git/Project1/Backend/updateProviderService.php", {formData: formData,service_id: editingService.service_id }, { withCredentials: true });

      if (response.data.success) {
        toast({
          title: 'Service Updated',
          description: 'Service has been updated successfully.',
        });
      }
      else {
        toast({
          title: 'Service Updated failure',
          description: 'Service has been updated failure.',
          variant: "destructive"
        });

      }

      // updateService(editingService.id, formData);

    } else {
      // addService(formData);
      const response = await axios.post("http://localhost/Git/Project1/Backend/addProviderService.php", { formData }, { withCredentials: true });

      if (response.data.success) {
        toast({
          title: 'Service Added',
          description: 'New service has been added successfully.',
        });
      }
      else {
        toast({
          title: 'Service Addeded failure',
          description: 'Service has been added failure.',
          variant: "destructive"
        });

      }
    }

    setFormData({
      name: '',
      description: '',
      price: 0,
      type: '',
      category:'',
      status: 'Active',
    });
    setEditingService(null);
    setIsModalOpen(false);
  };
  const updateServiceStatus = async(serviceGet:Service, is_active: Service['is_active']) => {
    const updatedServices = services.map(service => {
      if (service.service_id === serviceGet.service_id) {
       
        return { ...service, is_active };
      }
      return service;
    });

    setServices(updatedServices);
    // setFiltereServices(updatedServices);
    
   try {
      const res = await axios.post("http://localhost/Git/Project1/Backend/updateProviderServiceStatus.php", 
        {
        service_id: serviceGet.service_id,
        is_active: is_active ? 1 : 0, // send as int to PHP
      }, 
        { withCredentials: true });
      // console.log("Registration successful:");
       if (res.data.success) {
        console.log("status updarted  ");
        toast({
          title: "service status updated!",
          description: "Successful",
        });
        // navigate (0);


     
      }
      else {
        console.log(res.data);
        toast({
          title: "Sign up failed",
          description: "Email already used use another email",
          variant: "destructive",
        });
        console.log(" error in login"); // show error message from PHP

      }


    } catch (err) {
      console.error("Error registering user:", err);
    } finally {
      // setIsLoading(false);
    }

    
  };
  const updateServicetVisibility = (service:Service, is_active: boolean) => {
    updateServiceStatus(service, is_active ? true : false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      type: service.type,
      category:service.category,
      status: service.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (service_id: number) => {
   

      const response = await axios.post("http://localhost/Git/Project1/Backend/deleteProviderService.php", {service_id:service_id }, { withCredentials: true });

      if (response.data.success) {
        toast({
          title: 'Service Deleted',
          description: 'Service has been deleted successfully.',
        });
      }
      else {
        toast({
          title: 'Service Deleted failure',
          description: 'Service has been deleted failure.',
          variant: "destructive"
        });

      }
  };

  // Function to toggle service status
const toggleServiceStatus = async (service: any, checked: boolean) => {
  try {
    const newStatus = checked ? 1 : 0;

    const res = await axios.post(
      "http://localhost/Git/Project1/Backend/updateProviderServiceStatus.php",
      { service_id: service.service_id, is_active: newStatus },
      { withCredentials: true }
    );

    if (res.data.success) {
      toast({
        title: "Status Updated",
        description: `Service "${service.name}" is now ${checked ? "Active" : "Inactive"}`,
      });

      // Optionally update local state to reflect the change instantly
      setServices((prevServices: any[]) =>
        prevServices.map((s) =>
          s.service_id === service.service_id ? { ...s, is_active: newStatus } : s
        )
      );
    } else {
      toast({
        title: "Error",
        description: res.data.message || "Failed to update status",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Error updating service status:", error);
    toast({
      title: "Error",
      description: "Something went wrong while updating status.",
      variant: "destructive",
    });
  }
};


  return (
    
    <div className="space-y-6">
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services</h1>
      <p className="text-gray-500 dark:text-gray-400">Manage your services and offerings</p>
    </div>
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Price & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (Rs.)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            {/* <div> */}
              {/* <Label htmlFor="status">Status</Label> */}
              {/* <Select
                value={formData.is_active ? 'Active' : 'Inactive'}
                onValueChange={(value) =>
                  setFormData({ ...formData, is_active: value === 'Active' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select> */}
            {/* </div> */}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
              {editingService ? 'Update' : 'Add'} Service
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>

  {/* Search */}
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <Input
      placeholder="Search services..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10"
    />
  </div>

  {/* Services Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredServices.map((service) => (
      <Card key={service.service_id} className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <div className="flex space-x-2 mt-1">
              <Badge variant="secondary">
                {service.category}
                </Badge>
              <Badge
                variant={service.is_approved ? 'default' : 'destructive'}
                className="capitalize"
              >
                {service.is_approved ? 'Active' : 'Inactive by admin'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={service.is_active}
              onCheckedChange={(checked) => toggleServiceStatus(service, checked)}
            />
            <span className="text-sm text-gray-700">
              {service.is_active ? 'On' : 'Off'}
            </span>
          </div>

          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(service.service_id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Service Details & Reviews</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p className="font-medium">{service.description}</p>
                  <p>
                    <span className="font-semibold">Price:</span> Rs. {service.price}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span> 
                    {service.category}
                  </p>
                  <p className="font-semibold">Reviews:</p>
                  {service.reviews.length === 0 ? (
                    <p>No reviews yet</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      {service.reviews.map((review) => (
                        <li key={review.review_id}>
                          <p className="font-medium">Rating: {review.rating}/5</p>
                          <p>{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
            {service.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-green-600">
              Rs. {service.price.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>

  {filteredServices.length === 0 && (
    <div className="text-center py-12">
      <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">No services found</h3>
      <p className="text-gray-500 dark:text-gray-400">
        {searchTerm ? 'Try adjusting your search terms' : 'Add your first service to get started'}
      </p>
    </div>
  )}
</div>

  );
}
