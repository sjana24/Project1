
import React, { useState, useEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { ChatWindow } from '@/components/ui/ChatWindow';
import { ChatSession, Message } from "@/types/chat";
import { useNavigate } from 'react-router-dom';




// Dummy data model
interface Request {
  request_id: number;
  customer_id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  service_name:string;
  requested_at:string;
}


export default function Chat() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const navigate = useNavigate();

  const { toast } = useToast();

 // Fetch products
  useEffect(() => {
    fetchChatRequests();
  }, []);

  const fetchChatRequests = () => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllChatProvider.php", { withCredentials: true })
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");
          const mappedRequests: Request[] = data.requests.map((item: any) => ({
            request_id: item.contact_id,
            customer_id: item.customer_id,
            customerName: item.customer_name,
            customerEmail: item.customer_email || 'N/A', // Fallback if email not provided
            customerPhone: item.customer_phone,
            service_name: item.service_name,
            description: item.description || 'No description provided.',
            status: item.status, // Convert "pending" → "Pending"
            createdAt: item.requested_at,
            _updatedAt: Date.now(),
          }));

          setRequests(mappedRequests);

          //   setRequests(data.requests);
        }
        else {
          // setError('Failed to load products.');
          // console.log(response.data);
          console.log(" sorry we cant get chats");
        }
        // setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        // setLoading(false);
      });
    }







async function handleStatusChange(request_id: number, customer_id: number, newStatus: string) {
  try {
    const response = await axios.post(
      "http://localhost/Git/Project1/Backend/ManageChatRequest.php",
      {
        request_id,
        customer_id,
        status: newStatus,
      },
      { withCredentials: true }
    );
    navigate(`/service_provider/MessagePro?redirect=${encodeURIComponent(location.pathname)}`);

    if (response.data.success) {
       setRequests(prev =>
        prev.map(r =>
          r.request_id === request_id ? { ...r, status: newStatus as Request['status'] } : r
        )
      );

           fetchChatRequests();
      toast({ title: "Request status updated", description: response.data.message });
 
    } else {
      toast({ title: "Request status update failed", description: response.data.message });
  
    }
  } catch (error: any) {
    console.error("❌ API Error:", error.response?.data || error.message);

  }
}


  const filteredRequests = requests.filter((r) =>
    statusFilter === 'all' ? true : r.status === statusFilter
  );

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Incoming Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">Review and respond to customer requests</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Requests</p>
                <p className="text-2xl font-bold text-blue-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'accepted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {requests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        { filteredRequests.map((request) => (
          <Card key={request.request_id} className="hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{request.customerName}</h3>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Service</p>
                      <p>{request.service_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p>{request.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Requested at</p>
                      <p>{request.createdAt}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{request.description}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {request.status === 'pending' ? (
                    <>
                      <Button size="sm" onClick={() => handleStatusChange(request.request_id, request.customer_id, 'accepted')}>Accept</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleStatusChange(request.request_id, request.customer_id, 'rejected')}>Reject</Button>
                    </>
                  ) :
                   null

                  }
                 
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                      </DialogHeader>
                      {selectedRequest && (
                        <div className="space-y-2">
                          <p><strong>Service:</strong> {selectedRequest.service}</p>
                          <p><strong>Status:</strong> {selectedRequest.status}</p>
                          <p><strong>Customer:</strong> {selectedRequest.customerName}</p>
                          <p><strong>Email:</strong> {selectedRequest.customerEmail}</p>
                          {/* <p><strong>Phone:</strong> {selectedRequest.customerPhone}</p> */}
                          <p><strong>Description:</strong> {selectedRequest.description}</p>
                          <p><strong>Requested At:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  );
}
