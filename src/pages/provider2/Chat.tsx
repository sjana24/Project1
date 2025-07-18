
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


// export interface ChatSession {
//   chatSession_id: number;
//   request_id: number;
//   customer_id: number;
//   provider_id: number;
//   is_active: boolean;
//   started_at: Date;
//   updated_at: Date;
// }
// export interface ChatSession {
//   chatSession_id: number;       // conversation_id from backend
//   participantName: string;      // You'll need to provide or compute this separately
//   messages: Message[];          // Array of messages
//   isOpen: boolean;              // UI state
//   user_id: number;              // current user ID (logged in user)
//   sender_id: number;            // last sender ID or current user sender ID
//   lastActivity: Date;           // last message sent date
// }

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
}

// export interface Message {
//   message_id: number;
//   chatSession_id: number;
//   sender_id: number;
//   receiver_id: number;
//   message: string;
//   is_read: boolean | number;
//   sent_at: Date;
// }


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
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  const { toast } = useToast();

  useEffect(() => {
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

  const mapMessages = (rawMessages: any[]): Message[] => {
    return rawMessages.map(msg => ({
      message_id: msg.message_id,
      chatSession_id: msg.chatSession_id,
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      message: msg.message,
      is_read: msg.is_read,
      sent_at: new Date(msg.sent_at),
    }));
  };
  const [openChats, setOpenChats] = useState<number[]>([]);

  const openConversation = async (request_id: number) => {

    try {
      const response = await axios.post("http://localhost/Git/Project1/Backend/OpenConversation.php", {
        // customer_id: currentUser.customerId,
        // product_Details: product,
        request_id: request_id,
        // customer_id:customer_id,
        // status:newStatus,

      },
        { withCredentials: true }
      );

      if (response.data.success) {
        // console.log(response.data.conversation);
        console.log(response.data.message);
        if (response.data.success) {
          const convData = response.data.conversation;   // Assuming conversation info here
          const rawMessages = response.data.messages || [];
          const rawMessages2 = response.data.messages[0] || [];    // messages from backend
          console.log(rawMessages);
          const messages = mapMessages(rawMessages);

          // Determine last activity from last message sent date or fallback
          const lastActivity =
            messages.length > 0
              ? messages[messages.length - 1].sent_at
              : new Date();

          const newChatSession: ChatSession = {
            chatSession_id: convData.chatSession_id,
            participantName: convData.customer_username || "hi", // You must supply this or fetch separately
            messages: messages,
            isOpen: true,
            user_id: rawMessages2.sender_id || 0,    // you must get this from backend or from auth context
            sender_id: rawMessages2.receiver_id || 0, // usually current logged in user id
            lastActivity: lastActivity,
          };
          console.log(newChatSession);

          if (!openChats.includes(newChatSession.chatSession_id)) {
            console.log(" this is zhat open ")
            // setOpenChats((prev) => [...prev, newChatSession.chatSession_id]);
            setChatSessions((prev) => [...prev, newChatSession]);
            console.log("Chat sessions now:", [...chatSessions, newChatSession]);
            setOpenChats((prev) => [...prev, newChatSession.chatSession_id]);
            console.log("Open chats now:", [...openChats, newChatSession.chatSession_id]);


          }
        }
      }
    }
    catch (error) {
      console.error("Failed to open conversation:", error);
    }
  }
  // const newConversation: ChatSession = {
  //   conversation_id: response.data.conversation_id,
  //   request_id: request_id,
  //   customer_id: response.data.customer_id, // Ensure backend returns this
  //   provider_id: response.data.provider_id, // Ensure backend returns this
  //   is_active: true,
  //   started_at: new Date(response.data.started_at),
  //   updated_at: new Date(response.data.updated_at)
  // };

  // Avoid duplicate chats
  // if (!openChats.includes(newConversation.conversation_id)) {
  //   setOpenChats((prev) => [...prev, newConversation.conversation_id]);
  //   setChatSessions((prev) => [...prev, newConversation]);
  // }
  // setChatSessions(response.data.conversation);
  const openChatSessions = chatSessions.filter(chatSessions => openChats.includes(chatSessions.chatSession_id));



  const getChatPosition = useCallback((index: number) => {
    return {
      // top:200,
      bottom: 20,
      right: 20 + (index * 340), // 340px = width + margin
    };
  }, []);

  const handleCloseChat = useCallback((chatSession_id: number) => {
    setOpenChats(prev => prev.filter(id => id !== chatSession_id));
    setChatSessions(prev => prev.filter(chatSession_id => chatSession_id !== chatSession_id));
  }, []);

  const handleStatusChange = async (request_id: number, customer_id: number, newStatus: 'accepted' | 'rejected') => {


    const response = await axios.post("http://localhost/Git/Project1/Backend/ManageChatRequest.php", {
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
                      <Button size="sm" onClick={() => handleStatusChange(request.request_id, request.customer_id, 'accepted')}>Accept</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleStatusChange(request.request_id, request.customer_id, 'rejected')}>Reject</Button>
                    </>
                  ) :
                    <>
                      <Button size="sm" onClick={() => openConversation(request.request_id)}>Open chat</Button>
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
        {openChatSessions
          .filter((chat) => {
            const isOpen = openChats.includes(chat.chatSession_id);
            // console.log(`Checking chat ${chat.chatSession_id}, isOpen: ${isOpen}`);
            return isOpen;
          })
          .map((chat, index) => {
            // console.log("Rendering ChatWindow for:", chat);
            return (
              <ChatWindow
                // key={chat.chatSession_id}
                chat={openChatSessions[0]}
                // position={{ bottom: 100, right: 100 }}
                position={getChatPosition(index)}
                onClose={() => handleCloseChat(chat.chatSession_id)}
              />
            );
          })}


        {/* {openChatSessions.map((chatSessions, index) => (


          <ChatWindow
            key={chatSessions.conversation_id}
            chat={chatSessions}
            //    o}
            //   onSendMessage={handleSendMessage}
            //   position={getChatPosition(index)}
            onClose={() => handleCloseChat(chatSessions.conversation_id)}
            //   onSendMessage={handleSendMessage}
            position={getChatPosition(index)}
          />
        ))} */}
      </div>
    </div>
  );
}
