import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, ArrowLeft, Send, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
// import { Chat, useChat } from "@/contexts/ChatContext";
import axios from "axios";
import MessageBox from "@/components/ui/messageBox";

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
    chatSession_id: number;
    customer_id: number;
    provider_id: number;
    sender_id: number;
    sender_name: string;
    receiverid: number;
    receriver_name: string;
    customer_username: string;
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

// const MessagePro = () => {
//     // const chats: Chat[] = [
//     //     {
//     //         id: 6,
//     //         customerId: 101,
//     //         customerName: "Alice",
//     //         providerId: 201,
//     //         providerName: "Dr. Bob",
//     //         messages: [
//     //             {
//     //                 id: 1,
//     //                 chatId: 5,
//     //                 senderId: 101,
//     //                 senderName: "Alice",
//     //                 // providerId: 201,
//     //                 content: "Hi, I need help!",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },
//     //             {
//     //                 id: 2,
//     //                 chatId: 6,
//     //                 senderId: 201,
//     //                 senderName: "Dr. Bob",
//     //                 // receiverId: 101,
//     //                 content: "Sure, how can I assist?",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },
//     //             {
//     //                 id: 3,
//     //                 chatId: 6,
//     //                 senderId: 1,
//     //                 senderName: "Dr. Bob",
//     //                 // receiverId: 101,
//     //                 content: "Sure, how can I assist?",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },
//     //         ],
//     //         isActive: true,
//     //     },
//     //     {
//     //         id: 5,
//     //         customerId: 101,
//     //         customerName: "Alice",
//     //         providerId: 201,
//     //         providerName: "Dr. Bob",
//     //         messages: [
//     //             {
//     //                 message_id: 1,
//     //                 chatSession_id: 5,
//     //                 sender_id: 101,
//     //                 // sender_name: "Alice",
//     //                 // providerId: 201,
//     //                 message: "Hi, I need help!",
//     //                 sent_at: new Date().toISOString(),
//     //                 is: false,
//     //             },
//     //             {
//     //                 id: 2,
//     //                 chatId: 6,
//     //                 senderId: 201,
//     //                 senderName: "Dr. Bob",
//     //                 // receiverId: 101,
//     //                 content: "Sure, how can I assist?",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },
//     //             {
//     //                 id: 3,
//     //                 chatId: 6,
//     //                 senderId: 1,
//     //                 senderName: "Dr. Bob",
//     //                 // receiverId: 101,
//     //                 content: "Sure, how can Idflkgndfkgndkgnskdngsdkg assist?",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },
//     //         ],
//     //         isActive: true,
//     //     },
//     //     {
//     //         id: 4,
//     //         customerId: 101,
//     //         customerName: "Alice",
//     //         providerId: 201,
//     //         providerName: "Dr. Bob",
//     //         messages: [
//     //             {
//     //                 id: 1,
//     //                 chatId: 5,
//     //                 senderId: 101,
//     //                 senderName: "Alice",
//     //                 // providerId: 201,
//     //                 content: "Hi, I need help!",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },
//     //             {
//     //                 id: 2,
//     //                 chatId: 6,
//     //                 senderId: 201,
//     //                 senderName: "Dr. Bob",
//     //                 // receiverId: 101,
//     //                 content: "Sure, how can I assist?",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },
//     //             {
//     //                 id: 3,
//     //                 chatId: 6,
//     //                 senderId: 1,
//     //                 senderName: "Dr. Bob",
//     //                 // receiverId: 101,
//     //                 content: "Sure, how can I assissdlkgnsdlkgndsglkst?",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },
//     //                     {
//     //                 id: 2,
//     //                 chatId: 6,
//     //                 senderId: 201,
//     //                 senderName: "Dr. Bob",
//     //                 // receiverId: 101,
//     //                 content: "Sure, how can I assist?",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },
//     //             {
//     //                 id: 3,
//     //                 chatId: 6,
//     //                 senderId: 1,
//     //                 senderName: "Dr. Bob",
//     //                 // receiverId: 101,
//     //                 content: "Sure, how can I assissdlkgnsdlkgndsglkst?",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },

//     //                 {
//     //                 id: 2,
//     //                 chatId: 6,
//     //                 senderId: 201,
//     //                 senderName: "Dr. Bob",
//     //                 // receiverId: 101,
//     //                 content: "Sure, how can I assist?",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },
//     //             {
//     //                 id: 3,
//     //                 chatId: 6,
//     //                 senderId: 1,
//     //                 senderName: "Dr. Bob",
//     //                 // receiverId: 101,
//     //                 content: "Sure, how can I assissdlkgnsdlkgndsglkst?",
//     //                 timestamp: new Date().toISOString(),
//     //                 isBlocked: false,
//     //             },

