import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Label } from "recharts";


const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Check if you're on the login page
    const currentUser= JSON.parse(localStorage.getItem("currentUser"));
    const isLoginPage = location.pathname === "/login";
    const navItems = [
        { path: "/", label: "Home" },
        { path: "/products", label: "Products" },
        { path: "/services", label: "Services" },
        { path: "/blogs", label: "Blogs" },
        //{ path: "", label: "Q&A" },
        { path: "/jobs", label: "Jobs" },
        { path: "/contacts", label: "Contact" },
        ...(currentUser ? [{ path: "/", label:"Shopping Curd"}] : []),


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

                    </div>


                    {/* Desktop Actions */}

                    {(currentUser) ? (

                        <div className="hidden md:flex items-center space-x-4">

                            <Link to="/customer/profile">
                                <Button size="sm" className="solar-gradient text-white"  >
                                    Hi,{currentUser.customerName}
                                    {/*  user name want to add here */}

                                </Button>
                            </Link>
                        </div>
                        
                        
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
                    {/* Mobile Navigation */}
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
                                   <Link to="/login" onClick={() => setIsOpen(false)}>
                                     <Button variant="outline" className="w-full">
                                       Login
                                     </Button>
                                   </Link>
                                   <Link to="/admin" onClick={() => setIsOpen(false)}>
                                     <Button className="w-full solar-gradient text-white">
                                       Admin
                                     </Button>
                                   </Link>
                               </div>
                              </div>
                           </SheetContent>
                          </Sheet>
                        </div>
                    

                </div>
            </div>
        </nav>
    );


}
export default Navigation;