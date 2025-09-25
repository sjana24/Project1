import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactInfo = [
    { icon: Mail, title: "Email Us", description: "Send us an email anytime", details: "contact@solax.com", action: "mailto:contact@solax.com" },
    { icon: Phone, title: "Call Us", description: "Mon-Fri from 8am to 6pm", details: "0701234567", action: "tel:0701234567" },
    { icon: MapPin, title: "Visit Us", description: "Our headquarters", details: "123 Solar Street, Colombo, CA 90210", action: "#" },
    { icon: Clock, title: "Business Hours", description: "When we're available", details: "Mon-Fri: 8am-6pm PST", action: "#" }
  ];

  const validateForm = () => {
    const newErrors: string[] = [];

    // Full name validation: letters and spaces only
    if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.push("Full Name can only contain letters and spaces.");
    }

    // Email validation handled by HTML5 input type="email"

    // Subject minlength
    if (formData.subject.trim().length < 5) {
      newErrors.push("Subject must be at least 5 characters long.");
    }

    // Message minlength
    if (formData.message.trim().length < 10) {
      newErrors.push("Message must be at least 10 characters long.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const res = await axios.post(
        "http://localhost/Git/Project1/Backend/ContactUsCustomer.php",
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you within 24 hours."
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors([]);
      } else {
        toast({
          title: "Failed to Send",
          description: res.data.message || "There was an error sending your message.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "An error occurred while sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about solar energy? Need help with our platform? We're here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 glass-effect">
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>We're here to help with all your solar energy needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-[#26B170]/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-5 w-5 text-[#26B170]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{info.description}</p>
                        <p className="text-sm font-medium text-foreground">{info.details}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 glass-effect">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md space-y-1">
                        {errors.map((err, idx) => (
                          <p key={idx} className="text-red-600 text-sm">{err}</p>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name *</label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address *</label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject *</label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        required
                        minLength={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">Message *</label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your inquiry in detail..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        required
                        minLength={10}
                        className="focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">* Required fields</p>
                      <Button
                        type="submit"
                        className="bg-[#26B170] text-white hover:bg-[#26B170]/90"
                        disabled={isSubmitting}
                      >
                        <Send className="mr-2 h-4 w-4" /> {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