//     //         ],
//     //         isActive: true,
//     //     },
//     // ];



//     //  const { chatId } = useParams<{ chatId:string }>();
//     // const { user } = useAuth();

//     const { checkSession } = useAuth();
//     // const { getChat, sendMessage, blockMessage } = useChat();
//     const { toast } = useToast();
//     // const [message, setMessage] = useState('');
//     // const [isTyping, setIsTyping] = useState(false);
//     // const messagesEndRef = useRef<HTMLDivElement>(null);
//     const [user, setCurrentUser] = useState<User | null>(() => null);
//     const chatId = 1;
//     // const chat = chatId ? getChat(chatId) : null;
//     // const chat = 1 ? getChat(1) : null;
//     // const chat= ;
//     const [chat, setChat] = useState<Conversation | null>(() => null);
//     const [chatsAll, setChats] = useState<Conversation[]>([]);

//     useEffect(() => {
//         (async () => {
//             if (!user) {
//                 const user = await checkSession();
//                 setCurrentUser(user);
//             }
//         })();
//     }, []);

//     useEffect(() => {

//         axios
//             .get("http://localhost/Git/Project1/Backend/GetChats.php", {
//                 withCredentials: true
//             })
//             .then((response) => {
//                 const data = response.data;
//                 if (data.success) {
//                     console.log("Data received:", data);
//                     // setChat(data.chats);
//                     setChats(data.conversations);
//                     console.log("Data received chatsAll:", data.conversations);
//                     const zts = data.chats;
//                 } else {
//                     console.log("Failed to load items:", data);
//                 }
//             })
//             .catch((err) => {
//                 console.error("Error fetching cart items:", err);
//             });
//     }, []);

//     //   const scrollToBottom = () => {
//     //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     //   };

//     //   useEffect(() => {
//     //     scrollToBottom();
//     //   }, [chat?.messages]);

//     // Simulate real-time updates
//     //   useEffect(() => {
//     //     const interval = setInterval(() => {
//     //       // This would normally be replaced with actual WebSocket connection
//     //       // For now, we just scroll to bottom to ensure new messages are visible
//     //       scrollToBottom();
//     //     }, 1000);

//     //     return () => clearInterval(interval);
//     //   }, []);

//     //   const handleSendMessage = () => {
//     //     if (!message.trim() || !chatId) return;

//     //     // sendMessage(chatId, message);
//     //     setMessage('');

//     //     // Check if message was blocked
//     //     const restrictedKeywords = JSON.parse(localStorage.getItem('restrictedKeywords') || '[]');
//     //     const isBlocked = restrictedKeywords.some((keyword: string) => 
//     //       message.toLowerCase().includes(keyword.toLowerCase())
//     //     );

//     //     if (isBlocked) {
//     //       toast({
//     //         title: "Message blocked",
//     //         description: "Your message contains restricted content and has been blocked",
//     //         variant: "destructive",
//     //       });
//     //     }
//     //   };

//     //   const handleBlockMessage = (messageId: number) => {
//     //     blockMessage(messageId);
//     //     toast({
//     //       title: "Message blocked",
//     //       description: "The message has been blocked by admin",
//     //       variant: "destructive",
//     //     });
//     //   };

//     //   const handleKeyPress = (e: React.KeyboardEvent) => {
//     //     if (e.key === 'Enter' && !e.shiftKey) {
//     //       e.preventDefault();
//     //       handleSendMessage();
//     //     }
//     //   };

//     //   if (!chat) {
//     //     return (
//     //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//     //         <Card className="w-full max-w-md">
//     //           <CardContent className="text-center py-8">
//     //             <p className="text-gray-600">Chat not found</p>
//     //             <Link to="/" className="text-blue-600 hover:underline mt-2 block">
//     //               Return to Dashboard
//     //             </Link>
//     //           </CardContent>
//     //         </Card>
//     //       </div>
//     //     );
//     //   }
//     const getChat = (chatId: number) => {
//         console.log("get chat called with id:", chatId);
//         const selectedChat = chatsAll.find(c => c.chatSession_id === chatId);
//         console.log("Selected chat:", selectedChat);
//         setChat(selectedChat);
//     }
//     // const otherParticipant = user?.id === chat.customerId ? chat.providerName : chat.customerName;

//     return <>
//         <Navigation />
//         <div className="bg-red-300 h-auto flex w-auto p-10">
//             <div className=" grid bg-blue-500 border-4 border-black m-1 w-1/4">

