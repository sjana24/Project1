import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import {User} from'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { ChatWindow } from "./ui/ChatWindow";
import { useCartStore } from "@/store/useCartStore";
import axios from "axios";
export interface Message {
  message_id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  chatId: string;
}

export interface ChatSession {
  chatSession_id:  number;
  user_id:number;
  participantName: string;
  messages: Message[];
  isOpen: boolean;
  lastActivity: Date;
  sender_id:number;
}

import { Label } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
  id: number;
  name:string;
  email: string;
  role: string;
}
export interface Notification {
//   id: number;
  type: 'message' | 'support';
  title: string;
  message: string;
  chatId: number;
  timestamp: Date;
  isRead: boolean;

//   interface Notification {
  notification_id: number;
  sender_name:string;
  user_id: number;
  user_type: 'customer' | 'service_provider' | 'admin'; // based on your sample users
//   title: string;
//   message: string;
  is_read: boolean;
  created_at: string; // or `Date` if you parse it
  sender_id: number;
// }

}
export interface item {
    image: string;
    name: string;
    price: number;
    productId: number;
    providerId: number;
    quantity: number;
    userId: number;
}

const Navigation = () => {
    const { checkSession ,logout} = useAuth();
    const [isOpenNotify, setIsOpenNotify] = useState(false);
        const [isOpen, setIsOpen] = useState(false);
//  const [openChats, setOpenChats] = useState<string[]>([]);
         const cartCount = useCartStore((state) => state.cartCount);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
         const [loading, setLoading] = useState(true); // handle async wait
    // Check if you're on the login page
    // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    // const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "null");
//     const [currentUser, setCurrentUser] = useState(() => {
//   return JSON.parse(sessionStorage.getItem("currentUser") || "null");
    const [currentUser, setCurrentUser] = useState<User | null>(() => null);
//   useEffect(() => {
//     const fetchRole = async () => {
//       const user = await checkSession();
//       setCurrentUser(user);
//     //   const x=userR;
//     //   setRole(x); // this will update state with the role (e.g., 'admin')
//       setLoading(false);
//     };
//     fetchRole();
//   }, [checkSession]);
 useEffect(() => {

  axios
    .get("http://localhost/Git/Project1/Backend/GetNotificationCustomer.php", {
    withCredentials:true
    })
    .then((response) => {
      const data = response.data;
      if (data.success) {
        console.log("Data received:", data);
        // setCartItemsCount(data.items);
        // updateCartCount();
        setNotifications(data.notifications);
      } else {
        console.log("Failed to load items:", data);
      }
    })
    .catch((err) => {
      console.error("Error fetching cart items:", err);
    });
}, []);

// const notifications1 :Notification[]= [
    
//       {
//           id: 1,
//           type: 'message',
//           title: 'John sent you a message',
//           message: 'Hey! How are you doing today?',
//           chatId: 11,
//           timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
//           isRead: false,
//         },
//           {
//           id: 2,
//           type: 'message',
//           title: 'John sent you a message',
//           message: 'Hey! How are you doing today?',
//           chatId: 10,
//           timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
//           isRead: false,
//         },
//           {
//           id: 3,
//           type: 'message',
//           title: 'John sent you a message',
//           message: 'Hey! How are you doing today?',
//           chatId: 12,
//           timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
//           isRead: false,
//         },
    
// ]
 const [openChats, setOpenChats] = useState<number[]>([]);

  const handleNotificationClick = useCallback((notification: Notification) => {
    const existingChat = chatSessions.find(chat => chat.chatSession_id === notification.notification_id);
    console.log ("hi buddy");
    console.log(existingChat ,"hi 120");
    if (!existingChat) {
      const newChat: ChatSession = {
        sender_id:notification.sender_id,
        user_id:notification.user_id,
        chatSession_id: notification.notification_id,
        participantName: String(notification.user_id) ,
        messages: [],
        isOpen: true,
        lastActivity: new Date(),
      };
       console.log(newChat ,"hi 129");
      setChatSessions(prev => [...prev, newChat]);
    }

    if (!openChats.includes(notification.notification_id)) {
      setOpenChats(prev => [...prev, notification.notification_id]);
    }
  }, [chatSessions, openChats, setChatSessions]);

const handleNotificationView = (notification: Notification) => {
    // onNotificationClick(notification);
    // console.log( " this is 137");
    setIsOpenNotify(false);
    handleNotificationClick(notification);
    // onMarkAsRead(notification.id);
    
  };
//   const handleSendMessage = useCallback((chatSession_id: number, messageText: string) => {
//     // const newMessage=5;
//     const newMessage: Message = {
//       chat_s: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       text: messageText,
//       sender: 'user',
//       timestamp: new Date(),
//       chatId,
//     };
// });

useEffect(() => {
  const fetchUser = async () => {
    const user = await checkSession();
    setCurrentUser(user);
  };

  if (!currentUser) {
    fetchUser();
  }
}, [currentUser, checkSession]);

    const navigate=useNavigate();
    const isLoginPage = location.pathname === "/login";
    const navItems = [
        { path: "/", label: "Home" },
        { path: "/products", label: "Products" },
        { path: "/services", label: "Services" },
         { path: "/aboutus", label: "About Us" },
        { path: "/blogs", label: "Blogs" },
        //{ path: "", label: "Q&A" },
        { path: "/jobs", label: "Jobs" },
        { path: "/contacts", label: "Contact" },
        // ...(currentUser ? [{ path: "/cartpage", label: "Shopping Curd" }] : []),
        ...(!currentUser ? [{ path: "/provider", label: "Join as provider" }] : []),
        // ...(currentUser ? [{ path: "/", label: "Notification" }] : []),


    ];
    const NavLinks = ({ mobile = false }) => (
        <>
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`${mobile ? "block py-2 px-4" : "inline-block"
                        } text-foreground hover:text-primary transition-colors duration-200 ${location.pathname === item.path ? "text-primary font-semibold" : ""
                        }`}
                    onClick={() => mobile && setIsOpen(false)}
                >
                    {item.label}
                </Link>
            ))}
        </>
    );
     const items: item[] = [
            {
                image: "one.jpeg",
                name: "Sample Product",
                price: 12345,
                productId: 1,
                providerId: 1,
                quantity: 1,
                userId: 1,
            },
        ]

    

    const openNotifyBar = () => {
        console.log(" notify");
    }
    const getChatPosition = useCallback((index: number) => {
    return {
        // top:100,
      bottom: -500,
      right: 20 + (index * 340), // 340px = width + margin
    };
  }, []);

     const openChatSessions = chatSessions.filter(chat => openChats.includes(chat.chatSession_id));

