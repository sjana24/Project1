import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

import { User, ShoppingCart, Bell, Menu, LogOut } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


import { useAuth } from "@/contexts/AuthContext";
import { ChatWindow } from "./ui/ChatWindow";
import { useCartStore } from "@/store/useCartStore";
import axios from "axios";

export interface CustomerProfileData {
  username: string;
  email: string;
  contact_number: string;
}

export interface Message {
  message_id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  chatId: string;
}

export interface ChatSession {
  chatSession_id: number;
  user_id: number;
  participantName: string;
  messages: Message[];
  isOpen: boolean;
  lastActivity: Date;
  sender_id: number;
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
  name: string;
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
  sender_name: string;
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
  const { checkSession, logout } = useAuth();
  const [isOpenNotify, setIsOpenNotify] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  //  const [openChats, setOpenChats] = useState<string[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
  //const navigate = useNavigate();
  const location = useLocation();

  // State for the Edit Profile form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contact_number: '',
    current_password: '',
    new_password: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Function to fetch current user's profile data
  const fetchProfileData = useCallback(async () => {
    if (!currentUser) return;
    setProfileLoading(true);
    setProfileError(null);
    try {
      const response = await axios.get("http://localhost/Git/Project1/Backend/EditProfile.php", {
        withCredentials: true,
      });

      const result = response.data;
      if (result.success) {
        setFormData({
          username: result.data.username,
          email: result.data.email,
          contact_number: result.data.contact_number,
          current_password: '',
          new_password: '',
        });
      } else {
        setProfileError(result.message);
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setProfileError('Failed to fetch profile data.');
    } finally {
      setProfileLoading(false);
    }
  }, [currentUser]);

  // Handle modal open/close and fetch data
  useEffect(() => {
    if (isProfileModalOpen) {
      fetchProfileData();
    }
  }, [isProfileModalOpen, fetchProfileData]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission to update profile
  const handleSaveProfile = async () => {
    // Client-side validation
    setProfileError(null);
    setProfileSuccess(null);

    const { username, email, contact_number, current_password, new_password } = formData;

    if (!formData.username || !formData.email || !formData.contact_number) {
      setProfileError('All fields are required.');
      return;
    }
    // Username validation: letters, spaces, and hyphens.
    const nameRegex = /^[A-Za-z\s-]+$/;
    if (!nameRegex.test(username)) {
      setProfileError('Name can only contain letters, spaces, and hyphens.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setProfileError('Please enter a valid email address.');
      return;
    }
    const contactRegex = /^07\d{8}$/;
    if (!contactRegex.test(contact_number)) {
      setProfileError('Please enter a valid 10-digit mobile number starting with 07.');
      return;
    }


    if (formData.new_password && formData.new_password.length < 8) {
      setProfileError('New password must be at least 8 characters long.');
      return;
    }

    setProfileLoading(true);

    try {
      const response = await axios.put('http://localhost/Git/Project1/Backend/EditProfile.php',
        { ...formData, user_id: currentUser?.id, user_role: currentUser?.role },
        { withCredentials: true }
      );

      const result = response.data;

      if (result.success) {
        setProfileSuccess('Profile updated successfully!');
        // Update currentUser in state to reflect new data
        setCurrentUser(prevUser => ({
          ...prevUser!,
          name: formData.username,
          email: formData.email,
        }));
        // Optional: Close modal after a delay
        setTimeout(() => setIsProfileModalOpen(false), 1500);
      } else {
        setProfileError(result.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileError('An unexpected error occurred. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };


  useEffect(() => {
    const fetchUser = async () => {
      const user = await checkSession();
      setCurrentUser(user);
      setLoading(false);
    };

    if (!currentUser && !loading) {
      fetchUser();
    }
  }, [currentUser, checkSession, loading]);
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
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Git/Project1/Backend/GetNotificationCustomer.php",
        { withCredentials: true }
      );
      const data = response.data;
      if (data.success) {
        console.log("Data received:", data);
        setNotifications(data.notifications);
      } else {
        console.log("Failed to load notifications:", data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);


  const [openChats, setOpenChats] = useState<number[]>([]);

  // const handleNotificationClick = useCallback((notification: Notification) => {
  //   const existingChat = chatSessions.find(chat => chat.chatSession_id === notification.notification_id);
  //   // console.log("hi buddy");
  //   // console.log(existingChat, "hi 120");
  //   if (!existingChat) {
  //     const newChat: ChatSession = {
  //       sender_id: notification.sender_id,
  //       user_id: notification.user_id,
  //       chatSession_id: notification.notification_id,
  //       participantName: String(notification.user_id),
  //       messages: [],
  //       isOpen: true,
  //       lastActivity: new Date(),
  //     };
  //     console.log(newChat, "hi 129");
  //     setChatSessions(prev => [...prev, newChat]);
  //   }

  //   if (!openChats.includes(notification.notification_id)) {
  //     setOpenChats(prev => [...prev, notification.notification_id]);
  //   }
  // }, [chatSessions, openChats, setChatSessions]);

  const handleNotificationView = (notification: Notification) => {
    // onNotificationClick(notification);
    console.log(" this is 137");
    setIsOpenNotify(false);
    handleNotificationClick(notification);
    // onMarkAsRead(notification.id);

  };
  // Mark single notification as read
  const markNotificationAsRead = async (notification_id: number) => {
    try {
      const response = await axios.post(
        "http://localhost/Git/Project1/Backend/MarkNotificationRead.php",
        { notification_id },
        { withCredentials: true }
      );

      if (response.data.success) {
        setNotifications(prev =>
          prev.map(n =>
            n.notification_id === notification_id ? { ...n, isRead: true } : n
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };
  // Delete a notification
  const deleteNotification = async (notification_id: number) => {
    try {
      const response = await axios.post(
        "http://localhost/Git/Project1/Backend/DeleteNotification.php",
        { notification_id },
        { withCredentials: true }
      );

      if (response.data.success) {
        setNotifications(prev =>
          prev.filter(n => n.notification_id !== notification_id)
        );
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Handle notification click (open chat & mark read)
  const handleNotificationClick = async (notification: Notification) => {
    console.log(notification);
    await markNotificationAsRead(notification.notification_id); // mark single as read
    handleNotificationView(notification); // open chat
  };


  useEffect(() => {
    const fetchUser = async () => {
      const user = await checkSession();
      setCurrentUser(user);
    };

    if (!currentUser) {
      fetchUser();
    }
  }, [currentUser, checkSession]);

  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/services", label: "Services" },

    { path: "/jobs", label: "Jobs" },
    { path: "/blogs", label: "Blogs" },
    { path: "/contacts", label: "Contact" },
    { path: "/aboutus", label: "About Us" },

    //{ path: "", label: "Q&A" },


    ...(currentUser ? [{ path: "/orders", label: "Orders" }] : []),
    ...(currentUser ? [{ path: "/message", label: "Message" }] : []),

    // ...(currentUser ? [{ path: "/", label: "Notification" }] : []),


  ];
  const NavLinks = ({ mobile = false }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`${mobile ? "block py-2 px-4" : "inline-block"

            } text-foreground hover:text-green-700 transition-colors duration-200 ${location.pathname === item.path ? "text-green-700 font-semibold" : ""

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
  // Mark all notifications as read when bell icon clicked
  const markAllNotificationsAsRead = async () => {
    try {
      const response = await axios.post(
        "http://localhost/Git/Project1/Backend/MarkAllNotificationsRead.php",
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };
  // const getChatPosition = useCallback((index: number) => {
  //   return {
  //     // top:100,
  //     bottom: -500,
  //     right: 20 + (index * 340), // 340px = width + margin
  //   };
  // }, []);

  // const openChatSessions = chatSessions.filter(chat => openChats.includes(chat.chatSession_id));

  // const handleCloseChat = useCallback((chatId: number) => {
  //   setOpenChats(prev => prev.filter(id => id !== chatId));
  // }, []);




  const unreadCount = notifications.length;
  // const addToCartItems = items.length;
  return (

    <>
      <nav className="sticky top-0 z-50 glass-effect border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">

              <img src="logoM.JPG" className="h-12 w-12"></img>

            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLinks />
            </div>
            <div className="flex items-center space-x-8">

              {currentUser?.role === "customer" ? (
                <>
                  <span className="relative p-2 hover:bg-gray-100 transition-colors duration-200"><Link to="/cartpage" ><button ><ShoppingCart />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle">

                        {cartCount > 9 ? '9+' : cartCount}

                      </span>
                    )}

                  </button></Link></span>

                  <span className="relative p-2 hover:bg-gray-100 transition-colors duration-200"><button onClick={() => setIsOpenNotify(!isOpenNotify)}>
                    {/* <Bell /> */}
                    {false && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle">

                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}

                  </button></span>

                  <span className="relative p-2 hover:bg-gray-100 transition-colors duration-200">
                    <button onClick={() => {
                      setIsOpenNotify(!isOpenNotify);
                      markAllNotificationsAsRead();
                    }}>
                      <Bell />
                      {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle">
                          {notifications.filter(n => !n.isRead).length > 9 ? '9+' : notifications.filter(n => !n.isRead).length}
                        </span>
                      )}
                    </button>
                  </span>


                </>
              ) : (

                null

              )}

              {isOpenNotify && (
                <div className="absolute right-20 top-full mt-2 w-80 sm:w-96 max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {/* <p className="text-sm text-gray-500 mt-1 block sm:hidden">Tap to open chats</p> */}
                  </div>

                  <div className="max-h-96 overflow-y-auto">

                    {notifications.map((notification) => (
                      <div
                        key={notification.notification_id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 ${!notification.isRead ? 'bg-blue-50' : ''
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                            <p className="font-medium text-gray-900 text-sm">{notification.sender_name}</p>
                            <p className="text-gray-600 text-sm mt-1 break-words">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 items-start">

                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 px-2 py-1"
                              onClick={() => deleteNotification(notification.notification_id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-6 0V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              )}

            </div>


            {/* Desktop Actions */}

            {(currentUser) ? (
              <>
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                    // className="sm:pointer-events-none"
                    >
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          {/* You can add an avatar icon or initials here */}
                          {/* <span className="text-white font-bold">{currentUser.name.charAt(0)}</span> */}
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="hidden md:inline-block text-sm font-medium">
                          Hi, {currentUser.name}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
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
                </div>
              </>
            ) : (
              <div>
                {!isLoginPage ? (
                  <div className="hidden md:flex items-center space-x-4">
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="flex items-center space-x-2">

                        <span>Login/Register</span>


                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {!isLoginPage ? (
                      <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login">
                          <Button variant="outline" size="sm" className="flex items-center space-x-2">

                            <span>Login/Register</span>


                          </Button>
                        </Link>

                      </div>
                    ) : (
                      <div className="hidden md:flex items-center space-x-4">
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Mobile Navigation  */}
            {(currentUser) ? (
              <>
                <div className="md:hidden">
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">

                        <Menu className="h-4 w-4" />

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

                        <Button size="sm"
                          // onClick={logout}
                          onClick={() => {
                            // sessionStorage.removeItem("currentUser");
                            logout();
                            navigate("/");
                            setCurrentUser(null);
                          }}
                          className="bg-white-300 text-black justify-start space-x-2">
                          <LogOut /><span >Logout</span>
                        </Button>

                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              <>
                <div className="md:hidden">
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">

                        <Menu className="h-4 w-4" />

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
              </>
            )}


          </div>

        </div>
        {/* </div> */}
      </nav>

      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your account details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {profileLoading && <div className="text-center text-blue-500">Loading...</div>}
            {profileError && <div className="text-center text-red-500">{profileError}</div>}
            {profileSuccess && <div className="text-center text-green-500">{profileSuccess}</div>}
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                disabled={profileLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                disabled={profileLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mobile Number</label>
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="w-full border px-3 py-2 rounded"
                disabled={profileLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Current Password</label>
              <input
                type="password"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full border px-3 py-2 rounded"
                disabled={profileLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full border px-3 py-2 rounded"
                disabled={profileLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileModalOpen(false)} disabled={profileLoading}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navigation;