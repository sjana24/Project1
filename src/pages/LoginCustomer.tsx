import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
export interface currentUser {
    customerId: number,
    customerName: string,
    role:string,

}

const Login = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    // const [registerData, setRegisterData] = useState({
    //     name: "",
    //     email: "",
    //     contact_no: " ",
    //     password: "",
    //     confirmpassword: ""
    // });
    const [registerData, setRegisterData] = useState({
  name: "",
  email: "",
  contact_no: "",
  password: "",
  confirmpassword: "",
  role: "",                // "customer" | "service_provider"
  address: "",
  district: "",
  province: "",
  company_name: "",
  business_reg_no: "",
  company_description: "",
  website: ""
});

    // const [loginData, setLoginData] = useState({
    //     email: "",
    //     password: "",
    //     role: "customer" | "service_provider" | "admin",

    // });
    type RoleType = "customer" | "service_provider" | "admin";

const [loginData, setLoginData] = useState<{
  email: string;
  password: string;
  role: RoleType;
}>({
  email: "",
  password: "",
  role: "customer", // ✅ assign a valid default value here
});


    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(registerData);
        const mobileRegex = /^0\d{9}$/; // starts with 0 and has 10 digits total
        if (!registerData.name || !registerData.email || !registerData.password || !registerData.contact_no || !registerData.confirmpassword) {
            console.log(" error in data");
            return;
        }

        // else if (!mobileRegex.test(registerData.mobileNumber)) {
        //     console.log(" error in data");
        //     return;
        // }
        try {
            const res = axios.post("http://localhost/Git/Project1/Backend/RegisterUser.php", registerData);
            // console.log("Registration successful:");
        } catch (err) {
            console.error("Error registering user:", err);
        } finally {
            setIsLoading(false);
        }

        setIsLoading(true);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(loginData);

        if (!loginData.email || !loginData.password || !loginData.role) {
            console.log(" error in data");
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post("http://localhost/Git/Project1/Backend/LoginUser.php", loginData,{withCredentials:true});
            // console.log("Login successful:");
            // navigate("/");


            if (res.data.success) {
                console.log("Login successful ");
                toast({
                    title: "Welcome back!",
                    description: "Successfully logged in",
                });

                // localStorage.setItem('currentUser', JSON.stringify(foundUser));
                const loginUser: currentUser = {
                    customerId: res.data.user_id,
                    customerName: res.data.user_name,
                    role: res.data.user_role,

                };
// localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('jana', JSON.stringify(loginUser));
                // sessionStorage.setItem("currentUser", JSON.stringify(loginUser));
                // sessionStorage.setItem("role", JSON.stringify(loginUser));
                console.log(res.data);
                // if ("customer"===res.data.role){
                    let role=res.data.user_role;
                    // console.log(role);
                    // navigate('/${role}');
                    const cleanRole = role.trim().toLowerCase(); // Remove spaces & make lowercase
navigate(`/${cleanRole}/dashboard`);

                // }
                // else if 
                // console.log(res.data.userEmail);
                // navigate("/", {

                //     state: { name: res.data.userName, email: res.data.userEmail }
                // });
                // navigate("/"); // only navigate if login is successful
            }
            else {
                console.log(res.data);
                toast({
                    title: "Login failed",
                    description: "Invalid credentials or user not found",
                    variant: "destructive",
                });
                console.log(" error in login"); // show error message from PHP

            }
        } catch (err) {
            console.error("Error login user:", err);
        } finally {
            setIsLoading(false);
        }
    };
    const provinces = [
  { value: "Western", label: "Western" },
  { value: "Central", label: "Central" },
  { value: "Southern", label: "Southern" },
  { value: "Northern", label: "Northern" },
  { value: "Eastern", label: "Eastern" },
  { value: "North Western", label: "North Western" },
  { value: "North Central", label: "North Central" },
  { value: "Uva", label: "Uva" },
  { value: "Sabaragamuwa", label: "Sabaragamuwa" },
];

