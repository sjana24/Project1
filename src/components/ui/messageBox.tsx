import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, ArrowLeft, Search, Send, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
// import { Chat, useChat } from "@/contexts/ChatContext";
import axios from "axios";

export interface Message {
    message_id: number;
    chatSession_id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    is_read: boolean; // or boolean if you convert in backend
    sent_at: string; // ISO datetime string
}

export interface Conversation {
  current_user_role:string;
    chatSession_id: number;
    customer_id: number;
    provider_id: number;
    sender_id: number;
    sender_name: string;
    receiverid: number;
    receriver_name: string;
    customer_username: string;
    provider_username:string;
    messages: Message[];
}


export interface Chat {
    id: number;
    customer_id: number;
    customer_username: string;
    sender_name: string;
    providerId: number;
    provider_name: string;
    cusot
    messages: Message[];
    isActive: boolean;
}
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

const MessageBox = () => {
    // const chats: Chat[] = [
    //     {
    //         id: 6,
    //         customerId: 101,
    //         customerName: "Alice",
    //         providerId: 201,
    //         providerName: "Dr. Bob",
    //         messages: [
    //             {
    //                 id: 1,
    //                 chatId: 5,
    //                 senderId: 101,
    //                 senderName: "Alice",
    //                 // providerId: 201,
    //                 content: "Hi, I need help!",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },
    //             {
    //                 id: 2,
    //                 chatId: 6,
    //                 senderId: 201,
    //                 senderName: "Dr. Bob",
    //                 // receiverId: 101,
    //                 content: "Sure, how can I assist?",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },
    //             {
    //                 id: 3,
    //                 chatId: 6,
    //                 senderId: 1,
    //                 senderName: "Dr. Bob",
    //                 // receiverId: 101,
    //                 content: "Sure, how can I assist?",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },
    //         ],
    //         isActive: true,
    //     },
    //     {
    //         id: 5,
    //         customerId: 101,
    //         customerName: "Alice",
    //         providerId: 201,
    //         providerName: "Dr. Bob",
    //         messages: [
    //             {
    //                 message_id: 1,
    //                 chatSession_id: 5,
    //                 sender_id: 101,
    //                 // sender_name: "Alice",
    //                 // providerId: 201,
    //                 message: "Hi, I need help!",
    //                 sent_at: new Date().toISOString(),
    //                 is: false,
    //             },
    //             {
    //                 id: 2,
    //                 chatId: 6,
    //                 senderId: 201,
    //                 senderName: "Dr. Bob",
    //                 // receiverId: 101,
    //                 content: "Sure, how can I assist?",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },
    //             {
    //                 id: 3,
    //                 chatId: 6,
    //                 senderId: 1,
    //                 senderName: "Dr. Bob",
    //                 // receiverId: 101,
    //                 content: "Sure, how can Idflkgndfkgndkgnskdngsdkg assist?",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },
    //         ],
    //         isActive: true,
    //     },
    //     {
    //         id: 4,
    //         customerId: 101,
    //         customerName: "Alice",
    //         providerId: 201,
    //         providerName: "Dr. Bob",
    //         messages: [
    //             {
    //                 id: 1,
    //                 chatId: 5,
    //                 senderId: 101,
    //                 senderName: "Alice",
    //                 // providerId: 201,
    //                 content: "Hi, I need help!",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },
    //             {
    //                 id: 2,
    //                 chatId: 6,
    //                 senderId: 201,
    //                 senderName: "Dr. Bob",
    //                 // receiverId: 101,
    //                 content: "Sure, how can I assist?",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },
    //             {
    //                 id: 3,
    //                 chatId: 6,
    //                 senderId: 1,
    //                 senderName: "Dr. Bob",
    //                 // receiverId: 101,
    //                 content: "Sure, how can I assissdlkgnsdlkgndsglkst?",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },
    //                     {
    //                 id: 2,
    //                 chatId: 6,
    //                 senderId: 201,
    //                 senderName: "Dr. Bob",
    //                 // receiverId: 101,
    //                 content: "Sure, how can I assist?",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },
    //             {
    //                 id: 3,
    //                 chatId: 6,
    //                 senderId: 1,
    //                 senderName: "Dr. Bob",
    //                 // receiverId: 101,
    //                 content: "Sure, how can I assissdlkgnsdlkgndsglkst?",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },

    //                 {
    //                 id: 2,
    //                 chatId: 6,
    //                 senderId: 201,
    //                 senderName: "Dr. Bob",
    //                 // receiverId: 101,
    //                 content: "Sure, how can I assist?",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },
    //             {
    //                 id: 3,
    //                 chatId: 6,
    //                 senderId: 1,
    //                 senderName: "Dr. Bob",
    //                 // receiverId: 101,
    //                 content: "Sure, how can I assissdlkgnsdlkgndsglkst?",
    //                 timestamp: new Date().toISOString(),
    //                 isBlocked: false,
    //             },

    //         ],
    //         isActive: true,
    //     },
    // ];



    //  const { chatId } = useParams<{ chatId:string }>();
    // const { user } = useAuth();

    const { checkSession } = useAuth();
    // const { getChat, sendMessage, blockMessage } = useChat();
    const { toast } = useToast();
    const [message, setMessage] = useState('');
    // const [isTyping, setIsTyping] = useState(false);
    // const messagesEndRef = useRef<HTMLDivElement>(null);
    const [user, setCurrentUser] = useState<User | null>(() => null);
    const chatId = 1;
    // const chat = chatId ? getChat(chatId) : null;
    // const chat = 1 ? getChat(1) : null;
    // const chat= ;
    const [chat, setChat] = useState<Conversation | null>(() => null);
    const [chatsAll, setChats] = useState<Conversation[]>([]);

    useEffect(() => {
        (async () => {
            if (!user) {
                const user = await checkSession();
                setCurrentUser(user);
            }
        })();
    }, []);

    useEffect(() => {

        axios
            .get("http://localhost/Git/Project1/Backend/GetChats.php", {
                withCredentials: true
            })
            .then((response) => {
                const data = response.data;
                if (data.success) {
                    console.log("Data received:", data);
                    // setChat(data.chats);
                    setChats(data.conversations);
                    console.log("Data received chatsAll:", data.conversations);
                    const zts = data.chats;
                } else {
                    console.log("Failed to load items:", data);
                }
            })
            .catch((err) => {
                console.error("Error fetching cart items:", err);
            });
    }, []);

    //   const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    //   };

    //   useEffect(() => {
    //     scrollToBottom();
    //   }, [chat?.messages]);

    // Simulate real-time updates
    //   useEffect(() => {
    //     const interval = setInterval(() => {
    //       // This would normally be replaced with actual WebSocket connection
    //       // For now, we just scroll to bottom to ensure new messages are visible
    //       scrollToBottom();
    //     }, 1000);

    //     return () => clearInterval(interval);
    //   }, []);

      const handleSendMessage = (chatDetails:any) => {
        console.log("Send message clicked");
        console.log("Message to send:", message);
        console.log("selected chat:", chat);
        console.log("chatIdsolo:", chatDetails);
           console.log("chatIdonly:", chatDetails.chatSession_id

           );
        console.log("chatId:", chatId);
        //
        if (!message.trim() || !chatId) return;

        // sendMessage(chatId, message);
        setMessage('');

        // Check if message was blocked
        // const restrictedKeywords = JSON.parse(localStorage.getItem('restrictedKeywords') || '[]');
        const restrictedKeywords = ['spam', 'offensive', 'blocked'];
        const isBlocked = restrictedKeywords.some((keyword: string) => 
          message.toLowerCase().includes(keyword.toLowerCase())
        );

        if (isBlocked) {
          toast({
            title: "Message blocked",
            description: "Your message contains restricted content and has been blocked",
            variant: "destructive",
          });
        }
    //   };

      const handleBlockMessage = (messageId: number) => {
        // blockMessage(messageId);
        toast({
          title: "Message blocked",
          description: "The message has been blocked by admin",
          variant: "destructive",
        });
      };

      const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage(chatId);
        }
      };
      return 1;

    //   if (!chat) {
    //     return (
    //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
    //         <Card className="w-full max-w-md">
    //           <CardContent className="text-center py-8">
    //             <p className="text-gray-600">Chat not found</p>
    //             <Link to="/" className="text-blue-600 hover:underline mt-2 block">
    //               Return to Dashboard
    //             </Link>
    //           </CardContent>
    //         </Card>
    //       </div>
    //     );
      }
    const getChat = (chatId: number) => {
        console.log("get chatSession called with id:", chatId);
        const selectedChat = chatsAll.find(c => c.chatSession_id === chatId);
        console.log("Selected chat:", selectedChat);
        setChat(selectedChat);
    }
    // const otherParticipant = user?.id === chat.customerId ? chat.providerName : chat.customerName;

    return (
  <>
    {/* <Navigation /> */}
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col md:flex-row  gap-2">
      {/* Chat List Sidebar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 md:w-1/3 lg:w-1/4 h-full overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
          {/* <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div> */}
        </div>
        
        <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
         {chatsAll
  .sort((a, b) => {
    // Get the most recent message timestamp from each chat
    const aLastMsg = a.messages.length > 0 
      ? new Date(a.messages[a.messages.length - 1].sent_at).getTime() 
      : 0;
    const bLastMsg = b.messages.length > 0 
      ? new Date(b.messages[b.messages.length - 1].sent_at).getTime() 
      : 0;
    
    // Sort in descending order (newest first)
    return bLastMsg - aLastMsg;
  })
  .map((chatItem) => (
    <div
      key={chatItem.chatSession_id}
      className={`p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
        chat?.chatSession_id === chatItem.chatSession_id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={() => getChat(chatItem.chatSession_id)}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {chatItem.provider_username?.charAt(0) || 'U'}
          </div>
          {/* <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div> */}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {/* {chatItem.customer_username || 'Unknown User'} */}
               {((chatItem.current_user_role ==="customer")?chatItem.provider_username:chatItem.customer_username)|| 'Unknown User'}
              
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {chatItem.messages.length > 0 && 
                  new Date(chatItem.messages[chatItem.messages.length - 1].sent_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }
              </span>
              {chatItem.messages.filter(m => !m.is_read).length > 0 && (
                <Badge className="bg-blue-500 text-white px-1.5 py-0.5 text-xs min-w-[20px] flex justify-center">
                  {chatItem.messages.filter(m => !m.is_read).length}
                </Badge>
              )}
            </div>
          </div>
          
          {chatItem.messages.slice(-1).map((msg) => (
            <div key={msg.message_id} className="flex items-center gap-2">
              <p className="text-sm text-gray-600 truncate flex-1">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ))}
        </div>
      </div>

      {/* Chat Conversation Area */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex-1 flex flex-col">
  {chat ? (
    <>
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={
                user?.role === 'customer'
                  ? '/customer/dashboard'
                  : user?.role === 'provider'
                  ? '/provider/dashboard'
                  : '/admin/dashboard'
              }
            >
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {/* {chat.receriver_name?.charAt(0) || 'U'} */}
               {((chat.current_user_role ==="customer")?chat.provider_username?.charAt(0) :chat.customer_username?.charAt(0)) || "U"}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                Chat with {((chat.current_user_role ==="customer")?chat.provider_username:chat.customer_username)||"Unknown" }
              </h2>
              {/* <p className="text-sm text-gray-600">
                {chat.customer_username} • Last active recently
              </p> */}
            </div>
          </div>
          {user?.role === 'admin' && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="w-3 h-3" />
              Admin View
            </Badge>
          )}
        </div>
      </div>

      {/* Messages Area - Fixed height with scrolling */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto p-4 bg-gray-50" style={{ maxHeight: 'calc(100vh - 240px)' }}>
          <div className="max-w-4xl mx-auto space-y-4">
            {chat.messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500">
                  Start the conversation by sending a message
                </p>
              </div>
            ) : (
              chat.messages.map((msg) => (
                <div
                  key={msg.message_id}
                  className={`flex ${
                    msg.sender_id === user?.id
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.sender_id === user?.id
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm mb-1 opacity-90">
                          {msg.sender_id === user?.id ? 'You' : chat.receriver_name}
                        </p>
                        <p className="leading-relaxed">{msg.message}</p>
                        <p className="text-xs opacity-75 mt-2">
                          {new Date(msg.sent_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {user?.role === 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6 opacity-70 hover:opacity-100"
                        >
                          <Shield className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Message Input */}
      {user?.role !== 'admin' && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full px-4 py-3"
            />
            <Button
              onClick={() => handleSendMessage(chat)}
              disabled={!message.trim()}
              className="rounded-full px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Select a conversation
        </h3>
        <p className="text-gray-500 mb-6">
          Choose a chat from the sidebar to start messaging
        </p>
      </div>
    </div>
  )}
</div>
    </div>
  </>
);
}


export default MessageBox;