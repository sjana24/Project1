import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { useToast } from "@/hooks/use-toast";
import { X, Star } from "lucide-react";
import axios from "axios";
import ServiceRequestModal from "@/components/ui/ServiceRequestModel";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
interface Service {
  service_id: number;
  provider_id: number;
  provider_name: string;
  company_name: string;
  name: string;
  description: string;
  price: number;
  category: string;
  average_rating: number;
  // specifications: string;
  /// rating add pannale
  rating: number;
  company_image: string;
  images: string; // this is a JSON string (array in string)
  is_approved: number;
  created_at: string;
  updated_at: string;
  reviews: string[];
  // success?: boolean;



}
interface SelectedServices {
  address: string;
  battery: string;
  capacity: string;
  city: string;
  email: string;
  fullName: string;
  locationLink: string;
  newAddress: string;
  oldAddress: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  problem: string;
  province: string;
  roofHeight: string;
  roofHeightCurrent: string;
  roofHeightNew: string;
  roofSize: string;
  roofType: string;
  profile_image: string;
  serviceType: "installation" | "relocate" | "maintainance";
  zip: string;
}
interface formData {
  message: string;
  phoneNumber: string;
  preferredDate: string;
}


const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeService, setTypeservice] = useState("");
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [currentUser, setCurrentUser] = useState<User | null>(() => null);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesA, setServicesA] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedServices[]>([]);
  const [loading, setLoading] = useState(true);/// itha check pannum ellathukum podananu
  const [selectedFormData, setSelectedFormData] = useState<formData[]>([]);
  const [selectedServiceReviews, setSelectedServiceReviews] = useState([]);
  const [selectedServiceName, setSelectedServiceName] = useState('');


  const { checkSession } = useAuth();
  useEffect(() => {
    (async () => {
      if (!currentUser) {
        const user = await checkSession();
        setCurrentUser(user);
      }
    })();
  }, []);



  // const services1 = [
  //   {
  //     id: 1,
  //     name: "Solar Panel Installation",
  //     provider: "SolarTech Pro",
  //     description: "Professional residential and commercial solar panel installation with warranty",
  //     price: 100,
  //     priceUnit: "per panel",
  //     rating: 4.9,
  //     image: "/placeholder.svg",
  //     category: "installation",
  //     features: ["Free consultation", "25-year warranty", "Same-day installation"],
  //     phone: "+1 (555) 123-4567",
  //     img: "one.jpeg",
  //     email: "contact@solartechpro.com"
  //   },
  //   {
  //     id: 2,
  //     name: "Solar Panel Installation",
  //     provider: "SolarTech Pro",
  //     description: "Professional residential and commercial solar panel installation with warranty",
  //     price: 100,
  //     priceUnit: "per panel",
  //     rating: 4.9,
  //     image: "/placeholder.svg",
  //     category: "installation",
  //     features: ["Free consultation", "25-year warranty", "Same-day installation"],
  //     phone: "+1 (555) 123-4567",
  //     img: "one.jpeg",
  //     email: "contact@solartechpro.com"
  //   },
  //   {
  //     id: 3,
  //     name: "Solar Panel Installation",
  //     provider: "SolarTech Pro",
  //     description: "Professional residential and commercial solar panel installation with warranty",
  //     price: 100,
  //     priceUnit: "per panel",
  //     rating: 4.9,
  //     image: "/placeholder.svg",
  //     category: "installation",
  //     features: ["Free consultation", "25-year warranty", "Same-day installation"],
  //     phone: "+1 (555) 123-4567",
  //     img: "one.jpeg",
  //     email: "contact@solartechpro.com"
  //   },
  //   {
  //     id: 4,
  //     name: "Solar Panel Installation",
  //     provider: "SolarTech Pro",
  //     description: "Professional residential and commercial solar panel installation with warranty",
  //     price: 100,
  //     priceUnit: "per panel",
  //     rating: 4.9,
  //     image: "/placeholder.svg",
  //     category: "installation",
  //     features: ["Free consultation", "25-year warranty", "Same-day installation"],
  //     phone: "+1 (555) 123-4567",
  //     img: "one.jpeg",
  //     email: "contact@solartechpro.com"
  //   },
  //   {
  //     id: 5,
  //     name: "Solar Panel Installation",
  //     provider: "SolarTech Pro",
  //     description: "Professional residential and commercial solar panel installation with warranty",
  //     price: 100,
  //     priceUnit: "per panel",
  //     rating: 4.9,
  //     image: "/placeholder.svg",
  //     category: "installation",
  //     features: ["Free consultation", "25-year warranty", "Same-day installation"],
  //     phone: "+1 (555) 123-4567",
  //     img: "one.jpeg",
  //     email: "contact@solartechpro.com"
  //   },
  //   {
  //     id: 6,
  //     name: "Solar Panel Installation",
  //     provider: "SolarTech Pro",
  //     description: "Professional residential and commercial solar panel installation with warranty",
  //     price: 100,
  //     priceUnit: "per panel",
  //     rating: 4.9,
  //     image: "/placeholder.svg",
  //     category: "installation",
  //     features: ["Free consultation", "25-year warranty", "Same-day installation"],
  //     phone: "+1 (555) 123-4567",
  //     email: "contact@solartechpro.com",
  //     img: "one.jpeg",
  //   },

  // ]

  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllServicesCustomer.php")
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setServices(data.services);
        }
        else {
          // setError('Failed to load products.');
          console.log(response.data);
          console.log(" sorry we cant get ur products");
        }
        setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        setLoading(false);
      });

  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    // setSelectedProduct(null);
  };


  const filteredServices = services
    .filter(service =>

      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    )


    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        // case "rating":
        // return b.rating - a.rating;
        // case "provider":
        // return a.provider.localeCompare(b.provider);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleServiceClick = async (service: any) => {


    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to add items to your cart.",
        variant: "destructive", // optional styling

      });
    }
    else {
      // const response=await axios.post("http://localhost/Git/Project1/Backend/RequestServiceCustomer.php");
      setIsModalOpen(true);
      setTypeservice(service.category);
      setServicesA(service);

    }

  }
  const handleViewReviews = async (serviceId: number, service: any) => {
    try {
      // const response = await fetch(`http://localhost/Git/Project1/Backend/get_reviews.php?service_id=${serviceId}`);
      // const data = await response.json();
      setSelectedServiceReviews(service.reviews); // assuming backend sends { reviews: [] }
      setSelectedServiceName(service.name); // assuming service has a name property
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // const closeModel = () => {
  //   setIsModalOpen(false);
  //   // setSelectedProduct(null);
  // };
  const handleSendRequestContact = async (service: any) => {

    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to add items to your cart.",
        variant: "destructive", // optional styling

      });
    }
    else {
      // console.log(FormData);
      const response = await axios.post("http://localhost/Git/Project1/Backend/RequestContactCustomer.php", service, { withCredentials: true })

      if (response.data.success) {
        console.log("Request sent successful");
        toast({
          title: "Request sent!",
          description: ` request sended to ${service.name}.`,
          // description: `${product.productId},${product.name},${product.price},${product.productId},${currentUser.id}`,
        });


      } else {
        console.log(response.data);
        toast({
          title: "Request already sent",
          description: "Try another service provider",
          variant: "destructive",
        });
        // toast({
        //   title: "Request sent!",
        //   description: ` request sended to ${service.product_id}.`,
        //   // description: `${product.productId},${product.name},${product.price},${product.productId},${currentUser.id}`,
        // });
      }
    }
    // setIsModalOpen(false);
  }
  const sendRequestToDb = async (formData: any) => {
    //  console.log(formData.message);
    console.log(formData);
    console.log(servicesA);
    // console.log(formData.phoneNumber);
    //  console.log(formData.preferredDate);
    //  setSelectedServices(formData);

    // console.log(formData);
    //  const response=await axios.post("http://localhost/Git/Project1/Backend/RequestServiceCustomer.php",formData,serviceA,{w});
    //   // console.log("Response:", response.data);
    // 
    try {
      const response = await axios.post("http://localhost/Git/Project1/Backend/RequestServiceCustomer.php", { "userData": formData, "serviceData": servicesA }, { withCredentials: true });
      // console.log("Login successful:");
      // navigate("/");


      if (response.data.success) {
        console.log("Request sent successful");
        toast({
          title: "Request sent!",
          description: ` request sended to .`,
          // description: `${product.productId},${product.name},${product.price},${product.productId},${currentUser.id}`,
        });


      } else {
        console.log(response.data);
        toast({
          title: "Request sent failed",
          description: "Invalid credentials check and resend again",
          variant: "destructive",
        });
        // console.log(" error in login"); // show error message from PHP

      }
    } catch (err) {
      console.error("Error login user:", err);
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="py-20">
        <div className="container mx-auto px-4">


          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Solar Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with certified solar professionals for installation, maintenance, and consultation services.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services or providers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Service Name</SelectItem>
                <SelectItem value="provider">Provider</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredServices.map((service) => (
              <Card key={service.service_id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 glass-effect">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {/*  */}
                        <img
                          src={`http://localhost/Git/Project1/Backend/${service.company_image.split(',')[0]}`}
                          alt={service.company_image} className="h-full rounded-lg w-full text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.company_name}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">{service.provider_name}</p>
                        <div className="">
                          <Badge variant="default" className="mt-1 bg-blue-300">
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {/* <Star size={20} className="text-yellow-500" />
                      <span className="text-sm font-medium">
                        {service.average_rating}
                        </span>
                      {/* </Star> */}

                      {service.average_rating != null ? (
                        <>
                          <Star size={20} className="text-yellow-500" />
                          <span className="text-sm font-medium">{service.average_rating}</span>
                        </>
                      ) : (
                        <span className="text-sm font-medium">New Service</span>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground mb-4">
                    {service.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* 123456789 */}
                    {/* {service.features.map((feature, index) => (
                      <h1 key={index} className="text-xs">
                        {feature}
                      </h1>
                    ))} */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {service.price === 0 ? "Free" : `$${service.price}`}
                        </div>
                        <div className="text-sm text-muted-foreground">{service.price}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{service.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{service.email}</span>
                      </div> */}
                    </div>

                    <div className="  flex flex-col sm:flex-row gap-6 justify-center">

                      <Button size="lg"
                        className="  w-full bg-[#26B170] hover:bg-[#21965F] text-white group-hover:scale-105 transition-transform"
                        onClick={() => handleServiceClick(service)}

                      >
                        Request Service
                      </Button>

                      <Button size="lg"
                        className="  w-full bg-[#26B170] hover:bg-[#21965F] text-white group-hover:scale-105 transition-transform"
                        onClick={() => handleSendRequestContact(service)}
                      >

                        Request for Contact
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => handleViewReviews(service.service_id, service)}
                          >
                            View Reviews
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Reviews for {selectedServiceName}</DialogTitle>
                          </DialogHeader>

                          {selectedServiceReviews.length > 0 ? (
                            selectedServiceReviews.map((review, index) => (
                              <div key={index} className="border-b py-3">
                                <p className="text-sm text-muted-foreground">Rating: ⭐ {review.rating}</p>
                                <p className="text-base">{review.comment}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">No reviews available.</p>
                          )}
                        </DialogContent>
                      </Dialog>


                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              {/* <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" /> */}
              <h3 className="text-xl font-semibold text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>

        {/* // isModalOpen && */}
        {/* //  ( */}
        {/* // // <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"> */}
        {/* //   // <div className="bg-white rounded-xl shadow-lg p-6 w-[700px] h-[450px] relative overflow-hidden"> */}
        {/* Close Button */}
        {/* <div className="relative bg-white rounded-lg w-full max-w-5xl shadow-lg z-10 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6"> */}


        {/* <div className="absolute top-3 right-3">
          //                   <button
          //                       onClick={closeModel}
          //                       className="text-gray-500 hover:text-gray-800 transition"
          //                   >
          //                       <X className="w-5 h-5" />
          //                   </button>
          //               </div>


          //           </div>

          //   </div>
          // </div> */}

        <ServiceRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={sendRequestToDb}
          selectedService={typeService}
        // selectedService=ServiceA
        />

      </div>


      <Footer />
    </div>
  );

}
export default Services;