import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Search,
  ShoppingCart,
  Check,
  Clock,
  Eye,
  EyeOff,
  MoreHorizontal,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface Review {
  review_id: number;
  rating: number;
  comment: string;
  is_approved: boolean | number;
}

export interface Service {
  service_id: number;
  provider_id: number;
  name: string;
  provider: string;
  category: string;
  price: number;
  description: string;
  images: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  reviews: Review[];
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetAllServicesAdmin.php", { withCredentials: true })
      .then((response) => {
        const data = response.data;
        if (data.success && data.services?.length > 0) {
          const mappedServices = data.services.map((s: any) => ({
            ...s,
            provider: s.provider_name || `Provider ${s.provider_id}`,
            price: parseFloat(s.price),
            reviews: s.reviews || [],
          }));
          setServices(mappedServices);
          setFilteredServices(mappedServices);
        } else {
          setServices([]);
          setFilteredServices([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const getStatusBadge = (is_approved: boolean) => {
    return is_approved ? (
      <Badge className="bg-green-100 text-green-800">
        <Check className="w-3 h-3 mr-1" /> Approved
      </Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </Badge>
    );
  };

  // Toggle service visibility
  const toggleServiceApproval = async (service: Service) => {
    const updatedStatus = !service.is_approved;
    try {
      const res = await axios.post(
        "http://localhost/Git/Project1/Backend/ServiceAdminStatusUpdate.php",
        { service_id: service.service_id, is_active: updatedStatus ? 1 : 0 },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast({
          title: "Service updated",
          description: `${service.name} is now ${
            updatedStatus ? "Approved" : "Pending"
          }`,
        });

        // Update local state
        setServices((prev) =>
          prev.map((s) =>
            s.service_id === service.service_id
              ? { ...s, is_approved: updatedStatus }
              : s
          )
        );
      } else {
        toast({
          title: "Failed to update service",
          description: res.data.message || "Try again later",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle review visibility/approval
 const toggleReviewStatus = async (review: Review, isActive: boolean, serviceId: number) => {
  try {
    const res = await axios.post(
      "http://localhost/Git/Project1/Backend/ServiceReviewStatusUpdate.php",
      { review_id: review.review_id, is_active: isActive ? 1 : 0 },
      { withCredentials: true }
    );

    if (res.data.success) {
      toast({
        title: "Review updated",
        description: `Review is now ${isActive ? "Visible" : "Blocked"}`,
      });

      setServices((prev) =>
        prev.map((s) =>
          s.service_id === serviceId
            ? {
                ...s,
                reviews: s.reviews.map((r) =>
                  r.review_id === review.review_id
                    ? { ...r, is_approved: isActive ?1 :0 }
                    : r
                ),
              }
            : s
        )
      );
    } else {
      toast({
        title: "Failed to update review",
        description: res.data.message || "Try again later",
        variant: "destructive",
      });
    }
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Service Management
          </h1>
          <p className="text-muted-foreground">
            Review and approve services from providers
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, provider, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const avgRating =
            service.reviews.length > 0
              ? (
                  service.reviews.reduce((a, b) => a + b.rating, 0) /
                  service.reviews.length
                ).toFixed(1)
              : null;

          return (
            <Card
              key={service.service_id}
              className="glass-card hover:shadow-lg transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {service.category}
                      </p>
                    </div>
                  </div>
                  {/* <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button> */}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(service.is_approved)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Provider</span>
                    <span className="text-sm">{service.provider}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-medium">
                      Rs {service.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Visible</span>
                    <div className="flex items-center gap-2">
                      {service.is_approved ? (
                        <Eye className="w-4 h-4 text-success" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={service.is_approved}
                        onCheckedChange={() => toggleServiceApproval(service)}
                      />
                    </div>
                  </div>

                  {/* View Details Modal */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="w-full mt-3">
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{service.name} - Details & Reviews</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 text-gray-700">
                        <p>{service.description}</p>
                        <p>
                          <span className="font-semibold">Price:</span> Rs {service.price}
                        </p>
                        <p>
                          <span className="font-semibold">Category:</span> {service.category}
                        </p>
                        {avgRating && (
                          <p className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">Average Rating: {avgRating}/5</span>
                          </p>
                        )}
                        <div>
                          <p className="font-semibold mb-2">Reviews:</p>
                          {service.reviews.length === 0 ? (
                            <p>No reviews yet</p>
                          ) : (
                            <ul className="space-y-3">
                              {service.reviews.map((review) => (
                                <li
                                  key={review.review_id}
                                  className="border p-3 rounded-md flex justify-between items-center"
                                >
                                  <div>
                                    <p className="font-medium">Rating: {review.rating}/5</p>
                                    <p>{review.comment}</p>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    
  <Switch
    checked={review.is_approved === 1} // convert number to boolean
    onCheckedChange={(val: boolean) =>
      toggleReviewStatus(review, val, service.service_id)
    }
  />
  <span className="text-xs mt-1">
  
    {review.is_approved === 1 ? "Disable" : "Enable"}
  </span>
</div>

                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesPage;
