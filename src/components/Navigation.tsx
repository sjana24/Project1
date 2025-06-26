import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";


const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Check if you're on the login page
    const isLoginPage = location.pathname === "/login";
    const navItems = [
        { path: "/", label: "Home" },
        { path: "/products", label: "Products" },
        { path: "/services", label: "Services" },
        { path: "/blogs", label: "Blogs" },
        //{ path: "", label: "Q&A" },
        { path: "/jobs", label: "Jobs" },
        { path: "/contacts", label: "Contact" },


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

                    {(0) ? (

                        <div className="hidden md:flex items-center space-x-4">

                            <Link to="/">
                                <Button size="sm" className="solar-gradient text-white"  >
                                    Hi,!
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

                </div>
            </div>
        </nav>
    );


}
export default Navigation;