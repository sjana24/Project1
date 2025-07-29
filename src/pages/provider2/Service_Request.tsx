
import React, { useEffect, useState } from 'react';
import { Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { useDashboardStore, Request } from '@/store/dashboardStore';
import axios from 'axios';

interface Request {
  request_id: number;
  customer_id: number;
  service_id: number;
  request_date: string;         // ISO date string
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  service_type: "installation" | "maintenance" | "relocation";

  // Customer info
  customer_name: string;
  customer_email: string;
  customer_phone: string;

  // Service info
  service_name: string;
  service_description: string;
  service_price: number;
  service_category: string;

  // Extra service-type-specific details
  details: InstallationDetails | MaintenanceDetails | RelocationDetails | {};
}

interface InstallationDetails {
  installation_address: string;
  roof_height: number;
}

interface MaintenanceDetails {
  device_condition: string;
  service_notes: string;
  last_maintenance_date: string;
  roof_height: number;
}

interface RelocationDetails {
  current_address: string;
  new_address: string;
  current_roof_height: number;
  new_roof_height: number;
}


// export interface Request {
//   request_id: number;
//   customerName: string;
//   customerEmail: string;
//   customerPhone: string;
//   service: string;
//   description: string;
//   status: 'pending' | 'In Progress' | 'Completed';
//   createdAt: string;
// }


export default function Service_Requests() {
  // const { requestStatus, updateRequestStatus } = useDashboardStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllServiceRequestProvider.php", { withCredentials: true })
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setRequests(data.requests);
          // setFil
        }
        else {
          // setError('Failed to load products.');
          console.log(response.data);
          console.log(" sorry we cant get ur requests");
        }
        setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        setLoading(false);
      });

  }, []);
  const filteredRequests = requests.filter(request =>
    statusFilter === 'all' || request.service_category === statusFilter
  );

  // const handleStatusChange = (id: number, status: Request['status']) => {
  //   // updateRequestStatus(id, status);
  // };
   const handleStatusChange = async (request_id: number, customer_id: number, newStatus: 'accepted' | 'rejected') => {
    console.log("handleStatusChange called with request_id:", request_id, "customer_id:", customer_id, "newStatus:", newStatus);

    const response = await axios.post("http://localhost/Git/Project1/Backend/ManageServiceRequestStatus.php", {
      // customer_id: currentUser.customerId,
      // product_Details: product,
      request_id: request_id,
      customer_id: customer_id,
      status: newStatus,

    },
      { withCredentials: true }
    );
    console.log(response.data);
    if (response.data.success) {
      //   // After adding product to cart
      //   triggerCartUpdate();
      //   console.log("add to cart sucess ");
      // toast({
      //   title: "Requset accepted !",
      //   description: ``,

      // });
    }
    // else {
    //   console.log(" erroe adoi");
    //   toast({
    //     title: "Only for Customers!",
    //     variant: "destructive",
    //     // description: `${product.name} has been added to your cart.`,

    //   });

    // }

    // setRequests((prev) =>
    //   prev.map((req) =>
    //     req.request_id === request_id ? { ...req, status: newStatus } : req
    //   )
    // );
  };

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage customer service requests</p>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Category</SelectItem>
              <SelectItem value="installation">Installtion</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="relocation">Relocation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Installation</p>
                <p className="text-2xl font-bold text-blue-600">
                  {requests.filter(r => r.service_category === 'installation').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {requests.filter(r => r.service_category === 'maintenance').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Relocation</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.service_category === 'relocation').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No requests found</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.request_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{request.service_name}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Customer:</span>
                        <p className="font-medium">{request.customer_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Email:</span>
                        <p className="font-medium">{request.customer_email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                        <p className="font-medium">{request.customer_phone}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Description:</span>
                      <p className="text-gray-700 dark:text-gray-300">{request.service_description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">

                    <div>
                      <Button size="sm" 
                      onClick={() => handleStatusChange(request.request_id, request.customer_id, 'accepted')}
                      >Accept</Button>
                      <Button variant="destructive" size="sm" 
                      onClick={() => handleStatusChange(request.request_id, request.customer_id, 'rejected')}
                      >Reject</Button>
                    </div>
                    {/* <Select
                      value={request.status}
                      onValueChange={(value: Request['status']) => handleStatusChange(request.request_id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select> */}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Request Details</DialogTitle>
                        </DialogHeader>
                        {selectedRequest && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Service</label>
                                <p className="text-lg font-semibold">{selectedRequest.service_name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                <Badge className={getStatusColor(selectedRequest.status)}>
                                  {selectedRequest.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Name</label>
                                <p>{selectedRequest.customer_name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                <p>{selectedRequest.customer_email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                <p>{selectedRequest.customer_phone}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                              <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                {selectedRequest.service_description}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</label>
                              <p>{new Date(selectedRequest.request_date).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