const handleCloseChat = useCallback((chatId: number) => {
    setOpenChats(prev => prev.filter(id => id !== chatId));
  }, []);
  

    const unreadCount = notifications.length;
    // const addToCartItems = items.length;
    return (

        <nav className="sticky top-0 z-50 glass-effect border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">

                        <img src="logoM.JPG" className="h-12 w-12"></img>

                    </Link>
                    {/* Desktop Navigation */}
                    
                    <div className="hidden md:flex items-center space-x-8">
                      <NavLinks />  
                        {currentUser?.role === "customer" ? (
                            <>
                                <span className="relative p-2 hover:bg-gray-100 transition-colors duration-200"><Link to="/cartpage" ><button >cart
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle">
                                            {cartCount > 9 ? '9+' : cartCount}
                                            
                                        </span>
                                    )}

                                </button></Link></span>
                                <span className="relative p-2 hover:bg-gray-100 transition-colors duration-200"><button onClick={() => setIsOpenNotify(!isOpenNotify)}>bell
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}

                                </button></span>
                            </>
                        ) : (
                            <>

                            </>
                        )}
                        {isOpenNotify && (
                            <div className="absolute right-20 top-full mt-2 w-80 sm:w-96 max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in">
                                <div className="p-4 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                    <p className="text-sm text-gray-500 mt-1 block sm:hidden">Tap to open chats</p>
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500">
                                            No notifications yet
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.notification_id}
                                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 ${!notification.isRead ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 text-sm">
                                                            {notification.title}
                                                            
                                                        </p>
                                                        <p className="font-medium text-gray-900 text-sm">
                                                            
                                                            {notification.sender_name}
                                                        </p>
                                                        <p className="text-gray-600 text-sm mt-1 break-words">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            {new Date(notification.created_at).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="w-full sm:w-auto   text-white px-3 py-1 text-xs"
                                                             onClick={() => handleNotificationView(notification)}
                                                    >
                                                        Open Chat
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                    </div>


                    {/* Desktop Actions */}

                    {(currentUser) ? (
                              
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            {/* You can add an avatar icon or initials here */}
            {/* <span className="text-white font-bold">{currentUser.customerName.charAt(0)}</span> */}
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden md:inline-block text-sm font-medium">
            Hi, {currentUser.name}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate('/customer/profile')}>
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            sessionStorage.removeItem("currentUser");
            logout();
            navigate("/");
            setCurrentUser(null);  
          }}
          className="text-red-600"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

                        // <div className="hidden md:flex items-center space-x-4">
                        //   <Link to="/customer/profile">
                        //         <Button size="sm" className="solar-gradient text-white"  >
                        //             Hi,{currentUser.customerName}
                        //             {/*  user name want to add here */}

                        //         </Button>
                        //     </Link>
                        // </div>


                    ) : (
                        <>
                            {!isLoginPage ?
                                <div className="hidden md:flex items-center space-x-4">
                                    <Link to="/login">
                                        <Button variant="outline" size="sm" className="flex items-center space-x-2">

                                            <span>Login/Register</span>


                                        </Button>
                                    </Link>

                                </div>
                                :
                                <div className="hidden md:flex items-center space-x-4">
                                </div>}
                        </>
                    )
                    }
                       {openChatSessions.map((chat, index) => (
                        // <h1> hi buddy
                        //    {/* ${console.log("hiii");} */}

                        // </h1>
                        
        <ChatWindow
          key={chat.chatSession_id}
          chat={chat}
        //    o}
        //   onSendMessage={handleSendMessage}
        //   position={getChatPosition(index)}
          onClose={() => handleCloseChat(chat.chatSession_id)}
        //   onSendMessage={handleSendMessage}
          position={getChatPosition(index)}
        />
      ))}
                    {/* Mobile Navigation */}
                    {(currentUser) ? (<>
                        <div className="md:hidden">
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        {/* <Menu className="h-4 w-4" /> */}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-64">
                                    <div className="flex flex-col space-y-4 mt-8">
                                        <NavLinks mobile />
                                        <div className="pt-4 border-t space-y-2">
                                            <Link to="/customer/profile">
                                                <Button size="sm" className="solar-gradient text-white"  >
                                                    Hi,{currentUser.name}


                                                </Button>
                                            </Link>

                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </>) : (
                        <>
                            <div className="md:hidden">
                                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm">

                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-64">
                                        <div className="flex flex-col space-y-4 mt-8">
                                            <NavLinks mobile />
                                            <div className="pt-4 border-t space-y-2">
                                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                                    <Button variant="outline" className="w-full">
                                                        Login/Register
                                                    </Button>
                                                </Link>

                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </>)}


                </div>
            </div>
        </nav>
    );


}
export default Navigation;