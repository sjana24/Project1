
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    // category: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const $responce=await axios
    try {
      const res = await axios.post("http://localhost/Git/Project1/Backend/ContactUsCustomer.php", formData, { withCredentials: true });

      if (res.data.success) {
        // console.log("messge send successful ");
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you within 24 hours.",
        });

        // console.log(res.data);
      }
      else {
        // console.log(res.data);
        toast({
          title: "Message Sent failed!",
          description: "Try again, please try later.",
          variant: "destructive",
        });
        // console.log(" error in send message"); // show error message from PHP

      }
    } catch (err) {
      console.error("Error login user:", err);
    } finally {

    }

    setFormData({ full_name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      details: "contact@solax.com",
      action: "mailto:contact@solax.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 8am to 6pm",
      details: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our headquarters",
      details: "123 Solar Street, Green City, CA 90210",
      action: "#"
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "When we're available",
      details: "Mon-Fri: 8am-6pm PST",
      action: "#"
    }
  ];


  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about solar energy? Need help with our platform? We're here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 glass-effect">
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    We're here to help with all your solar energy needs
                  </CardDescription>
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

              {/* Quick Actions */}
              {/* <Card className="border-0 glass-effect">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Schedule Consultation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    Request Quote
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="mr-2 h-4 w-4" />
                    Find Local Agent
                  </Button>
                </CardContent>
              </Card> */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="full_name" className="text-sm font-medium text-foreground">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          name="full_name"
                          placeholder="John Wick"
                          required
                          minLength={2}
                          value={formData.full_name}
                          onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                          pattern="^[A-Za-z., ]+$"
                          title="Name can only contain letters, spaces, commas, and periods."
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$"
                          title="Please enter a valid email address (e.g. john@example.com)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium text-foreground">
                          Category *
                        </label>
                        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger
                            className="border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 rounded-md"
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div> */}
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-foreground">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help you?"
                          required
                          minLength={3}
                          value={formData.subject}
                          onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Please describe your inquiry in detail..."
                        rows={6}
                        required
                        minLength={10}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                      />

                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        * Required fields
                      </p>
                      <Button type="submit" className="bg-[#26B170] text-white hover:bg-[#26B170]">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              {/* <Card className="mt-8 border-0 glass-effect">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">How quickly do you respond to inquiries?</h4>
                      <p className="text-sm text-muted-foreground">We typically respond to all inquiries within 24 hours during business days.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Do you offer free consultations?</h4>
                      <p className="text-sm text-muted-foreground">Yes! We offer free initial consultations for all residential and commercial solar projects.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">What areas do you serve?</h4>
                      <p className="text-sm text-muted-foreground">We have certified agents and service providers across the United States. Contact us to find services in your area.</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;