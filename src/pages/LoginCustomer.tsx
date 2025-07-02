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
export interface currentUser{
        customerId:number,
        customerName:string,

    }

const Login = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        contact_no: " ",
        password: "",
        confirmpassword: ""
    });
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",

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
            const res = axios.post("http://localhost/Git/Project1/Backend/RegisterCustomer.php", registerData);
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

        if (!loginData.email || !loginData.password) {
            console.log(" error in data");
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post("http://localhost/Git/Project1/Backend/LoginCustomer.php", loginData);
            // console.log("Login successful:");
            // navigate("/");


            if (res.data.success) {
                console.log("Login successful");
                toast({
                    title: "Welcome back!",
                    description: "Successfully logged in",
                });
                
                // localStorage.setItem('currentUser', JSON.stringify(foundUser));
                const loginUser: currentUser = {
                    customerId: res.data.customer_id,
                    customerName: res.data.userName,

                };
                
                localStorage.setItem('currentUser', JSON.stringify(loginUser));
                console.log(res.data);
                // console.log(res.data.userEmail);
                navigate("/", {

                    state: { name: res.data.userName, email: res.data.userEmail }
                });
                // navigate("/"); // only navigate if login is successful
            } else {
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
                                                <div className="relative">
                                                    {/* <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /> */}
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
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="login-password">Password</Label>
                                                <div className="relative">

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
                                            </div>
                                            <Button type="submit" className="w-full solar-gradient text-white">
                                                Sign In
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="register">
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