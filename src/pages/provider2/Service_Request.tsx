
import React, { useEffect, useState } from 'react';
import {ClipboardList, GitPullRequestCreateArrow, HomeIcon, Search, SettingsIcon,} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { useDashboardStore, Request } from '@/store/dashboardStore';
import { Request } from '@/store/provider.interface';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';


export default function Service_Requests() {
    const { toast } = useToast();
  // const { requestStatus, updateRequestStatus } = useDashboardStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchRequest, setSearchRequest] = useState<String>('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||

      request.service_category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      statusFilter === 'all' || request.service_category === statusFilter;

    return matchesSearch && matchesCategory;
  });

    const  handleRequestStatusUpdate = async (request_id: number, newStatus: 'accepted' | 'rejected') => {

    const response = await axios.post("http://localhost/Git/Project1/Backend/updateRequestStatusProvider.php", {
      request_id: request_id,
      status: newStatus,

    },
      { withCredentials: true }
    );
     if (response.data.success) {
      toast({
        title: "Status updated!",
        description: "Service request status updated successfully.",

      });
    }
    else {
      toast({
        title: "Status update failed",
        variant: "destructive",
        description:"Service request status updated successfully."

      });

    }

    setRequests((prev) =>
      prev.map((req) =>
        req.request_id === request_id ? { ...req, status: newStatus } : req
      )
    );
  };


  return (
    <>
      {/* <TabsContent value="requests"> */}
      <div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
              <ClipboardList className="h-6 w-6 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Installation</p>
                <p className="text-2xl font-bold ">
                  {requests.filter((r) => r.service_category === "installation").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <GitPullRequestCreateArrow className="h-6 w-6 " />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Relocation</p>
                <p className="text-2xl font-bold ">
                  {requests.filter((r) => r.service_category === "relocation").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <HomeIcon className="h-6 w-6 " />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold ">
                  {requests.filter((r) => r.service_category === "maintenance").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
                <SettingsIcon className="h-6 w-6 " />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search requests"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-52">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Category</SelectItem>
              <SelectItem value="installation">Installation</SelectItem>
              <SelectItem value="relocation">Relocation</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              {/* <SelectItem value="cancelled">Cancelled</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No service requests found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((req) => (
              <Card key={req.request_id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="border-b pb-4">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Request #{req.request_id}
                      </p>
                      <p className="font-medium">
                        Customer: {req.customer_name || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(req.request_date).toLocaleString()}
                      </p>
                      <p className="text-sm">Phone: {req.customer_phone}</p>
                      <p className="text-sm">Email: {req.customer_email}</p>
                    </div>
                    <div className="flex items-center gap-3">


                        <Button
                          variant="default"
                          size="sm"
                        onClick={() =>
                          handleRequestStatusUpdate(req.request_id, "accepted")
                        }
                        >
                          Accept Request
                        </Button>
  
                        <Button
                          variant="destructive"
                          size="sm"
                        onClick={() =>
                          handleRequestStatusUpdate(req.request_id, "rejected")
                        }
                        >
                          Cancel Request
                        </Button>
               
                    </div>

                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Service Info */}
                  <div className="space-y-2">
                    <p className="font-medium">{req.service_name}</p>
                                     <p className="text-sm">
                      Category: <span className='font-semibold'>{req.service_category} </span>
                    </p>
                    <p className="font-medium">Price: Rs.{req.service_price}</p>
                  </div>

                  {/* Extra Details */}
                  {req.details && Object.keys(req.details).length > 0 && (
                    <div className="border-t pt-4 text-sm space-y-1">
                      {Object.entries(req.details).map(([key, value]) => (
                        <p key={key}>
                          <span className="font-medium capitalize">{key.replace(/_/g, " ")}:</span>{" "}
                          {value}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Actions */}

                </CardContent>
              </Card>
            ))}
            
          </div>
        )}
      </div>

    </>
  );
}