//                 {/* <div className=" border-4 border-black m-1 flex">
//                     <img className="h-10 w-10 rounded-full bg-red-50 items-center" />
//                     <div className=" justify-center items-center">
//                         <h1 className="font-bold">Janakan</h1>
//                         <h1> hi how i want to help u</h1>
//                     </div>
//                     <div className="flex justify-center items-start">
//                         <h1 className="font-bold bg-red-200 rounded-full p-1">6</h1>
//                         <button className="bg-red-400 p-3 rounded-lg " onClick={() => getChat(0)}> ok</button>
//                     </div>

//                 </div> */}
//                 {chatsAll.map((chatItem, index) => (
//                     <div key={chatItem.chatSession_id} className=" border-4 border-black m-1 flex">
//                         <img className="h-10 w-10 rounded-full bg-red-900 items-center" />
//                         <div className=" justify-center items-center">


//                             {/* <h1> hi how i want to help u</h1> */}
//                             <h1>{chatItem.provider_id}</h1>
//                             {/* <h1>{chatItem.messages}</h1> */}
//                             {chatItem.messages.slice(-1).map((msg) => (
//                                 <>
//                                     <h1 className="font-bold">{chatItem.receriver_name}lkk</h1>
//                                     <p key={msg.message_id} className="text-sm text-gray-700 flex">
//                                         <span> {msg.message}</span>
//                                         {/* <span> {msg.sent_at}</span> */}
//                                         <span className="text-lg text-black">
//                                             {new Date(msg.sent_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
//                                                 ? new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//                                                 : new Date(msg.sent_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
//                                             }
//                                         </span>
//                                     </p>
//                                 </>
//                             ))}
//                         </div>
//                         <div className="flex justify-center items-start">
//                             <h1 className="font-bold bg-red-200 rounded-full p-1">6</h1>
//                             <button className="bg-red-400 p-3 rounded-lg " onClick={() => getChat(chatItem.chatSession_id)}> ok</button>
//                         </div>
//                     </div>
//                 ))}
//                 {/* <div className=" border-4 border-black m-1 flex">
//                     <img className="h-10 w-10 rounded-full bg-red-50 items-center" />
//                     <div className=" justify-center items-center">
//                         <h1 className="font-bold">Janakan</h1>
//                         <h1> hi how i want to help u</h1>
//                         <button className="bg-red-400 p-3 rounded-lg " onClick={() => getChat(1)}> ok</button>
//                     </div>
//                     <div className="flex justify-center items-start">
//                         <h1 className="font-bold bg-red-200 rounded-full p-1">6</h1>

//                     </div>

//                 </div> 
//                 <div className=" border-4 border-black m-1 flex">
//                     <img className="h-10 w-10 rounded-full bg-red-50 items-center" />
//                     <div className=" justify-center items-center">
//                         <h1 className="font-bold">Janakan</h1>
//                         <h1> hi how i want to help u</h1>
//                     </div>
//                     <div className="flex justify-center items-start">
//                         <h1 className="font-bold bg-red-200 rounded-full p-1">6</h1>
//                         <button className="bg-red-400 p-3 rounded-lg " onClick={() => getChat(2)}> ok</button>
//                     </div>

//                 </div>
//                  <div className=" border-4 border-black m-1 flex">
//                     <img className="h-10 w-10 rounded-full bg-red-50 items-center" />
//                     <div className=" justify-center items-center">
//                         <h1 className="font-bold">Janakan</h1>
//                         <h1> hi how i want to help u</h1>
//                     </div>
//                     <div className="flex justify-center items-start">
//                         <h1 className="font-bold bg-red-200 rounded-full p-1">6</h1>

//                     </div>

//                 </div> 
//                 <div className=" border-4 border-black m-1 flex">
//                     <img className="h-10 w-10 rounded-full bg-red-50 items-center" />
//                     <div className=" justify-center items-center">
//                         <h1 className="font-bold">Janakan</h1>
//                         <h1> hi how i want to help u</h1>
//                     </div>
//                     <div className="flex justify-center items-start">
//                         <h1 className="font-bold bg-red-200 rounded-full p-1">6</h1>

//                     </div>

//                 </div> */}






//             </div>
//             <div className="bg-green-600 border-4 border-black m-1 w-3/4">
//                 {/* <h1>dkfjnogno</h1> */}

