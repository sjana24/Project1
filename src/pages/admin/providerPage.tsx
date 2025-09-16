import { useState, useEffect, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Users, UserCheck, UserX, Eye , Box, Wrench} from 'lucide-react';
import axios from 'axios';

export interface Provider {
  user_id: number;
  username: string;
  email: string;
  status: 'active' | 'disabled';
  created_at: Date;
  contact_number: number;

  provider_id: number;
  company_name: string;
  business_registration_number: string;
  address: string;
  district: string;
  website: string;
  company_description: string;
  profile_image?: string;
  verification_status: string;
   products_count?: number;
  services_count?: number;
}


const ProviderPage = () => {
  const [customers, setCustomers] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
    const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);


  useEffect(() => {
    axios
      .get('http://localhost/Git/Project1/Backend/GetAllProvidersAdmin.php', {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          console.log('data got');
          setCustomers(data.providers);
        } else {
          console.log('Failed to fetch providers:', data);
        }
      })
      .catch((err) => {
        console.error('Error fetching providers:', err);
      });
  }, []);

  const updateStatus = (customer_id: number, new_status: string) => {
    console.log(customer_id, new_status);
    toast({
      title: 'Status Update',
      description: `User ${customer_id} has been set to ${new_status}`,
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <UserCheck className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        <UserX className="w-3 h-3 mr-1" />
        Disabled
      </Badge>
    );
  };
  const fetchProviderCounts = async (provider: Provider) => {
    try {
      const response = await axios.get(`http://localhost/Git/Project1/Backend/GetProviderCounts.php?provider_id=${provider.provider_id}`);
      if (response.data.success) {
        // Update the state for the specific provider with the fetched counts
        setCurrentProvider({
          ...provider,
          products_count: response.data.products_count,
          services_count: response.data.services_count,
        });
      } else {
        console.error('Failed to fetch counts:', response.data.message);
        toast({
          title: "Error",
          description: "Failed to load provider counts.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching provider counts:', error);
      toast({
        title: "Error",
        description: "An error occurred while fetching data.",
        variant: "destructive",
      });
    }
  };

  const activeUsers = customers.filter((u) => u.status === 'active').length;
  const disabledUsers = customers.filter((u) => u.status === 'disabled').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-3xl font-bold text-gray-900">User Management</h5>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disabled Customers</p>
                <p className="text-2xl font-bold text-red-600">{disabledUsers}</p>
              </div>
              <UserX className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((user) => (
          <Card key={user.user_id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.username}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.contact_number ? user.contact_number : '0123456789'}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(user.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Joined</span>
                  <span className="text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>

                <div className="pt-2">
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{user.company_name}</p>
                  <div className="flex justify-between items-center mt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" /> View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[800px] max-w-[90vw] h-[600px] flex flex-col rounded-xl overflow-hidden p-0">
                        <DialogHeader className="flex justify-start items-start p-4 border-b">
                          <DialogTitle className="text-xl font-bold">{user.username}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 flex flex-col md:flex-row p-6 items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 overflow-y-auto">
                          <div className="flex-shrink-0 w-full md:w-64">
                            <div className="w-full h-auto bg-gray-100 rounded-xl overflow-hidden shadow-lg aspect-w-1 aspect-h-1">
                              <img
                                src={`http://localhost/Git/Project1/Backend/${user.profile_image}`}
                                alt={`${user.username}'s profile`}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="flex-1 space-y-4 text-sm md:text-base">
                            <p className="flex justify-between items-center border-b pb-2">
                              <strong className="font-semibold text-gray-700">Company Name:</strong>
                              <span className="text-gray-900">{user.company_name}</span>
                            </p>
                            <p className="flex justify-between items-center border-b pb-2">
                              <strong className="font-semibold text-gray-700">Business Registration Number:</strong>
                              <span className="text-gray-900">{user.business_registration_number}</span>
                            </p>
                            <p className="flex justify-between items-center border-b pb-2">
                              <strong className="font-semibold text-gray-700">Address:</strong>
                              <span className="text-gray-900 text-right">{user.address}</span>
                            </p>
                            <p className="flex justify-between items-center border-b pb-2">
                              <strong className="font-semibold text-gray-700">District:</strong>
                              <span className="text-gray-900">{user.district}</span>
                            </p>
                            <p className="flex justify-between items-center border-b pb-2">
                              <strong className="font-semibold text-gray-700">Website:</strong>
                              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 truncate max-w-[200px]">
                                {user.website}
                              </a>
                            </p>
                            <div className="border-b pb-2">
                              <strong className="font-semibold text-gray-700 block mb-1">Company Description:</strong>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{user.company_description}</p>
                            </div>
                            <p className="flex justify-between items-center">
                              <strong className="font-semibold text-gray-700">Status:</strong>
                              <span className={`px-3 py-1 rounded-full text-white font-medium text-xs ${user.verification_status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                {user.verification_status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Action buttons */}
                {user.status === 'disabled' ? (
                  <Button
                      size="sm"
                      variant="default"
                      className="gap-1 bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => updateStatus(user.provider_id, 'active')}
                    >
                      <UserCheck className="w-3 h-3" />
                      Activate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => updateStatus(user.provider_id, 'disabled')}
                    >
                      <UserX className="w-3 h-3" />
                      Suspend
                    </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProviderPage;
