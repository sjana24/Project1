import {Link, useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button";



const DashboardCustomer = () => {
    const currentUser= JSON.parse(localStorage.getItem("currentUser"));
    const navigate=useNavigate();
    const logout=()=>{
        localStorage.removeItem('currentUser');
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {currentUser.customerName}!</p>
                        </div>
                        <Link to="/">
                            <Button onClick={logout} variant="outline">
                                Logout
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>
        </div>

    );

}
export default DashboardCustomer;