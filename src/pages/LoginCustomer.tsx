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
import { provinces, districtsByProvince } from "@/store/commonData";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const [isVarificationModel, setVarificationModel] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  const [registerData, setRegisterData] = useState({
    full_name: "",
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


  type RoleType = "customer" | "service_provider" | "admin";

  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
    role: RoleType;
  }>({
    email: "",
    password: "",
    role: "admin" as RoleType,// ✅ assign a valid default value here
  });


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(registerData);
    const mobileRegex = /^0\d{9}$/; // starts with 0 and has 10 digits total
    if (!registerData.full_name || !registerData.email || !registerData.password || !registerData.contact_no || !registerData.confirmpassword) {
      console.log(" error in data");
      return;
    }
    try {
      handleEmailVarification(registerData.email);
    } catch (err) {
      console.error("Error registering user:", err);
    } finally {
      setIsLoading(false);
    }

    setIsLoading(true);
  };

  const handleConfirmOtp = async () => {
    try {
      console.log(otp, registerData);
      const res = await axios.post("http://localhost/Git/Project1/Backend/ConfirmOtp.php", {
        email: registerData.email,
        otp,
      });
      if (res.data.success) {
        const res = await axios.post("http://localhost/Git/Project1/Backend/RegisterUser.php", registerData, { withCredentials: true });
        //     const res = await axios.post("http://localhost/Git/Project1/Backend/RegisterUser.php", {
        //   email: registerData.email,
        //   otp,
        // });
        if (res.data.success) {
          console.log("✅ OTP verified, now register user...");
          toast({
            title: "Account created ",
            description: "Account created successfully",
            // variant:"destructive"
          });

          navigate('/');
        } else {
          toast({
            title: "Account created failed ",
            description: "Something went wrong",
            variant: "destructive"
          });
        }

        setShowOtpModal(false);


      } else {

        toast({
          title: "Varification failed!",
          description: "❌ Invalid OTP",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error confirming OTP:", err);
    }
  };


  const handleEmailVarification = async (email: string) => {
    try {
      const emailSend = await axios.post("http://localhost/Git/Project1/Backend/RequestEmailVarification.php", { "email": registerData.email }, { withCredentials: true });
      if (emailSend.data.success) {

        toast({
          title: "Varification code !",
          description: "Varification code send successfully",
        });
        setShowOtpModal(true);

      }
      else {
        toast({
          title: "Varification code!",
          description: "Varification code failed, Try again another email",
          variant: "destructive",
        });

      }
    } catch (err) {
      console.error("Error registering user:", err);
    } finally {
      setIsLoading(false);
    }

    setIsLoading(true);

  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password || !loginData.role) {
      toast({
        title: "Sign in failed",
        description: "Plese fill required filed",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost/Git/Project1/Backend/LoginUser.php", loginData, { withCredentials: true });

      if (res.data.success) {
        console.log("Login successful ");
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });


        let role = res.data.user_role;
        const cleanRole = role.trim().toLowerCase(); // Remove spaces & make lowercase

        navigate(`/${cleanRole}/dashboard`);

      }
      else {
        toast({
          title: "Login failed",
          description: "Invalid credentials or user not found",
          variant: "destructive",
        });

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
                        <div className="text-right">

                          <a href="/forgot-password" className="text-sm font-medium text-blue-500 hover:underline"
                          >
                            Forgot Password?
                          </a>
                        </div>
                      </div>

                      {/* Radio Button Group */}
                      <div className="space-y-2">
                        <Label>User Type</Label>
                        <div className="flex gap-4 justify-around">
                          <label className="flex items-center gap-2 ">
                            <input
                              type="radio"
                              name="role"
                              value="customer"
                              checked={loginData.role === "customer"}
                              onChange={(e) => setLoginData(prev => ({ ...prev, role: e.target.value as RoleType }))}
                            />
                            Customer
                          </label>
                          <label className="flex items-center gap-2 ">
                            <input
                              type="radio"
                              name="role"
                              value="service_provider"
                              checked={loginData.role === "service_provider"}
                              onChange={(e) => setLoginData(prev => ({ ...prev, role: e.target.value as RoleType }))}
                            />
                            Service Provider
                          </label>
                          {/* <div className="hidden">
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
                          </div> */}
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-[#26B170] text-white hover:bg-[#26B170]">
                        Sign In
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>


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
                          value={registerData.full_name}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, full_name: e.target.value }))}
                          required
                          minLength={3}
                          maxLength={50}
                          pattern="^[A-Za-z\s.,&'\-]+$"
                          title="Name can only contain letters, spaces, and common characters like . , & -"
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
                          placeholder="0771234567"
                          value={registerData.contact_no}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, contact_no: e.target.value }))}
                          required
                          pattern="^0\d{9}$"
                          maxLength={10}
                          title="Mobile number must be exactly 10 digits and start with 0."
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
                          minLength={8}
                          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                          title="Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
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
                              pattern="^[a-zA-Z0-9\s,./-]+$"
                              title="Address can include letters, numbers, spaces, and , . / -"
                            />
                          </div>

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
                                  district: "" // reset district
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
                              pattern="^[a-zA-Z\s.,&'-]+$"
                              title="Company name can only contain letters, spaces, and common characters like . , & -"
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
                              pattern="^BR\d{6}$"
                              title="Business registration number must be in format: BR followed by 6 digits (e.g. BR123456)."
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
                              pattern="^[a-zA-Z0-9\s,./-]+$"
                              title="Address can include letters, numbers, spaces, and , . / -"
                            />
                          </div>

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
                                  district: ""
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

                          <div>
                            <Label>Website</Label>
                            <Input
                              type="url"
                              placeholder="https://solax.com"
                              value={registerData.website}
                              onChange={(e) => setRegisterData(prev => ({ ...prev, website: e.target.value }))}
                              pattern="https?://.+"
                              title="Enter a valid website URL starting with http:// or https://"
                              required
                            />
                          </div>
                        </>
                      )}

                      <Button type="submit" className="w-full bg-[#26B170] text-white hover:bg-[#26B170]">
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
                <Link to="/" className="text-green-600 hover:underline hover:text-green-700">
                  Continue browsing without account
                </Link>
              </p>

            </div>
            <div>
              {/* OTP Modal */}
              <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Email Verification</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-500">Enter the 5–6 digit code sent to your email</p>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    maxLength={6}
                  />
                  <DialogFooter>
                    <div>
                      <Button
                        onClick={handleConfirmOtp}
                      >Confirm OTP</Button>
                      <Button
                        className="b"
                        variant="destructive"
                        onClick={() => handleEmailVarification(registerData.email)}
                      >Resend OTP</Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>





          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

};
export default Login;