//                 {chat ? (
//                     <div className="min-h-screen bg-gray-50 flex flex-col">
//                         <header className="bg-white shadow-sm border-b">
//                             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//                                 <div className="flex items-center justify-between py-4">
//                                     <div className="flex items-center space-x-4">
//                                         <Link
//                                             to={user?.role === 'customer' ? '/customer/dashboard' :
//                                                 user?.role === 'provider' ? '/provider/dashboard' : '/admin/dashboard'}
//                                         >
//                                             <Button variant="ghost" size="sm">
//                                                 <ArrowLeft className="w-4 h-4 mr-2" />
//                                                 Back
//                                             </Button>
//                                         </Link>
//                                         <div>
//                                             <h1 className="text-xl font-semibold">Chat with
//                                                 {/* {otherParticipant} */}
//                                             </h1>
//                                             <p className="text-sm text-gray-600">
//                                                 {chat.customer_username} ↔ {chat.customer_username}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     {user?.role === 'admin' && (
//                                         <Badge variant="secondary">
//                                             <Shield className="w-3 h-3 mr-1" />
//                                             Admin Monitoring
//                                         </Badge>
//                                     )}
//                                 </div>
//                             </div>
//                         </header>

//                         <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
//                             <Card className="h-full flex flex-col">
//                                 <CardHeader className="flex-shrink-0">
//                                     <CardTitle className="text-center text-sm text-gray-600">
//                                         {chat.messages.length} messages
//                                     </CardTitle>
//                                 </CardHeader>

//                                 <CardContent className="flex-1 flex flex-col p-0">
//                                     <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-96">
//                                         {chat.messages.length === 0 ? (
//                                             <div className="text-center text-gray-500 py-8">
//                                                 <p>No messages yet. Start the conversation!</p>
//                                             </div>
//                                         )
//                                             : (
//                                                 chat.messages.map((msg) => (
//                                                     <div
//                                                         key={msg.message_id}
//                                                         className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
//                                                             }`}
//                                                     >
//                                                         <div
//                                                             className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender_id === user?.id
//                                                                 ? 'bg-blue-600 text-white'
//                                                                 : 'bg-gray-200 text-gray-900'
//                                                                 } ${0 ? 'opacity-50 border-2 border-red-300' : ''}`}
//                                                         >
//                                                             <div className="flex items-start justify-between">
//                                                                 <div className="flex-1">
//                                                                     <p className="text-xs opacity-75 mb-1">{msg.receiver_id}</p>
//                                                                     {0 ? (
//                                                                         <div className="flex items-center space-x-2">
//                                                                             <AlertTriangle className="w-4 h-4 text-red-500" />
//                                                                             <p className="text-sm">Message blocked by admin</p>
//                                                                         </div>
//                                                                     ) : (
//                                                                         <p>{msg.message}</p>
//                                                                     )}
//                                                                     <p className="text-xs opacity-75 mt-1">
//                                                                         <span className="text-xs text-gray-500">
//     {new Date().getTime() - new Date(msg.sent_at).getTime() < 86400000
//         ? new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//         : new Date(msg.sent_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
//           ' ' + 
//           new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     }
// </span>
//                                                                         {/* {new Date(msg.sent_at).toLocaleTimeString()} */}
//                                                                         {/* {msg.sent_at} */}
//                                                                     </p>
//                                                                 </div>
//                                                                 {user?.role === 'admin' && 1 && (
//                                                                     <Button
//                                                                         // variant="ghost"
//                                                                         size="sm"
//                                                                         // onClick={() => handleBlockMessage(msg.id)}
//                                                                         className="ml-2 p-1 h-6 w-6"
//                                                                     >
//                                                                         <Shield className="w-3 h-3" />
//                                                                     </Button>
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))
//                                             )}
//                                         <div
//                                         // ref={messagesEndRef} 
//                                         />
//                                     </div>

//                                     {user?.role !== 'admin' && (
//                                         <div className="flex-shrink-0 p-6 border-t">
//                                             <div className="flex space-x-2">
//                                                 <Input
//                                                     // value={message}
//                                                     // onChange={(e) => setMessage(e.target.value)}
//                                                     // onKeyPress={handleKeyPress}
//                                                     placeholder="Type your message..."
//                                                     className="flex-1"
//                                                 />
//                                                 <Button
//                                                 //   onClick={handleSendMessage}
//                                                 //    disabled={!message.trim()}
//                                                 >
//                                                     <Send className="w-4 h-4" />
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </CardContent>
//                             </Card>
//                         </main>
//                     </div>

//                 ) : (
//                     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                         <Card className="w-full max-w-md">
//                             <CardContent className="text-center py-8">
//                                 <p className="text-gray-600">Chat not found</p>
//                                 <Link to="/" className="text-blue-600 hover:underline mt-2 block">
//                                     Return to Dashboard
//                                 </Link>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 )}
//             </div>
//         </div>

//     </>;
// }

const MessagePro = ()=>{
    return <div><MessageBox/></div>;
}


export default MessagePro;