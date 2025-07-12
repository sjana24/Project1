import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const { checkSession } = useAuth();
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // handle async wait

    useEffect(() => {
        const fetchRole = async () => {
            const userRole = await checkSession();
            if (userRole) {
                setRole(userRole.role);
            } else {
                setRole(null);  // No user logged in
            }

            //   const x=userRole.role ??" x";
            //   setRole(x); // this will update state with the role (e.g., 'admin')
            setLoading(false);
        };
        fetchRole();
    }, [checkSession]);

    // Optional: Loading indicator while session is being checked
    if (loading) return <div>Loading...</div>;

    // Role-based access check
    if (!role || !allowedRoles.includes(role)) {
        const cleanRole = role.trim().toLowerCase(); // Remove spaces & make lowercase
        // navigate(`/${cleanRole}/dashboard`);
        // return <Navigate to="/${cleanRole}/dashboard" replace />;
        if (cleanRole === "customer " || "admin" ||" service_provider"){
        return <Navigate to={`/${cleanRole}/dashboard`} replace />;
        }
        // else{
            // return <Navigate to="/" replace />;
        // }

        // return <Navigate to="/" replace />;
    }
    //   else{
    //     // console.log("hi stop");
    //   }

    return <>{children}</>;
};

export default ProtectedRoute;