const districtsByProvince: Record<string, string[]> = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
  Eastern: ["Trincomalee", "Batticaloa", "Ampara"],
  NorthWestern: ["Kurunegala", "Puttalam"],
  NorthCentral: ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Monaragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"]
};






    return (
        <div className="min-h-screen">
            <Navigation />

            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto">

                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div className=" flex items-center justify-center">
                                    {/* logo */}
                                    <img src="logoM.JPG" className="h-12 w-12" alt="" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to SolaX</h1>
                            <p className="text-muted-foreground">Join our solar energy community</p>
                        </div>



                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            Login to Your Account
                                        </CardTitle>
                                        <CardDescription>
                                            Access your dashboard, make purchases, and interact with the community.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form className="space-y-4" onSubmit={handleLogin}>
                                            <div className="space-y-2">
                                                <Label htmlFor="login-email">Email</Label>
                                                <Input
                                                    id="login-email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    className="pl-10"
                                                    value={loginData.email}
                                                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="login-password">Password</Label>
                                                <Input
                                                    id="login-password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10"
                                                    value={loginData.password}
                                                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                                    required
                                                />
                                            </div>

                                            {/* Radio Button Group */}
                                            <div className="space-y-2">
                                                <Label>User Type</Label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value="customer"
                                                            checked={loginData.role === "customer"}
                                                            onChange={(e) => setLoginData(prev => ({ ...prev, role: e.target.value as RoleType }))}
                                                        />
                                                        Customer
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value="service_provider"
                                                            checked={loginData.role === "service_provider"}
                                                            onChange={(e) => setLoginData(prev => ({ ...prev, role: e.target.value as RoleType }))}
                                                        />
                                                        Service Provider
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value="admin"
                                                            checked={loginData.role === "admin"}
                                                            onChange={(e) => setLoginData(prev => ({ ...prev, role: e.target.value as RoleType }))}
                                                        />
                                                        Admin
                                                    </label>
                                                </div>
                                            </div>

                                            <Button type="submit" className="w-full solar-gradient text-white">
                                                Sign In
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>



                            {/* <TabsContent value="register">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">

                                            Create New Account
                                        </CardTitle>
                                        <CardDescription>
                                            Join SolaX to access exclusive features, buy products, post reviews, and apply for jobs.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleRegister} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="register-name">Full Name</Label>
                                                <div className="relative">

                                                    <Input
                                                        id="register-name"
                                                        type="text"
                                                        placeholder="John Doe"
                                                        className="pl-10"
                                                        value={registerData.name}
                                                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="register-email">Email</Label>
                                                <div className="relative">

                                                    <Input
                                                        id="register-email"
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        className="pl-10"
                                                        value={registerData.email}
                                                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="register-number">Mobile Number</Label>
                                                <div className="relative">

                                                    <Input
                                                        id="register-number"
                                                        type="number"
                                                        placeholder="077 *** ****"
                                                        className="pl-10"
                                                        value={registerData.contact_no}
                                                        onChange={(e) => setRegisterData(prev => ({ ...prev, contact_no: e.target.value }))}
                                                        required

                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="register-password">Password</Label>
                                                <div className="relative">

                                                    <Input
                                                        id="register-password"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="pl-10"
                                                        value={registerData.password}
                                                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="confirm-password"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="pl-10"
                                                        value={registerData.confirmpassword}
                                                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmpassword: e.target.value }))}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full solar-gradient text-white">
                                                Create Account
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent> */}
                            <TabsContent value="register">
  <Card>
    <CardHeader>
      <CardTitle>Create New Account</CardTitle>
      <CardDescription>Join SolaX to access exclusive features.</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleRegister} className="space-y-4">

        {/* Full Name */}
        <div>
          <Label>Full Name</Label>
          <Input
            type="text"
            placeholder="John Doe"
            value={registerData.name}
            onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        {/* Email */}
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={registerData.email}
            onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        {/* Mobile Number */}
        <div>
          <Label>Mobile Number</Label>
          <Input
            type="tel"
            placeholder="077xxxxxxx"
            pattern="^0\d{9}$"
            value={registerData.contact_no}
            onChange={(e) => setRegisterData(prev => ({ ...prev, contact_no: e.target.value }))}
            required
          />
        </div>

        {/* Password */}
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={registerData.password}
            onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={registerData.confirmpassword}
            onChange={(e) => setRegisterData(prev => ({ ...prev, confirmpassword: e.target.value }))}
            required
          />
        </div>

        {/* Role Radio */}
        <div>
          <Label>Register As</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="customer"
                checked={registerData.role === 'customer'}
                onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                required
                
              />
              Customer
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="service_provider"
                checked={registerData.role === 'service_provider'}
                onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                required
              />
              Service Provider
            </label>
          </div>
        </div>

        {/* Fields for Customer */}
        {registerData.role === 'customer' && (
          <>
            <div>
              <Label>Address</Label>
              <Input
                type="text"
                placeholder="123, Main Street"
                value={registerData.address}
                onChange={(e) => setRegisterData(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>
            {/* <div>
              <Label>District</Label>
              <Input
                type="text"
                placeholder="Colombo"
                value={registerData.district}
                onChange={(e) => setRegisterData(prev => ({ ...prev, district: e.target.value }))}
                required
              />
            </div> */}
            {/* Province Dropdown */}
<div>
  <Label>Province</Label>
  <select
    className="w-full p-2 border rounded"
    value={registerData.province || ""}
    onChange={(e) =>
      setRegisterData((prev) => ({
        ...prev,
        province: e.target.value,
        district: "" // reset district when province changes
      }))
    }
    required
  >
    <option value="">Select Province</option>
    {provinces.map((prov) => (
      <option key={prov.value} value={prov.value}>
        {prov.label}
      </option>
    ))}
  </select>
</div>

{/* District Dropdown */}
<div>
  <Label>District</Label>
  <select
    className="w-full p-2 border rounded"
    value={registerData.district || ""}
    onChange={(e) =>
      setRegisterData((prev) => ({ ...prev, district: e.target.value }))
    }
    required
  >
    <option value="">Select District</option>
    {(districtsByProvince[registerData.province?.replace(/\s/g, "")] || []).map(
      (district) => (
        <option key={district} value={district}>
          {district}
        </option>
      )
    )}
  </select>
</div>

          </>
        )}

        {/* Fields for Service Provider */}
        {registerData.role === 'service_provider' && (
          <>
            <div>
              <Label>Company Name</Label>
              <Input
                type="text"
                placeholder="SolaX Pvt Ltd"
                value={registerData.company_name}
                onChange={(e) => setRegisterData(prev => ({ ...prev, company_name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Business Registration Number</Label>
              <Input
                type="text"
                placeholder="BR123456"
                value={registerData.business_reg_no}
                onChange={(e) => setRegisterData(prev => ({ ...prev, business_reg_no: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Company Description</Label>
              <Input
                type="text"
                placeholder="Solar energy solutions provider"
                value={registerData.company_description}
                onChange={(e) => setRegisterData(prev => ({ ...prev, company_description: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Address</Label>
              <Input
                type="text"
                placeholder="456, Business Park"
                value={registerData.address}
                onChange={(e) => setRegisterData(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>District</Label>
              <Input
                type="text"
                placeholder="Kandy"
                value={registerData.district}
                onChange={(e) => setRegisterData(prev => ({ ...prev, district: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Website</Label>
              <Input
                type="url"
                placeholder="https://solax.com"
                value={registerData.website}
                onChange={(e) => setRegisterData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </>
        )}

        <Button type="submit" className="w-full solar-gradient text-white">
          Create Account
        </Button>
      </form>
    </CardContent>
  </Card>
</TabsContent>

                        </Tabs>
                        <div className="text-center mt-6">
                            <p className="text-sm text-muted-foreground">
                                By creating an account, you can: purchase products & services, post reviews,
                                participate in forums, and apply for jobs.
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                <Link to="/" className="text-primary hover:underline">
                                    Continue browsing without account
                                </Link>
                            </p>
                        </div>





                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

};
export default Login;