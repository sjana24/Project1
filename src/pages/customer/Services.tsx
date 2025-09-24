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
import {Star } from "lucide-react";
import axios from "axios";
import ServiceRequestModal from "@/components/ui/ServiceRequestModel";
import { useAuth } from "@/contexts/AuthContext";
import { ISelectedServices, IService, serviceCategorys } from "@/store/commonData";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
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
   const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeService, setTypeservice] = useState("");
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [currentUser, setCurrentUser] = useState<User | null>(() => null);
  const [services, setServices] = useState<IService[]>([]);
  const [servicesA, setServicesA] = useState<IService[]>([]);
  // const [selectedServices, setSelectedServices] = useState<ISelectedServices[]>([]);
  const [loading, setLoading] = useState(true);/// itha check pannum ellathukum podananu
  // const [selectedFormData, setSelectedFormData] = useState<formData[]>([]);
  // const [selectedServiceReviews, setSelectedServiceReviews] = useState([]);
  // const [selectedServiceName, setSelectedServiceName] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState("all");


  const { checkSession } = useAuth();
  useEffect(() => {
    (async () => {
      if (!currentUser) {
        const user = await checkSession();
        setCurrentUser(user);
      }
    })();
  }, []);


  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllServicesCustomer.php")
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setServices(data.services);
        }
        else {
        toast({
            title: "Fetch Data",
            description: "Fetch datas failed.",
            variant: "destructive",
          });
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
      (categoryFilter === "all" || service.category === categoryFilter) &&
      (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           service.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        return a.name.localeCompare(b.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });
     

  const handleServiceClick = async (service: any) => {

  if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to send request.",
        variant: "destructive", // optional styling

      });
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    else {
      // const response=await axios.post("http://localhost/Git/Project1/Backend/RequestServiceCustomer.php");
      setIsModalOpen(true);
      setTypeservice(service.category);
      setServicesA(service);

    }

  }
  // const handleViewReviews = async (serviceId: number, service: any) => {
  //   try {
  //     // const response = await fetch(`http://localhost/Git/Project1/Backend/get_reviews.php?service_id=${serviceId}`);
  //     // const data = await response.json();
  //     setSelectedServiceReviews(service.reviews); // assuming backend sends { reviews: [] }
  //     setSelectedServiceName(service.name); // assuming service has a name property
  //   } catch (error) {
  //     console.error("Error fetching reviews:", error);
  //   }
  // };

  // const closeModel = () => {
  //   setIsModalOpen(false);
  //   // setSelectedProduct(null);
  // };
  const handleSendRequestContact = async (service: any) => {

      if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to send request.",
        variant: "destructive", // optional styling

      });
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    else {
      const response = await axios.post("http://localhost/Git/Project1/Backend/RequestContactCustomer.php", service, { withCredentials: true })

      if (response.data.success) {
        toast({
          title: "Request sent!",
          description: ` request sended to ${service.name}.`,
          // description: `${product.productId},${product.name},${product.price},${product.productId},${currentUser.id}`,
        });


      } else {
        toast({
          title: "Request sent failed!",
          description: `"Try another service provider",${response.data.message}`,
          variant: "destructive",
        });
       
      }
    }

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
          title: "Request sent successfully",
          description: `${response.data.message} `,
          // description: `${product.productId},${product.name},${product.price},${product.productId},${currentUser.id}`,
        });


      } else {
        // console.log(response.data);
        toast({
          title: "Request sent failed",
          description: `${response.data.message} `,
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
      <div className="py-20 px-10">
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
                {/* <SelectItem value="provider">Provider</SelectItem> */}
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategorys.map((category) => (
                  <SelectItem key={category.key} value={category.value}>
                    {category.value === "all" ? "All Categories" : category.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services Grid */}
          

          {/* No Results */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              {/* <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" /> */}
              <h3 className="text-xl font-semibold text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <Card
            key={service.service_id}
            className="relative group hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-md border border-gray-200"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
              // style={{
              //   backgroundImage: `url("http://localhost/Git/Project1/Backend/${service.company_image}")`,
              // }}
            ></div>

            <div className="relative z-10">
              <CardHeader className="p-5">
                <div className="flex items-center gap-4 mb-3">
                  {/* <img
                    src={`http://localhost/Git/Project1/Backend/${service.company_image}`}
                    alt={service.company_name}
                    className="w-14 h-14 rounded-xl object-cover border shadow"
                  /> */}
                  <div>
                    <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{service.company_name}</p>
                  </div>
                </div>

                <CardDescription className="line-clamp-2 text-sm text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-5 pb-5 space-y-3">
                {/* Price + Category */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#26B170]">
                    {service.price === 0.00 ? "Free" : `Rs ${Number(service.price).toLocaleString()}`}
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {service.category}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="flex items-center text-sm text-gray-600">
                  {service.average_rating ? (
                    <>
                      <Star size={18} className="text-yellow-500 mr-1" />
                      {service.average_rating}
                    </>
                  ) : (
                    <span className="italic">New Service</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-4">
                  <Button
                    className="bg-[#26B170] hover:bg-[#21965F] text-white w-full"
                    // onClick={() => console.log("Request Service", service)}
                     onClick={() => handleServiceClick(service)}
                  >
                    Request Service
                  </Button>

                  <Button
                    className="bg-[#26B170] hover:bg-[#21965F] text-white w-full"
                    // onClick={() => console.log("Request Contact", service)}
                      onClick={() => handleSendRequestContact(service)}
                  >
                    Request for Contact
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border border-gray-300 hover:bg-gray-50"
                        onClick={() => setSelectedService(service)}
                      >
                        View Details & Reviews
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{selectedService?.name}</DialogTitle>
                      </DialogHeader>

                      {/* Service Full Details */}
                      <div className="space-y-4">
                        {/* <img
                          // src={`http://localhost/Git/Project1/Backend/${selectedService?.company_image}`}
                          alt={selectedService?.company_name}
                          className="w-full max-h-48 object-cover rounded-lg shadow"
                        /> */}
                        <p className="text-gray-700">{selectedService?.description}</p>
                        <p className="text-gray-600 text-sm">
                          <strong>Category:</strong> {selectedService?.category}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <strong>Price:</strong>{" "}
                          {selectedService?.price === "0.00"
                            ? "Free"
                            : `Rs ${Number(selectedService?.price).toLocaleString()}`}
                        </p>

                        {/* Reviews */}
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
                          {selectedService?.reviews?.length > 0 ? (
                            selectedService.reviews.map((review, i) => (
                              <div key={i} className="border rounded-lg p-3 mb-2 bg-gray-50">
                                <p className="text-sm text-gray-600">
                                  Rating: ⭐ {review.rating}
                                </p>
                                <p className="text-gray-800">{review.comment}</p>
                                <p className="text-xs text-gray-500 mt-1">– {review.reviewer_name}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">No reviews yet.</p>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
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