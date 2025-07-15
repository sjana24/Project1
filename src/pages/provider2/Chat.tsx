
// const Chat =()=>{

//     return (
//         <h1>
//             hi
//         </h1>
//     );

// };

// export default Chat;
import React, { useState ,useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';

// Dummy data model
interface Request {
  chat_id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

 
// // const dummyRequests: Request[] = [
//   {
//     id: '1',
//     customerName: 'John Doe',
//     customerEmail: 'john@example.com',
//     customerPhone: '1234567890',
//     service: 'Plumbing',
//     description: 'Fix kitchen sink leak.',
//     status: 'New',
//     createdAt: new Date().toISOString()
//   },
//   // Add more mock requests as needed
// ];

export default function Chat() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

   useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllChatProvider.php",{withCredentials:true})
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");
            const mappedRequests: Request[] = data.requests.map((item: any) => ({
          chat_id: item.contact_id,
          customerName: item.customer_name,
          customerEmail: item.customer_email || 'N/A', // Fallback if email not provided
          customerPhone: item.customer_phone,
          service: item.service_name,
          description: item.description || 'No description provided.',
          status: item.status, // Convert "pending" → "Pending"
          createdAt: item.requested_at
        }));

        setRequests(mappedRequests);

        //   setRequests(data.requests);
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

  const handleStatusChange = (chat_id: number, newStatus: 'accepted' | 'rejected') => {
    setRequests((prev) =>
      prev.map((req) =>
        req.chat_id === chat_id ? { ...req, status: newStatus } : req
      )
    );
  };

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

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p>New: {requests.filter(r => r.status === 'New').length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p>Accepted: {requests.filter(r => r.status === 'Accepted').length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p>Rejected: {requests.filter(r => r.status === 'Rejected').length}</p></CardContent></Card>
      </div> */}
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
        {filteredRequests.map((request) => (
          <Card key={request.chat_id} className="hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{request.customerName}</h3>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Customer</p>
                      <p>{request.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p>{request.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p>{request.customerPhone}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{request.description}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {request.status === 'pending' ? (
                    <>
                      <Button size="sm" onClick={() => handleStatusChange(request.chat_id, 'accepted')}>Accept</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleStatusChange(request.chat_id, 'rejected')}>Reject</Button>
                    </>
                  ):
                  <>
                      <Button size="sm" onClick={() => handleStatusChange(request.chat_id, 'accepted')}>Open chat</Button>
                      {/* <Button variant="destructive" size="sm" onClick={() => handleStatusChange(request.id, 'Rejected')}>Reject</Button> */}
                    </>
                  
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
                          <p><strong>Phone:</strong> {selectedRequest.customerPhone}</p>
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
