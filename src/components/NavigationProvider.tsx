import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Label } from "recharts";

export interface Notification {
  id: number;
  type: 'message' | 'support';
  title: string;
  message: string;
  chatId: number;
  timestamp: Date;
  isRead: boolean;
}

const NavigationProvider = () => {
    const [isOpenNotify, setIsOpenNotify] = useState(false);
        const [isOpen, setIsOpen] = useState(false);
    // Check if you're on the login page
    const currentProvider = JSON.parse(localStorage.getItem("currentProvider"));
    const isLoginProviderPage = location.pathname === "/provider/login";
    const navItems = [
        // { path: "/", label: "Home" },
        // { path: "/products", label: "Products" },
        // { path: "/services", label: "Services" },
        // { path: "/blogs", label: "Blogs" },
        //{ path: "", label: "Q&A" },
        // { path: "/jobs", label: "Jobs" },
        // { path: "/contacts", label: "Contact" },
        // ...(currentUser ? [{ path: "/", label: "Shopping Curd" }] : []),
        // ...(!currentUser ? [{ path: "/provider", label: "Join as provider" }] : []),
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

    const notifications :Notification[]= [
    
      {
          id: 1,
          type: 'message',
          title: 'John sent you a message',
          message: 'Hey! How are you doing today?',
          chatId: 10,
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          isRead: false,
        },
          {
          id: 2,
          type: 'message',
          title: 'John sent you a message',
          message: 'Hey! How are you doing today?',
          chatId: 10,
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          isRead: false,
        },
          {
          id: 3,
          type: 'message',
          title: 'John sent you a message',
          message: 'Hey! How are you doing today?',
          chatId: 10,
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          isRead: false,
        },
    
]

    const openNotifyBar = () => {
        console.log(" notify");
    }


    const unreadCount = notifications.length;
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
                        {(currentProvider) ? (
                            <>
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
                                                key={notification.id}
                                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 ${!notification.isRead ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 text-sm">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-gray-600 text-sm mt-1 break-words">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            {new Date(notification.timestamp).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="w-full sm:w-auto   text-white px-3 py-1 text-xs"

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

                    {(currentProvider) ? (

                        <div className="hidden md:flex items-center space-x-4">

                            <Link to="/customer/profile">
                                <Button size="sm" className="solar-gradient text-white"  >
                                    Hi,{currentProvider.providerName}
                                    {/*  user name want to add here */}

                                </Button>
                            </Link>
                        </div>


                    ) : (
                        <>
                            {!isLoginProviderPage ?
                                <div className="hidden md:flex items-center space-x-4">
                                    <Link to="/provider/login   ">
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
                    {/* Mobile Navigation */}
                    {(currentProvider) ? (<>
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
                                                    Hi,{currentProvider.providerName}


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
export default NavigationProvider;