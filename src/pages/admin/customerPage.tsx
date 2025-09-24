import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, Users, UserCheck, UserX } from 'lucide-react';

export interface User {
  user_id: number;
  username: string;
  email: string;
  status: 'active' | 'disabled';
  created_at: string;
  contact_number?: string;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetAllCustomerAdmin.php", { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          const mappedCustomers: User[] = response.data.customers.map((c: any) => ({
            user_id: c.user_id,
            username: c.username,
            email: c.email,
            status: c.is_blocked === 0 ? 'active' : 'disabled',
            created_at: c.created_at,
            contact_number: c.contact_number || "0123456789"
          }));
          setCustomers(mappedCustomers);
          setFilteredCustomers(mappedCustomers);
        } else {
          console.log("Failed to fetch customers:", response.data);
        }
      })
      .catch(err => {
        console.error("Error fetching customers:", err);
      });
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  // const updateStatus = (customer_id: number, new_status: 'active' | 'disabled') => {
  //   console.log(customer_id, new_status);
  //   // Call API to update status if needed
  //   const updated = customers.map(c =>
  //     c.user_id === customer_id ? { ...c, status: new_status } : c
  //   );
  //   setCustomers(updated);
  //   setFilteredCustomers(updated);
  //   toast({
  //     title: "Status Updated",
  //     description: `Customer status updated to ${new_status}`,
  //   });
  // };
  const updateStatus = async (customer_id: number, new_status: 'active' | 'disabled') => {
  try {
    const res = await axios.post(
      "http://localhost/Git/Project1/Backend/UpdateCustomerStatus.php",
      {
        user_id: customer_id,
        status: new_status,
      },
      { withCredentials: true }
    );

    if (res.data.success) {
      // Update state locally so UI changes immediately
      const updated = customers.map(c =>
        c.user_id === customer_id ? { ...c, status: new_status } : c
      );
      setCustomers(updated);
      setFilteredCustomers(updated);

      toast({
        title: "Status Updated",
        description: `Customer status updated to ${new_status}`,
      });
    } else {
      toast({
        title: "Error",
        description: res.data.message || "Failed to update customer status",
        variant: "destructive",
      });
    }
  } catch (err) {
    console.error("Error updating status:", err);
    toast({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive",
    });
  }
};


  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <UserCheck className="w-3 h-3 mr-1" /> Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        <UserX className="w-3 h-3 mr-1" /> Disabled
      </Badge>
    );
  };

  const activeUsers = customers.filter(u => u.status === 'active').length;
  const disabledUsers = customers.filter(u => u.status === 'disabled').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-3xl font-bold text-gray-900">Customer Management</h5>
          <p className="text-gray-600 mt-2">Manage customer accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-green-600">{activeUsers} Active</span> • 
            <span className="font-medium text-red-600 ml-1">{disabledUsers} Disabled</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-white/20">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Disabled Customers</p>
              <p className="text-2xl font-bold text-red-600">{disabledUsers}</p>
            </div>
            <UserX className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>Search Customers</CardTitle>
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

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((user) => (
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
                    <p className="text-sm text-muted-foreground">{user.contact_number}</p>
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
                <div className="flex gap-2 pt-2">
                  {/* <Button size="sm" variant="outline" className="flex-1">View Details</Button> */}
                  {user.status === 'disabled' ? (
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1 bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => updateStatus(user.user_id, 'active')}
                    >
                      <UserCheck className="w-3 h-3" /> Activate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => updateStatus(user.user_id, 'disabled')}
                    >
                      <UserX className="w-3 h-3" /> Suspend
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

export default CustomersPage;
