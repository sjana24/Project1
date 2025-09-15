
import { useState, useEffect } from 'react';
// import { getData, setData, User } from '../../utils/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, Users, UserCheck, UserX } from 'lucide-react';
import axios from 'axios';
export interface User {
  user_id: number;
  username: string;
  email: string;
  status: 'active' | 'disabled';
  joinDate: string;
  orders: number;
  created_at:Date;
  contact_number:number;


}

const ProviderPage = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);

//   useEffect(() => {
//     // const userData = getData<User>('users');
//      const userData =[];
//     setUsers(userData);
//     setFilteredUsers(userData);
//   }, []);

   useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllProvidersAdmin.php", { withCredentials: true })
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setCustomers(data.providers);
        }
        else {
          // setError('Failed to load products.');
          console.log(response.data);
          console.log(" sorry we cant get ur products");
        }
        // setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        // setLoading(false);
      });

  }, []);

//   useEffect(() => {
//     const filtered = customers.filter(customer =>
//       customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredCustomers(filtered);
//   }, [searchTerm, customers]);

//   const toggleUserStatus = (userId: string) => {
//     const updatedUsers = users.map(user => {
//       if (user.id === userId) {
//         const newStatus: 'active' | 'disabled' = user.status === 'active' ? 'disabled' : 'active';
//         toast({
//           title: "Status Updated",
//           description: `User ${user.name} has been ${newStatus}`,
//         });
//         return { ...user, status: newStatus };
//       }
//       return user;
//     });

    // setCustomers(updatedUsers);
    // setData('users', updatedUsers);
//   };
const updateStatus =(customer_id:number,new_status:string) =>{
console.log(customer_id,new_status);
}

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

  const activeUsers = customers.filter(u => u.status === 'active').length;
  const disabledUsers = customers.filter(u => u.status === 'disabled').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-3xl font-bold text-gray-900">User Management</h5>
          {/* <p className="text-gray-600 mt-2">Manage customer accounts and permissions</p> */}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {/* <span className="font-medium text-green-600">{activeUsers} Active</span> •  */}
            {/* <span className="font-medium text-red-600 ml-1">{disabledUsers} Disabled</span> */}
          </div>
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
            //   value={searchTerm}
            //   onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {/* <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>All Users ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((user) => (
              <div key={user.user_id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20 hover:bg-white/70 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{user.orders} orders</p>
                  </div>
                  {/* {getStatusBadge(user.status)} */}
                  {/* <Button
                    variant="outline"
                    size="sm"
                    // onClick={() => toggleUserStatus(user.id)}
                    className={user.status === 'active' ? 'hover:bg-red-50 hover:text-red-700' : 'hover:bg-green-50 hover:text-green-700'}
                  > */}
                    {/* {user.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */} 


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
                    <p className="text-sm text-muted-foreground">{user.contact_number ? user.contact_number : "0123456789"}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  {/* <MoreHorizontal className="w-4 h-4" /> */}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(user.status)}
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Orders</span>
                  <span className="font-medium">{user.orders}</span>
                </div> */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Joined</span>
                  <span className="text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mobile number</span>
                  <span className="text-sm">
                    {/* {new Date(user.lastActivity).toLocaleDateString()} */}
                    {/* </span> */}
                {/* </div> */} 
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  {user.status === 'disabled' ? (
                    <Button size="sm" variant="default" className="gap-1 bg-success hover:bg-success/90 text-success-foreground"
                    onClick={()=>updateStatus(user.user_id,"active")}
                    >
                      <UserCheck className="w-3 h-3" />
                      Activate
                    </Button>
                  ) : (
                    <Button size="sm" variant="destructive" className="gap-1"
                    onClick={()=>updateStatus(user.user_id,"disabled")}
                    >
                      <UserX className="w-3 h-3" />
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    // </div>
  );
};

export default ProviderPage;
