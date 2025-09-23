import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Mail, Key, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 1: Request password reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost/Git/Project1/Backend/RequestPasswordReset.php", {
        email: email
      });

      if (response.data.success) {
        toast({
          title: "Reset code sent",
          description: "Please check your email for the reset code",
        });
        setStep('otp');
      } else {
        toast({
          title: "Reset failed",
          description: response.data.message || "Email not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      toast({
        title: "Request failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost/Git/Project1/Backend/VerifyPasswordReset.php", {
        email: email,
        otp: otp
      });

      if (response.data.success) {
        setResetToken(response.data.reset_token);
        toast({
          title: "Code verified",
          description: "Please enter your new password",
        });
        setStep('newPassword');
      } else {
        toast({
          title: "Verification failed",
          description: response.data.message || "Invalid or expired code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Verification failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Update password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are identical",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost/Git/Project1/Backend/UpdatePassword.php", {
        email: email,
        reset_token: resetToken,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      if (response.data.success) {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated",
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast({
          title: "Update failed",
          description: response.data.message || "Failed to update password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Update failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost/Git/Project1/Backend/RequestPasswordReset.php", {
        email: email
      });

      if (response.data.success) {
        toast({
          title: "Code resent",
          description: "A new reset code has been sent to your email",
        });
      } else {
        toast({
          title: "Resend failed",
          description: response.data.message || "Failed to resend code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error resending code:", error);
      toast({
        title: "Resend failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
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
                <div className="flex items-center justify-center">
                  <img src="logoM.JPG" className="h-12 w-12" alt="SolaX Logo" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
              <p className="text-muted-foreground">
                {step === 'email' && "Enter your email to receive a reset code"}
                {step === 'otp' && "Enter the code sent to your email"}
                {step === 'newPassword' && "Create your new password"}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {step === 'email' && <><Mail className="h-5 w-5" /> Request Reset Code</>}
                  {step === 'otp' && <><Key className="h-5 w-5" /> Verify Reset Code</>}
                  {step === 'newPassword' && <><CheckCircle className="h-5 w-5" /> Set New Password</>}
                </CardTitle>
                <CardDescription>
                  {step === 'email' && "We'll send a 6-digit code to your email address"}
                  {step === 'otp' && `Code sent to ${email}`}
                  {step === 'newPassword' && "Choose a strong password for your account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                
                {/* Step 1: Email Input */}
                {step === 'email' && (
                  <form onSubmit={handleRequestReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#26B170] text-white hover:bg-[#26B170]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Code"}
                    </Button>
                  </form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 'otp' && (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#26B170] text-white hover:bg-[#26B170]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>
                    
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className="text-sm"
                      >
                        Resend Code
                      </Button>
                    </div>
                  </form>
                )}

                {/* Step 3: New Password */}
                {step === 'newPassword' && (
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#26B170] text-white hover:bg-[#26B170]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                )}

                {/* Back to Login */}
                <div className="mt-6 pt-4 border-t">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;