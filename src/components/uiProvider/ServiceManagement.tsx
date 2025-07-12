import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  district: string;
  duration: string;
  status: 'active' | 'inactive';
}
const ServiceManagement=()=>{
     const [isDialogOpen, setIsDialogOpen] = useState(false);
     const [editingService,setEditingService]=useState<Service[]>([]);
     const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    district: '',
    duration: ''
  });

    const services=[

         {
      id: '1',
      title: 'Complete Solar Installation',
      description: 'End-to-end solar system installation with warranty',
      price: '150000',
      category: 'Installation',
      district: 'Colombo',
      duration: '3-5 days',
      status: 'active'
    },
     {
      id: '1',
      title: 'Complete Solar Installation',
      description: 'End-to-end solar system installation with warranty',
      price: '150000',
      category: 'Installation',
      district: 'Colombo',
      duration: '3-5 days',
      status: 'active'
    },
     {
      id: '1',
      title: 'Complete Solar Installation',
      description: 'End-to-end solar system installation with warranty',
      price: '150000',
      category: 'Installation',
      district: 'Colombo',
      duration: '3-5 days',
      status: 'active'
    },
    ];
    const resetForm = () => {
    // setFormData({
    //   title: '',
    //   description: '',
    //   price: '',
    //   category: '',
    //   district: '',
    //   duration: ''
    // });
    setEditingService(editingService);
  };

    return( 
        <div className="space-y-6">
             {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Service Management
          </h1>
          <p className="text-gray-600">
            Manage your solar service offerings
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="solar-button-primary" onClick={resetForm} >
              ➕ Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
              <DialogDescription>
                {editingService ? 'Update your service details' : 'Add a new solar service to your offerings'}
              </DialogDescription>
            </DialogHeader>
            
            <form  className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                   value={formData.title}
                  
                  placeholder="e.g., Complete Solar Installation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  
                  placeholder="Describe what's included in this service..."
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (LKR) *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    
                    placeholder="150000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                   value={formData.duration}
                    
                    placeholder="e.g., 3-5 days"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>District *</Label>
                    <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="solar-button-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

{/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="solar-card-hover">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  service.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.status}
                </span>
              </div>
              <CardDescription className="text-sm">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-solar-green">
                    LKR {parseInt(service.price).toLocaleString()}
                  </span>
                  <span className="text-sm bg-solar-yellow/20 text-solar-green px-2 py-1 rounded">
                    {service.district}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                  <div>Category: {service.category}</div>
                  <div>Duration: {service.duration}</div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    
                    className="flex-1"
                  >
                    ✏️ Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    
                    className="flex-1"
                  >
                    {service.status === 'active' ? '⏸️ Pause' : '▶️ Activate'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>



       {services.length === 0 && (
        <Card className="p-12 text-center">
          <CardContent>
            <p className="text-gray-500 mb-4">No services listed yet</p>
            <Button className="solar-button-primary" onClick={() => setIsDialogOpen(true)}>
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      )}  
        </div>
    );
};
export default ServiceManagement;