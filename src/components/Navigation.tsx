import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";


const Navigation = () => {



    return (

        <nav className="sticky top-0 z-50 glass-effect border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">

                        <img src="logoM.JPG" className="h-12 w-12"></img>

                        {/* <span className="font-bold text-xl text-foreground">SolaX</span> */}
                    </Link>
                </div>
            </div>
        </nav>
    );


}
export default Navigation;